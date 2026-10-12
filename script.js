gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

/* ---------- Project data (drawer) ---------- */
const PROJECTS = {
  mapmachine: {
    kicker: "Hyper-local lead-generation SaaS · Live & monetized",
    title: "MapMachine",
    lede: "An end-to-end SaaS that finds local businesses on Google Maps, audits their websites, and turns them into scored, ready-to-pitch leads.",
    stack: ["Python", "Playwright", "FastAPI", "Next.js", "TypeScript", "PostgreSQL", "Prisma", "Docker", "Razorpay", "OpenAI"],
    points: [
      "Scrapes Google Maps with Python + Playwright, then audits each business website for load time, mobile-friendliness, CMS type and contact info.",
      "Scores and deduplicates leads, with niche-specific scoring across multiple verticals.",
      "Full CRM dashboard in Next.js: customizable pipeline stages, rich-text notes (Tiptap), OpenAI-generated sales pitches and CSV export.",
      "Production infrastructure: Firebase Google OAuth, Upstash Redis rate limiting, Razorpay subscription tiers (Free / Pro / Business), Dockerized on a Playwright Chromium image.",
    ],
    images: ["mapmachine-1.png", "mapmachine-2.png", "mapmachine-3.png"],
  },
  vedaverse: {
    kicker: "Voice-first AI learning for the visually impaired",
    title: "VedaVerse",
    lede: "A voice-first learning platform that helps blind and visually impaired students study on their own: upload a PDF, then ask it questions by voice or text, listen to it as an audiobook, or test yourself with a generated quiz.",
    stack: ["Python", "Django", "LangChain", "OpenAI", "ChromaDB", "Google Gemini", "SpeechRecognition", "gTTS", "YouTube Data API", "KaTeX"],
    points: [
      "Chat with your documents: a RAG pipeline (LangChain, OpenAI embeddings, ChromaDB) answers from the PDF's own content, in the language the question was asked in.",
      "Quizzes from any PDF: structured multiple-choice questions drawn from across the whole document, scored with instant feedback.",
      "Handwritten problem solver: sketch a math, physics or chemistry problem and Gemini explains the solution step by step, rendered in screen-reader-friendly KaTeX.",
      "Multilingual voice input in English, Hindi and Kannada, plus PDF-to-audiobook with Google Text-to-Speech.",
      "Workflow AI turns a project idea into a step-by-step plan with relevant YouTube tutorials from the YouTube Data API.",
      "Built for production: each PDF's embeddings are stored so it's processed only once, structured outputs make quiz generation reliable, API keys stay out of the code, and a backup model takes over when an AI service is overloaded.",
    ],
    images: ["vedaverse-1.png", "vedaverse-4.png", "vedaverse-5.png", "vedaverse-2.png", "vedaverse-3.png"],
  },
  crm: {
    kicker: "Centralized lead & sales tracking",
    title: "Smart CRM Suite",
    lede: "A lean CRM built for a small operations team that found existing tools too bloated for how they actually work.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    points: [
      "Centralizes customer records, lead tracking and sales activity in one place.",
      "Real-time analytics dashboards give the team daily visibility into pipeline metrics and scheduled follow-ups.",
      "Secure authentication, with a fast, stripped-back interface tailored to the team's workflow.",
    ],
    images: ["crm-1.png", "crm-2.png"],
  },
  connectflow: {
    kicker: "WhatsApp customer engagement automation",
    title: "ConnectFlow",
    lede: "Automated WhatsApp workflows that answer customers 24/7, schedule calls and qualify leads before a human ever steps in.",
    stack: ["Node.js", "Express.js", "WhatsApp Cloud API"],
    points: [
      "Handles high-volume customer inquiries, appointment scheduling and lead qualification automatically.",
      "Integrated with the CRM so conversation data routes into records instantly — no more leads lost to slow replies.",
    ],
    images: ["connectflow-1.png", "connectflow-2.png"],
  },
  figotees: {
    kicker: "Brand storefront · Design & build",
    title: "Figotees",
    lede: "A premium digital storefront crafted to reflect the Figotees brand identity and turn a scattered set of pages into one cohesive shopping experience.",
    stack: ["Web design", "Frontend", "E-commerce"],
    points: [
      "Unified fragmented pages into a single storefront that showcases collections and builds instant trust.",
      "Clean typography, generous whitespace and smooth interactions — taken from wireframes to high-fidelity build.",
    ],
    images: ["figotees-1.png", "figotees-2.png"],
  },
  signlang: {
    kicker: "Computer vision · Real-time gesture-to-text",
    title: "Sign Language Recognition",
    lede: "A webcam app that tracks 21 hand landmarks in real time and translates gestures into text.",
    stack: ["Python", "OpenCV", "MediaPipe", "TensorFlow / Keras"],
    cta: { label: "Try it yourself — live demo ↓", target: "#lab" },
    points: [
      "Hybrid rule-based + ML pipeline reaching up to 90% confidence on key gestures.",
      "Complete ML pipeline: data collection, model training and real-time inference in an interactive webcam application.",
    ],
    images: [],
  },
};

