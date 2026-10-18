
"use strict";

const form = document.querySelector("#complaint-form");
const statusMessage = document.querySelector("#registry-status");

const STORAGE_KEY = "nd-darshika-complaint-draft";

const fields = [
  { id: "complaint-name", label: "Complainant name" },
  { id: "complaint-category", label: "Complaint category" },
  { id: "complaint-main", label: "Main complaint" },
  { id: "complaint-example", label: "Specific incident / example" },
  { id: "complaint-change", label: "What could be better" },
  { id: "complaint-extra", label: "Additional thoughts" }
];

function getFormData() {
  return fields.map((field) => ({
    label: field.label,
    value: document.getElementById(field.id).value.trim()
  }));
}

function saveDraft() {
  const data = getFormData();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    statusMessage.textContent =
      "Draft saved on this device. Your thoughts are safe here. ♡";
  } catch (error) {
    statusMessage.textContent =
      "Browser storage unavailable. You can still download your PDF.";
  }
}

function restoreDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    saved.forEach((item) => {
      const field = fields.find((entry) => entry.label === item.label);
      if (!field) return;

      const element = document.getElementById(field.id);
      if (element) element.value = item.value || "";
    });

    if (saved.length) {
      statusMessage.textContent =
        "Your previous draft has been restored on this device. ♡";
    }
  } catch (error) {
    console.warn("Could not restore complaint draft:", error);
  }
}

fields.forEach((field) => {
  const element = document.getElementById(field.id);

  element.addEventListener("input", saveDraft);
  element.addEventListener("change", saveDraft);
});

restoreDraft();

function addPdfText(doc, text, options = {}) {
  const {
    fontSize = 11,
    bold = false,
    gap = 8,
    color = [53, 28, 32]
  } = options;

  const margin = 18;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;

  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);

  const lines = doc.splitTextToSize(String(text || ""), usableWidth);
  const lineHeight = fontSize * 0.48;
  let y = doc.lastAutoTableY || 25;

  if (y + lines.length * lineHeight + gap > pageHeight - margin) {
    doc.addPage();
    y = 24;
  }

  doc.text(lines, margin, y);
  doc.lastAutoTableY = y + lines.length * lineHeight + gap;
}

function addSectionTitle(doc, title) {
  addPdfText(doc, title, {
    fontSize: 15,
    bold: true,
    gap: 10,
    color: [245, 43, 80]
  });
}

function addPageNumbers(doc) {
  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(125, 95, 95);

    doc.text(
      `THE COMPLAINT REGISTRY | Page ${page} of ${totalPages}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 9,
      { align: "center" }
    );
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const mainComplaint = document
    .getElementById("complaint-main")
    .value.trim();

  if (!mainComplaint) {
    statusMessage.textContent =
      "Ek minute! Pehle apni main complaint toh likh do. 👀";
    document.getElementById("complaint-main").focus();
    return;
  }

  const downloadButton = form.querySelector('button[type="submit"]');
  downloadButton.disabled = true;
  downloadButton.textContent = "PREPARING YOUR PDF...";

  try {
    const jsPDF = await window.jsPDFReady;
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const answers = getFormData();
    const date = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    doc.setProperties({
      title: "The Complaint Registry - Darshika",
      subject: "Friendship feedback and suggestions",
      author: "The Friendship Department"
    });

    // Cover page
    doc.setFillColor(255, 240, 231);
    doc.rect(
      0, 0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );

    doc.setTextColor(245, 43, 80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("DEPARTMENT OF AYUSH KI HARKATEIN", 20, 35);

    doc.setTextColor(53, 28, 32);
    doc.setFontSize(27);
    doc.text("THE COMPLAINT", 20, 70);
    doc.text("REGISTRY", 20, 83);

    doc.setTextColor(245, 43, 80);
    doc.setFontSize(14);
    doc.text("OFFICIALLY UNOFFICIAL FILE", 20, 96);

    doc.setTextColor(53, 28, 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(
      doc.splitTextToSize(
        "A collection of honest thoughts, feedback, suggestions, and things left unsaid.",
        155
      ),
      20,
      116
    );

    doc.setDrawColor(255, 139, 66);
    doc.setLineWidth(1);
    doc.roundedRect(20, 143, 170, 35, 4, 4, "S");

    doc.setFont("helvetica", "bold");
    doc.text("COMPLAINANT", 27, 155);

    doc.setFont("helvetica", "normal");
    doc.text(
      doc.splitTextToSize(answers[0].value || "Anonymous", 150),
      27,
      163
    );

    doc.setFontSize(10);
    doc.text(`Generated: ${date}`, 20, 195);

    doc.setFont("helvetica", "italic");
    doc.text("Complaint received. Friendship still under review. ♡", 20, 215);

    // Answer pages
    doc.addPage();
    doc.lastAutoTableY = 24;

    addSectionTitle(doc, "COMPLAINT REPORT");
    addPdfText(doc, `Filed on: ${date}`, { fontSize: 9, gap: 12 });

    answers.slice(1).forEach((item, index) => {
      if (index === 0) {
        addSectionTitle(doc, "Department");
      }

      addPdfText(doc, item.label, {
        fontSize: 11,
        bold: true,
        gap: 4
      });

      addPdfText(doc, item.value || "No response provided.", {
        fontSize: 10,
        gap: 12
      });
    });

    // Closing note
    addPdfText(doc, "END OF REPORT", {
      fontSize: 14,
      bold: true,
      gap: 8,
      color: [245, 43, 80]
    });

    addPdfText(
      doc,
      "These thoughts are shared to help a friendship understand itself better. Read with care, not defensiveness.",
      { fontSize: 10, gap: 10 }
    );

    addPageNumbers(doc);

    doc.save("Darshika_Complaint_Registry.pdf");

    statusMessage.textContent =
      "PDF downloaded! Ab ise Ayush ko jab ready ho tab bhej dena. ♡";
  } catch (error) {
    console.error("Complaint PDF error:", error);

    statusMessage.textContent =
      "PDF generate nahi hua. Internet check karke page refresh karo aur phir try karo.";
  } finally {
    downloadButton.disabled = false;
    downloadButton.textContent = "DOWNLOAD MY COMPLAINT PDF ↓";
  }
});

/* ===== RED ALERT INTRO SEQUENCE ===== */

(() => {
  const loader = document.querySelector("#red-alert-loader");
  const message = document.querySelector("#alert-message");
  const progress = document.querySelector("#alert-progress-fill");

  if (!loader || !message || !progress) return;

  const messages = [
    "EXAMINATION TERMINATED...",
    "ANALYSING FRIENDSHIP RECORDS...",
    "DETECTING UNREPORTED COMPLAINTS...",
    "WARNING: AYUSH KI HARKATEIN UNDER INVESTIGATION.",
    "OPENING THE COMPLAINT REGISTRY..."
  ];

  const totalDuration = 4200;
  const startedAt = Date.now();
  let messageIndex = 0;

  message.textContent = messages[0];

  const messageTimer = setInterval(() => {
    messageIndex++;

    if (messageIndex < messages.length) {
      message.textContent = messages[messageIndex];
    }
  }, totalDuration / messages.length);

  const progressTimer = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    const percentage = Math.min(
      (elapsed / totalDuration) * 100,
      100
    );

    progress.style.width = `${percentage}%`;

    if (percentage >= 100) {
      clearInterval(progressTimer);
      clearInterval(messageTimer);

      message.textContent = "CASE OPENED. PROCEED WITH CAUTION.";

      setTimeout(() => {
        loader.classList.add("is-hidden");
      }, 450);
    }
  }, 40);
})();
