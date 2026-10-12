/* Hand-tracking playground — MediaPipe Gesture Recognizer, fully client-side.
   The model (~8 MB) is only downloaded after the visitor clicks "Turn on camera". */

const MP_VERSION = "0.10.14";
const MP_BUNDLE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/vision_bundle.mjs`;
const MP_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task";

const ACCENT = "255, 77, 46";
const STABLE_FRAMES = 5;      // frames a gesture must hold before it counts
const MIN_SCORE = 0.6;
const REACTION_COOLDOWN = 2500;
const STROKE_FADE = 4000;     // ms before air-drawing fades out
const FINGERTIPS = [4, 8, 12, 16, 20];
const BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];

const LABELS = {
  None: "Hand detected",
  Open_Palm: "Open palm",
  Closed_Fist: "Fist",
  Pointing_Up: "Pointing",
  Thumb_Up: "Thumbs up",
  Thumb_Down: "Thumbs down",
  Victory: "Peace",
  ILoveYou: "I love you",
};

const REACTIONS = {
  Open_Palm: ["Hey there! 👋", "Thanks for stopping by my portfolio."],
  Thumb_Up: ["Appreciate it! 👍", "Glad you like what you see."],
  Thumb_Down: ["Tough crowd 👎", "Tell me what to improve, my inbox is open."],
  Victory: ["Peace ✌️", "…and clean, well-tested code."],
  ILoveYou: ["🤟 I love you", "That's a real ASL sign, the kind my recognition model learned."],
  Closed_Fist: ["Canvas cleared ✊", ""],
  Pointing_Up: ["Draw mode ☝️", "Move your finger to draw in the air."],
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Elements ---------- */
const stage = document.querySelector(".lab-stage");
if (stage) init();

function init() {
  const video = stage.querySelector(".lab-video");
  const canvas = stage.querySelector(".lab-canvas");
  const ctx = canvas.getContext("2d");
  const startBtn = stage.querySelector(".lab-start");
  const retryBtn = stage.querySelector(".lab-retry");
  const stopBtn = stage.querySelector(".lab-stop");
  const errorText = stage.querySelector(".lab-error-text");
  const loadingText = stage.querySelector(".lab-loading-text");
  const statsEl = stage.querySelector(".lab-stats");
  const meterLabel = stage.querySelector(".lab-meter-label");
  const meterBar = stage.querySelector(".lab-meter-bar i");
  const reactionEl = stage.querySelector(".lab-reaction");
  const reactionTitle = stage.querySelector(".lab-reaction-title");
  const reactionSub = stage.querySelector(".lab-reaction-sub");
  const chips = document.querySelectorAll(".gestures [data-gesture]");

  let recognizer = null;
  let stream = null;
  let running = false;
  let rafId = 0;
  let lastVideoTime = -1;

  // gesture state
  let candidate = null, candidateCount = 0, stable = null;
  let lastReacted = null, lastReactTime = 0, shownDrawHint = false;
  let strokes = [], currentStroke = null;
  let fpsFrames = 0, fpsTime = performance.now(), fps = 0;
  let reactionTl = null;

  const setState = (s) => (stage.dataset.state = s);

  /* ---------- Canvas sizing ---------- */
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(stage.clientWidth * dpr);
    canvas.height = Math.round(stage.clientHeight * dpr);
  };
  new ResizeObserver(resize).observe(stage);

  // Maps normalized video coords → canvas pixels, matching the video's object-fit: cover crop.
  const mapper = () => {
    const w = canvas.width, h = canvas.height;
    const vw = video.videoWidth || w, vh = video.videoHeight || h;
    const s = Math.max(w / vw, h / vh);
    const ox = (w - vw * s) / 2, oy = (h - vh * s) / 2;
    return (p) => [ox + p.x * vw * s, oy + p.y * vh * s];
  };

  /* ---------- Loading ---------- */
  async function loadRecognizer() {
    if (recognizer) return recognizer;
    const { FilesetResolver, GestureRecognizer } = await import(MP_BUNDLE);
    const fileset = await FilesetResolver.forVisionTasks(MP_WASM);
    const make = (delegate) =>
      GestureRecognizer.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate },
        runningMode: "VIDEO",
        numHands: 2,
      });
    try {
      recognizer = await make("GPU");
    } catch {
      recognizer = await make("CPU"); // some devices/browsers lack WebGL2 support
    }
    return recognizer;
  }

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      const err = new Error("insecure");
      err.name = "InsecureContext";
      throw err;
    }
    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 720 } },
      audio: false,
    });
  }

  function describeError(err) {
    switch (err?.name) {
      case "NotAllowedError":
      case "SecurityError":
        return "Camera permission was blocked. Allow camera access from your browser's address bar, then try again.";
      case "NotFoundError":
      case "OverconstrainedError":
        return "No camera was found on this device.";
      case "NotReadableError":
        return "Your camera is being used by another app. Close it and try again.";
      case "InsecureContext":
        return "The camera only works when the site is served over https (or localhost).";
      default:
        return "Couldn't load the hand-tracking model. Check your connection and try again.";
    }
  }

  async function start() {
    setState("loading");
    loadingText.textContent = recognizer ? "Starting camera…" : "Loading hand model…";
    try {
      const [cam] = await Promise.all([openCamera(), loadRecognizer()]);
      stream = cam;
      video.srcObject = stream;
      await video.play();
      resize();
      running = true;
      lastVideoTime = -1;
      setState("running");
      loop();
    } catch (err) {
      console.error(err);
      stopStream();
      errorText.textContent = describeError(err);
      setState("error");
    }
  }

  function stopStream() {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    video.srcObject = null;
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    stopStream();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes = []; currentStroke = null;
    candidate = stable = null; candidateCount = 0;
    highlight(null);
    startBtn.textContent = "Turn camera back on";
    setState("idle");
  }

  /* ---------- Main loop ---------- */
  function loop() {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    if (video.readyState < 2 || video.currentTime === lastVideoTime) return;
    lastVideoTime = video.currentTime;

    const now = performance.now();
    const result = recognizer.recognizeForVideo(video, now);

    fpsFrames++;
    if (now - fpsTime >= 500) {
      fps = Math.round((fpsFrames * 1000) / (now - fpsTime));
      fpsFrames = 0; fpsTime = now;
    }
    const hands = result.landmarks?.length || 0;
    statsEl.textContent = `${hands} hand${hands === 1 ? "" : "s"} · ${fps} fps`;

    updateGesture(result, now);
    draw(result, now);
  }

  /* ---------- Gesture logic ---------- */
  function updateGesture(result, now) {
    // Pick the most confident gesture across all visible hands.
    let best = null, bestHand = -1;
    (result.gestures || []).forEach((list, i) => {
      const g = list?.[0];
      if (g && (!best || g.score > best.score)) { best = g; bestHand = i; }
    });

    if (!best) {
      candidate = stable = null; candidateCount = 0;
      meterLabel.textContent = "Waiting for a hand…";
      meterBar.style.width = "0%";
      highlight(null);
      endStroke();
      return;
    }

    const name = best.score >= MIN_SCORE ? best.categoryName : "None";
    candidateCount = name === candidate ? candidateCount + 1 : 1;
    candidate = name;

    meterLabel.textContent = `${LABELS[name] || name} · ${Math.round(best.score * 100)}%`;
    meterBar.style.width = `${Math.round(best.score * 100)}%`;

    if (candidateCount >= STABLE_FRAMES && stable !== candidate) {
      stable = candidate;
      highlight(stable);
      react(stable, now);
    }

    // Air drawing: follow the index fingertip while pointing (react quickly, 2 frames).
    if (candidate === "Pointing_Up" && candidateCount >= 2) {
      const tip = result.landmarks[bestHand][8];
      addPoint(tip, now);
    } else {
      endStroke();
    }
  }

  function highlight(name) {
    chips.forEach((c) => c.classList.toggle("is-active", c.dataset.gesture === name));
  }

  function react(name, now) {
    if (name === "Closed_Fist") {
      const hadDrawing = strokes.length > 0;
      strokes = []; currentStroke = null;
      if (!hadDrawing) return;
    }
    if (name === "Pointing_Up") {
      if (shownDrawHint) return;
      shownDrawHint = true;
    }
    const reaction = REACTIONS[name];
    if (!reaction) return;
    if (name === lastReacted && now - lastReactTime < REACTION_COOLDOWN) return;
    lastReacted = name; lastReactTime = now;

    reactionTitle.textContent = reaction[0];
    reactionSub.textContent = reaction[1];

    reactionTl?.kill();
    reactionTl = gsap.timeline()
      .fromTo(reactionEl, { opacity: 0, y: 20, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)" })
      .to(reactionEl, { opacity: 0, y: -10, duration: 0.4, delay: 1.8 });

    if (name === "Thumb_Up" || name === "ILoveYou") confetti();
  }

  function confetti() {
    if (reduceMotion) return;
    const colors = [`rgb(${ACCENT})`, "#ffffff", "#ffd86b", "#22c55e"];
    const { clientWidth: w, clientHeight: h } = stage;
    for (let i = 0; i < 36; i++) {
      const bit = document.createElement("span");
      bit.className = "lab-confetti";
      bit.style.background = colors[i % colors.length];
      bit.style.left = `${w / 2}px`;
      bit.style.top = `${h / 2}px`;
      stage.appendChild(bit);
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * Math.min(w, h) * 0.45;
      gsap.to(bit, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 80,
        rotation: Math.random() * 720 - 360,
        opacity: 0,
        duration: 1.2 + Math.random() * 0.6,
        ease: "power3.out",
        onComplete: () => bit.remove(),
      });
    }
  }

  /* ---------- Air drawing ---------- */
  function addPoint(p, now) {
    if (!currentStroke) {
      currentStroke = [];
      strokes.push(currentStroke);
    }
    const prev = currentStroke[currentStroke.length - 1];
    // light smoothing to steady the jitter of the raw landmark
    const x = prev ? prev.x + (p.x - prev.x) * 0.55 : p.x;
    const y = prev ? prev.y + (p.y - prev.y) * 0.55 : p.y;
    currentStroke.push({ x, y, t: now });
  }

  function endStroke() {
    currentStroke = null;
  }

  /* ---------- Rendering ---------- */
  function draw(result, now) {
    const dpr = canvas.width / Math.max(stage.clientWidth, 1);
    const map = mapper();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fading air-drawn strokes
    // trim in place so `currentStroke` keeps pointing at a live array
    for (const s of strokes) while (s.length && now - s[0].t >= STROKE_FADE) s.shift();
    strokes = strokes.filter((s) => s.length > 0 || s === currentStroke);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 7 * dpr;
    ctx.shadowColor = `rgba(${ACCENT}, 0.8)`;
    ctx.shadowBlur = 14 * dpr;
    for (const s of strokes) {
      for (let i = 1; i < s.length; i++) {
        const a = 1 - (now - s[i].t) / STROKE_FADE;
        const [x1, y1] = map(s[i - 1]);
        const [x2, y2] = map(s[i]);
        ctx.strokeStyle = `rgba(${ACCENT}, ${a})`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    ctx.shadowBlur = 0;

    // Hand skeletons
    for (const hand of result.landmarks || []) {
      const pts = hand.map(map);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      for (const [a, b] of BONES) {
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
      }
      ctx.stroke();

      pts.forEach(([x, y], i) => {
        const tip = FINGERTIPS.includes(i);
        ctx.fillStyle = `rgb(${ACCENT})`;
        ctx.beginPath();
        ctx.arc(x, y, (tip ? 5 : 3.5) * dpr, 0, Math.PI * 2);
        ctx.fill();
        if (tip) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 1.5 * dpr;
          ctx.beginPath();
          ctx.arc(x, y, 9 * dpr, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }

    // Pen indicator while drawing
    const last = currentStroke?.[currentStroke.length - 1];
    if (last) {
      const [x, y] = map(last);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x, y, 6 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------- Wiring ---------- */
  startBtn.addEventListener("click", start);
  retryBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", stop);

  // Turn the camera off when the section leaves the screen or the tab is hidden.
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) stop();
  }).observe(stage);
  document.addEventListener("visibilitychange", () => document.hidden && stop());
}
