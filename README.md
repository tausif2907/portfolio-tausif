# Tausif Ansari — Portfolio

Personal portfolio of **Tausif Ansari**, a full-stack & AI developer.

**Live:** [portfolio-tausif.vercel.app](https://portfolio-tausif.vercel.app)

![Profile](assets/profile.jpg)

## Highlights

- **Pinned horizontal work section:** project cards scroll sideways as you scroll down, and each one opens a detail drawer with screenshots, stack and write-up.
- **Hand-tracking playground:** turn on your camera and the site reacts to your hand gestures: thumbs up, "I love you" in ASL, pointing to draw in the air, and a fist to clear the canvas. It is powered by the [MediaPipe Gesture Recognizer](https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer) and runs fully in the browser. No video ever leaves your device, and the ~8 MB model only downloads after you opt in.
- **Smooth scrolling & motion:** built with Lenis and GSAP ScrollTrigger.
- **Plain web stack:** hand-written HTML, CSS and JavaScript, with no framework and no build step.

## Featured projects

| Project | What it is |
| --- | --- |
| **MapMachine** | Hyper-local lead-generation SaaS (live & monetized) |
| **VedaVerse** | Voice-first AI learning for the visually impaired |
| **Smart CRM Suite** | Centralized lead & sales tracking |
| **ConnectFlow** | WhatsApp customer-engagement automation |
| **Figotees** | Brand storefront (design & build) |
| **Sign Language Recognition** | Real-time gesture-to-text with computer vision |

## Tech stack

- HTML5, CSS3, vanilla JavaScript (ES modules)
- [GSAP](https://gsap.com) + ScrollTrigger for animation
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- [MediaPipe Tasks Vision](https://ai.google.dev/edge/mediapipe) for hand tracking
- Deployed on [Vercel](https://vercel.com) as a static site

## Project structure

```
.
├── index.html        # Page markup
├── style.css         # All styles
├── script.js         # Scrolling, animations, project data & detail drawer
├── hands.js          # Hand-tracking playground (MediaPipe)
├── assets/
│   ├── profile.jpg
│   └── projects/     # Project screenshots
└── vercel.json       # Tells Vercel to serve the files as-is (no build)
```

## Run locally

Serve the folder over a local web server. Don't open `index.html` directly from disk, because the camera only works on `localhost` or HTTPS.

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

## Deployment

Every push to `main` deploys automatically on Vercel. `vercel.json` sets the framework to *Other*, so no install or build step runs.

## Contact

- LinkedIn: [tausifansari2907](https://www.linkedin.com/in/tausifansari2907)
- GitHub: [tausif2907](https://github.com/tausif2907)
- Email: tausifansari2907@gmail.com

---

© Tausif Ansari. All rights reserved.
