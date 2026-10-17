
"use strict";

// =========================================
// THE NOTHING DEPARTMENT™
// Fake errors + homepage click sequence
// =========================================

const $ = (selector) => document.querySelector(selector);

const errorScreen = $("#error-screen");
const nothingScreen = $("#nothing-screen");
const errorMessages = $("#error-messages");
const progressBar = $("#progress-bar");
const terminalFooter = $("#terminal-footer");
const criticalError = $("#critical-error");

const homepageEyebrow = $("#homepage-eyebrow");
const homepageHeading = $("#homepage-heading");
const homepageDescription = $("#homepage-description");
const moveButton = $("#move-button");
const homepageFootnote = $("#homepage-footnote");

const body = document.body;

let clickCount = 0;
let examAnnounced = false;

// =========================================
// FAKE TERMINAL MESSAGES
// =========================================

const terminalLines = [
  {
    text: "[BOOT] Initializing birthday protocol...",
    type: "success"
  },
  {
    text: "[INFO] Searching for the promised surprise...",
    type: "info"
  },
  {
    text: "[ERROR] Surprise.exe not found.",
    type: "danger"
  },
  {
    text: "[WARNING] Birthday girl detected.",
    type: "warning"
  },
  {
    text: "[FATAL] Expectations are dangerously high.",
    type: "danger"
  },
  {
    text: "[SCAN] Checking Darshika's patience...",
    type: "info"
  },
  {
    text: "[FAILED] Patience level could not be located.",
    type: "warning"
  },
  {
    text: "[SYSTEM] Blaming Darshika for this issue...",
    type: "danger"
  }
];

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function addTerminalLine(line) {
  const paragraph = document.createElement("p");

  paragraph.className = `error-line ${line.type}`;
  paragraph.textContent = line.text;

  errorMessages.appendChild(paragraph);
}


async function launchErrorPopups() {
  const messages = [
    ["ERROR 404", "Surprise not found."],
    ["WARNING", "Birthday girl detected."],
    ["FATAL ERROR", "Patience not found."],
    ["SYSTEM FAIL", "Blaming Darshika..."],
    ["CRITICAL", "Too much drama."],
    ["ALERT", "Why are you here?"],
    ["ERROR 418", "I'm a birthday teapot."],
    ["WARNING", "Curiosity level too high."],
    ["SYSTEM ERROR", "Common sense missing."],
    ["FAILED", "Absolutely nothing detected."]
  ];

  const layer = document.createElement("div");
  layer.id = "error-popup-layer";

  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    zIndex: "20",
    overflow: "hidden",
    pointerEvents: "none"
  });

  document.body.appendChild(layer);

  for (let i = 0; i < messages.length; i++) {
    const popup = document.createElement("div");
    const [title, message] = messages[i];

    popup.innerHTML = `
      <div class="mini-error-title"></div>
      <div class="mini-error-message"></div>
    `;

    popup.querySelector(".mini-error-title").textContent =
      "⚠ " + title;
    popup.querySelector(".mini-error-message").textContent =
      message;

    Object.assign(popup.style, {
      position: "absolute",
      width: "max-content",
      maxWidth: "min(240px, 75vw)",
      padding: "10px 12px",
      background: "#151515",
      color: "#ff6262",
      border: "1px solid #8d3333",
      boxShadow: "0 5px 25px #0008",
      fontFamily: "Courier New, monospace",
      fontSize: "11px",
      lineHeight: "1.6",
      opacity: "0",
      transform: "scale(0.8)",
      transition: "opacity 0.18s ease, transform 0.18s ease"
    });

    const x = Math.random() * 75;
    const y = Math.random() * 85;

    popup.style.left = `${x}%`;
    popup.style.top = `${y}%`;

    layer.appendChild(popup);

    requestAnimationFrame(() => {
      popup.style.opacity = "1";
      popup.style.transform = "scale(1)";
    });

    await wait(160);
  }

  await wait(1600);

  // Clear all popups before showing the main error.
  layer.remove();
}