/* ---------- Smooth scroll ---------- */
const lenis = new Lenis({ duration: 1.15, smoothWheel: !reduceMotion });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0 });
  });
});

/* ---------- Clock (Bangalore time) ---------- */
const clock = document.getElementById("clock");
const tick = () => {
  clock.textContent = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata",
  });
};
tick();
setInterval(tick, 30_000);

/* ---------- Hide nav on scroll down, show on scroll up ---------- */
const nav = document.querySelector(".nav");
lenis.on("scroll", ({ scroll, direction }) => {
  nav.classList.toggle("is-hidden", direction === 1 && scroll > 200);
});

/* ---------- Split paragraphs into words ---------- */
document.querySelectorAll(".split").forEach((el) => {
  el.innerHTML = el.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="word"><span>${w}</span></span>`)
    .join(" ");
});

/* ---------- Loader → hero intro ---------- */
const loader = document.querySelector(".loader");
const count = document.querySelector(".loader-count");
const counter = { v: 0 };

gsap.timeline({ delay: 0.1 })
  .to(counter, {
    v: 100,
    duration: reduceMotion ? 0.01 : 1.4,
    ease: "power2.inOut",
    onUpdate: () => (count.textContent = Math.round(counter.v)),
  })
  .to(loader, { yPercent: -100, duration: 0.9, ease: "power4.inOut" })
  .from(".hero-title .line > span", { yPercent: 110, duration: 1.1, stagger: 0.09, ease: "power4.out" }, "-=0.4")
  .from(".hero-meta, .nav", { opacity: 0, y: -10, duration: 0.6 }, "-=0.8")
  .from(".hero-portrait", { clipPath: "inset(100% 0 0 0)", duration: 1, ease: "power4.out" }, "-=0.9")
  .from(".hero-portrait img", { scale: 1.3, duration: 1.4, ease: "power3.out" }, "<")
  .from(".hero-intro, .scroll-hint", { opacity: 0, y: 20, duration: 0.8 }, "-=1")
  .add(() => loader.remove());

/* ---------- Scroll reveals ---------- */
document.querySelectorAll(".split").forEach((el) => {
  gsap.from(el.querySelectorAll(".word > span"), {
    yPercent: 110,
    duration: 0.9,
    stagger: 0.02,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 85%" },
  });
});

gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 92%" },
  });
});

gsap.from(".footer-title .line > span", {
  yPercent: 110,
  duration: 1.1,
  stagger: 0.1,
  ease: "power4.out",
  scrollTrigger: { trigger: ".footer", start: "top 70%" },
});

/* Hero parallax */
gsap.to(".hero-title", {
  yPercent: -15,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
});

/* ---------- Horizontal work scroll (desktop) ---------- */
ScrollTrigger.matchMedia({
  "(min-width: 761px)": () => {
    const track = document.querySelector(".work-track");
    const distance = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: ".work",
        start: "top top",
        end: () => "+=" + distance(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  },
});

/* Recalculate positions once screenshots have loaded */
window.addEventListener("load", () => ScrollTrigger.refresh());

/* ---------- Project drawer ---------- */
const drawer = document.querySelector(".drawer");
const panel = drawer.querySelector(".drawer-panel");
const drawerCta = drawer.querySelector(".drawer-cta");
let lastTrigger = null;

function openProject(key, trigger) {
  const p = PROJECTS[key];
  if (!p) return;
  lastTrigger = trigger;
  drawer.querySelector(".drawer-kicker").textContent = p.kicker;
  drawer.querySelector(".drawer-title").textContent = p.title;
  drawer.querySelector(".drawer-lede").textContent = p.lede;
  drawer.querySelector(".drawer-stack").innerHTML = p.stack.map((s) => `<li>${s}</li>`).join("");
  drawerCta.hidden = !p.cta;
  if (p.cta) {
    drawerCta.textContent = p.cta.label;
    drawerCta.setAttribute("href", p.cta.target);
  }
  drawer.querySelector(".drawer-points").innerHTML = p.points.map((s) => `<li>${s}</li>`).join("");
  drawer.querySelector(".drawer-gallery").innerHTML = p.images
    .map((src) => `<img src="assets/projects/${src}" alt="${p.title} screenshot" loading="lazy" />`)
    .join("");

  drawer.hidden = false;
  panel.scrollTop = 0;
  lenis.stop();
  gsap.fromTo(".drawer-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.4 });
  gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: "power4.out" });
  drawer.querySelector(".drawer-close").focus();
}

function closeProject(onClosed) {
  if (drawer.hidden) return;
  gsap.to(".drawer-backdrop", { opacity: 0, duration: 0.4 });
  gsap.to(panel, {
    xPercent: 100,
    duration: 0.5,
    ease: "power3.in",
    onComplete: () => {
      drawer.hidden = true;
      lenis.start();
      if (typeof onClosed === "function") onClosed();
      else lastTrigger?.focus({ preventScroll: true });
    },
  });
}

// "Try it yourself" → close the drawer, glide to the playground, nudge the camera button.
drawerCta.addEventListener("click", (e) => {
  e.preventDefault();
  const target = document.querySelector(drawerCta.getAttribute("href"));
  closeProject(() => {
    lenis.scrollTo(target, {
      duration: 1.6,
      onComplete: () => {
        const startBtn = target.querySelector(".lab-start");
        if (!startBtn || startBtn.offsetParent === null) return; // camera already running
        startBtn.focus({ preventScroll: true });
        gsap.fromTo(startBtn, { scale: 1 }, { scale: 1.12, duration: 0.35, yoyo: true, repeat: 3, ease: "power2.inOut" });
      },
    });
  });
});

document.querySelectorAll("[data-project]").forEach((el) =>
  el.addEventListener("click", () => openProject(el.dataset.project, el))
);
drawer.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeProject));
document.addEventListener("keydown", (e) => e.key === "Escape" && closeProject());

/* ---------- Custom cursor ---------- */
if (canHover) {
  const cursor = document.querySelector(".cursor");
  const label = cursor.querySelector(".cursor-label");
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
  let mx = -100, my = -100;

  // Check what's under the pointer on every move AND every scroll — cards slide
  // under a still mouse during the horizontal scroll, which mouseenter/leave miss.
  const updateCursor = () => {
    const target = drawer.hidden && document.elementFromPoint(mx, my)?.closest("[data-cursor]");
    if (target) label.textContent = target.dataset.cursor;
    cursor.classList.toggle("is-view", !!target);
  };

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    xTo(mx); yTo(my);
    updateCursor();
  });
  lenis.on("scroll", updateCursor);
  document.querySelectorAll("[data-cursor]").forEach((el) =>
    el.addEventListener("click", () => cursor.classList.remove("is-view"))
  );

  /* Magnetic buttons */
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.3,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.4,
        ease: "power3.out",
      });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" }));
  });
}
