// index.js
export const servicesData = [
  {
    title: "Programming Languages",
    description: "Core languages used for software development and data manipulation.",
    items: [
      { id: 1, title: "Java", description: "(Object-Oriented Programming, Backend Logic)" },
      { id: 2, title: "SQL", description: "(Database Management, Query Optimization)" }
    ]
  },
  {
    title: "Web Development",
    description: "Building responsive and dynamic web applications.",
    items: [
      { id: 1, title: "HTML", description: "" },
      { id: 2, title: "CSS", description: "" },
      { id: 3, title: "Javascript", description: "" },
      { id: 4, title: "React.js", description: "" }
    ]
  },
  {
    title: "Frameworks & Libraries",
    description: "Tools for accelerated development and data analysis.",
    items: [
      { id: 1, title: "Spring Framework", description: "(Enterprise Java Applications)" },
      { id: 2, title: "Pandas", description: "" },
      { id: 3, title: "Matplotlib", description: "" }
    ]
  },
  {
    title: "Databases & Tools",
    description: "Infrastructure for data storage and version control.",
    items: [
      { id: 1, title: "MySQL", description: "" },
      { id: 2, title: "Git", description: "" },
      { id: 3, title: "GitHub", description: "" }
    ]
  }
];
export const projects = [
  {
    id: 1,
    name: "Vedaverse",
    description: "Inclusive education platform for visually impaired learners.",
    longDescription: "• Built an inclusive education platform for visually impaired learners. That integrates speech-to-text, text-to-speech, OCR recognition and PDF analysis for efficient knowledge retrieval, enabling voice-based, independent and interactive learning experiences.\n• Tools Used: Python, OCR, RAG, OpenAI Language Models, Speech Recognition.",
    href: "",
    image: "/assets/projects/mobile-accessories-store.jpg",
    bgImage: "/assets/backgrounds/blanket.jpg",
    frameworks: [
      { id: 1, name: "TTS/STT" },
      { id: 2, name: "OCR" },
      { id: 3, name: "React" }
    ],
  },
  {
    id: 2,
    name: "AI Inspection Dashboard",
    description: "AI-powered dashboard for automated institutional compliance.",
    longDescription: "• Developed an AI-powered dashboard to automate institutional compliance checks using predictive modeling (Random Forest) and interactive data visualizations. Enhanced inspection efficiency with simulated AI scoring for facilities/documents and trend analysis for actionable insights.\n• Tools Used: Python, Streamlit, Pandas, Plotly, NumPy.",
    href: "",
    image: "/assets/projects/plant-shop.jpg",
    bgImage: "/assets/backgrounds/curtains.jpg",
    frameworks: [
      { id: 1, name: "Random Forest" },
      { id: 2, name: "Python" },
      { id: 3, name: "Analytics" }
    ],
  },
  {
    id: 3,
    name: "Laser Security Alarm",
    description: "Intrusion detection system using Arduino and laser.",
    longDescription: "• Developed an intrusion detection system using Arduino, laser module, LDR (Light Dependent Resistor) sensor, and buzzer, where beam interruption triggers an alarm. Designed for low-cost, reliable perimeter security with easy installation and minimal maintenance.\n• Tools Used: Arduino, Laser Module, LDR Sensor, Buzzer, Embedded C/C++ Programming.",
    href: "",
    image: "/assets/projects/apple-tech-store.jpg",
    bgImage: "/assets/backgrounds/map.jpg",
    frameworks: [
      { id: 1, name: "Arduino" },
      { id: 2, name: "C++" },
      { id: 3, name: "IoT" }
    ],
  },
  {
    id: 4,
    name: "Fire Security Alarm",
    description: "Fire detection system with IoT integration.",
    longDescription: "• Built a fire detection and alert system using Arduino, flame sensor, and buzzer, capable of detecting fire and triggering immediate alarms. Integrated with the Blynk IoT platform to send real-time alerts via email and mobile notifications for rapid emergency response.\n• Tools Used: Arduino, Flame Sensor, Buzzer, Blynk IoT, Embedded C/C++ Programming.",
    href: "",
    image: "/assets/projects/electronics-store.jpg",
    bgImage: "/assets/backgrounds/poster.jpg",
    frameworks: [
      { id: 1, name: "Blynk IoT" },
      { id: 2, name: "Sensors" },
      { id: 3, name: "Arduino" }
    ],
  },
];
export const socials = [
  { name: "LinkedIn", href: "http://www.linkedin.com/in/tausifansari2907" },
  { name: "GitHub", href: "https://github.com/tausif2907" },
];