async function runFakeErrors() {
  for (let i = 0; i < terminalLines.length; i++) {
    addTerminalLine(terminalLines[i]);

    const progress = ((i + 1) / terminalLines.length) * 100;
    progressBar.style.width = `${progress}%`;

    await wait(650);
  }
  
  // Launch fake error popups across the screen.
  await launchErrorPopups();


  terminalFooter.textContent =
    "RECOVERY FAILED. THIS IS SOMEHOW YOUR FAULT.";

  await wait(900);

  // Dramatic fake crash
  const terminal = $(".terminal");

  terminal.classList.add("glitch");

  await wait(750);

  terminal.style.display = "none";
  criticalError.classList.remove("hidden");

  await wait(2100);

  // Brief black screen
  errorScreen.style.background = "#000000";
  criticalError.style.opacity = "0";

  await wait(850);

  // Open the Nothing homepage
  errorScreen.classList.remove("active");
  nothingScreen.classList.add("active");

  body.style.background = "#ffffff";
  body.classList.remove("transitioning");
}

// =========================================
// HOMEPAGE CLICK SEQUENCE
// =========================================

const clickStages = [
  {
    eyebrow: "JUST CLICK",
    heading: "Welcome, Darshika.",
    description: "Your surprise is ready.",
    button: "CLICK HERE TO MOVE →",
    footnote: "Please proceed normally."
  },
  {
    eyebrow: "STEP 01",
    heading: "Move where?",
    description: "Accha sawaal hai. Mujhe bhi nahi pata.",
    button: "OKAY, THEN MOVE →",
    footnote: "Directions not included."
  },
  {
    eyebrow: "STEP 02",
    heading: "Bas click kar.",
    description: "Har cheez mein itne questions kyun?",
    button: "ACCHA KAR DIYA →",
    footnote: "Happy now?"
  },
  {
    eyebrow: "STEP 03",
    heading: "Abhi bhi yahin?",
    description: "Haan bhai, ye website teri hi hai.",
    button: "AB AAGE BHI BADH →",
    footnote: "Progress is a social construct."
  },
  {
    eyebrow: "STEP 04",
    heading: "Ek last thing.",
    description: "Bas ek aur click. Pakka.",
    button: "THE LAST CLICK →",
    footnote: "Trust me. I'm a developer."
  }
];

function updateHomepage(stage) {
  homepageEyebrow.textContent = stage.eyebrow;
  homepageHeading.textContent = stage.heading;
  homepageDescription.textContent = stage.description;
  moveButton.textContent = stage.button;
  homepageFootnote.textContent = stage.footnote;

  const content = $(".nothing-content");

  content.style.animation = "none";
  void content.offsetWidth;
  content.style.animation = "homepage-appear 0.4s ease both";
}

function announceExam() {
  examAnnounced = true;

  homepageEyebrow.textContent = "UNEXPECTED DEVELOPMENT";
  homepageHeading.textContent = "EXAM TIME.";
  homepageDescription.textContent =
    "Itni mehnat se website banayi thi. Ab prove kar ki tune dekhi bhi hai.";
  moveButton.textContent = "START THE EXAM →";
  homepageFootnote.textContent =
    "Friendship Archive Final Examination · Coming up next.";

  document.title = "Final Examination | Nothing Department";
}

moveButton.addEventListener("click", () => {
  
if (examAnnounced) {
  window.location.href = "exam.html";
  return;
}


  clickCount++;

  // Clicks 1–4 show the corresponding stage.
  if (clickCount <= clickStages.length - 1) {
    updateHomepage(clickStages[clickCount]);
    return;
  }

  // Fifth click: exam announcement.
  announceExam();
});

// =========================================
// START
// =========================================

runFakeErrors().catch((error) => {
  console.error("Nothing Department startup error:", error);

  // Fail gracefully if the fake intro encounters an issue.
  errorScreen.classList.remove("active");
  nothingScreen.classList.add("active");
  body.style.background = "#ffffff";
});
