
"use strict";

/* ========================================
   SHARED STORAGE KEYS
======================================== */

const MCQ_STORAGE_KEY = "nd-darshika-mcq-result";
const WRITTEN_STORAGE_KEY = "nd-darshika-written-answers";

/* ========================================
   SECTION A — MCQ QUESTIONS
======================================== */

const questions = [
  {
    question: "Achha madam, birthday ke liye jo poora website-archive banaya gaya hai, uska naam kya hai?",
    description: "Itna sab dekhne ke baad bhi nahi yaad toh bhagwaan hi malik hain.",
    options: [
      "The Birthday Investigation Bureau",
      "The Friendship Archive",
      "The Darshika Complaint Department",
      "The Official Domino's Waiting Room"
    ],
    answer: 1
  },
  {
    question: "Website ki main colour theme kya hai?",
    description: "Aankhein sirf decoration ke liye nahi hoti hain.",
    options: [
      "Blue, silver aur black",
      "Purple, pink aur white",
      "Red, yellow aur orange",
      "Green, brown aur beige"
    ],
    answer: 2
  },
  {
    question: "Archive mein kaunsi line use ki gayi hai jo friendship ki vibe batati hai?",
    description: "Chhoti si line hai, yaad karne mein JEE nahi nikalna.",
    options: [
      "No thoughts, just attendance",
      "Little things, big memories",
      "Please submit your assignment",
      "Friendship services are temporarily closed"
    ],
    answer: 1
  },
  {
    question: "Birthday pe tere liye kaunse physical gifts plan kiye gaye hain?",
    description: "Itni mehnat se planning hui hai, thoda toh yaad rakh.",
    options: [
      "Ek diary aur guitar pakde hue teddy",
      "Laptop aur headphones",
      "Bouquet aur chocolates",
      "Notebook aur cricket bat"
    ],
    answer: 0
  },
  {
    question: "Second semester se kaunsa promise abhi tak pending pada hai?",
    description: "Is case ki file toh CBI ko deni padegi ab.",
    options: [
      "Ghar pe dinner banane ka",
      "Roz canteen mein treat dene ka",
      "Lifetime Choco Pie supply karne ka",
      "Domino's le jaane ka"
    ],
    answer: 3
  },
  {
    question: "Bonus page ke end mein jo button hai, uspe kya likha hai?",
    description: "End tak pahunch hi gayi thi, ab itna toh yaad hona chahiye.",
    options: [
      "PLEASE RATE THIS WEBSITE",
      "RESTART YOUR BIRTHDAY",
      "BAS AB NIKAL YAHAN SE",
      "CONGRATULATIONS, YOU HAVE WON NOTHING"
    ],
    answer: 2
  },
  {
    question: "The Nothing Page ka main concept kya hai?",
    description: "Ek aur website kholne ki zaroorat kyun padi thi, yaad hai?",
    options: [
      "Advanced web development sikhana",
      "Jaan-boojh ke literally kuch khaas na hona",
      "Poora photo album dikhana",
      "Online shopping karwana"
    ],
    answer: 1
  },
  {
    question: "Friendship Archive mein kaun-kaun se departments diye gaye hain?",
    description: "Website kholi thi ya bas buttons dabaa ke aage badh gayi thi?",
    options: [
      "Sports, Finance aur Human Resources",
      "Attendance, Results aur Fee Payment",
      "Travel, Shopping aur Cooking",
      "Chaos Archive, Food Department, Academic Support aur Gossip Department"
    ],
    answer: 3
  },
  {
    question: "Bonus page ke yellow box mein kya likha tha?",
    description: "Message itna clearly likha tha, phir bhi bhool gayi toh alag baat hai.",
    options: [
      "YAHAAN KUCH NAHI HAI. KHATAM. THE END. GHAR JAAO.",
      "Please wait while we process your application",
      "Your birthday gift will arrive in 30 business days",
      "Congratulations! You found the secret treasure"
    ],
    answer: 0
  },
  {
    question: "Ye saari websites banane ka actual purpose kya tha?",
    description: "Final answer hai madam. Izzat ka sawaal hai ab.",
    options: [
      "Tujhse zabardasti JavaScript padhwana",
      "Teri personal information collect karna",
      "Dekhna ki tune archive explore kiya aur details pe dhyaan diya ya nahi",
      "Tujhse college attendance form bharwana"
    ],
    answer: 2
  }
];

/* ========================================
   SECTION A — MCQ ENGINE
======================================== */

const mcqApp = document.querySelector("#mcq-app");

if (mcqApp) {
  const previousButton = document.querySelector("#previous-question");
  const nextButton = document.querySelector("#next-question");
  const answeredCount = document.querySelector("#answered-count");
  const progressLabel = document.querySelector("#progress-label");
  const progressTrack = document.querySelector("#progress-track");
  const progressFill = document.querySelector("#progress-fill");
  const feedback = document.querySelector("#mcq-feedback");
  const resultPanel = document.querySelector("#mcq-result");
  const resultHeading = document.querySelector("#result-heading");
  const resultScore = document.querySelector("#result-score");
  const resultMessage = document.querySelector("#result-message");
  const statusLabel = document.querySelector(".status");

  let currentQuestion = 0;
  let submitted = false;
  let selectedAnswers = Array(questions.length).fill(null);

  function renderQuestion() {
    const item = questions[currentQuestion];
    const number = currentQuestion + 1;
    const selected = selectedAnswers[currentQuestion];

    mcqApp.innerHTML = `
      <div class="question-card">
        <div class="question-meta">
          <span class="question-tag">
            QUESTION ${String(number).padStart(2, "0")}
          </span>
          <span class="marks-tag">MARKS: 01</span>
        </div>

        <h2>${item.question}</h2>
        <p class="question-description">${item.description}</p>

        <div class="mcq-options">
          ${item.options.map((option, index) => `
            <button
              class="mcq-option ${selected === index ? "selected" : ""}"
              type="button"
              data-option="${index}"
              aria-pressed="${selected === index}"
            >
              <span class="option-letter">${String.fromCharCode(65 + index)}</span>
              <span>${option}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    mcqApp.querySelectorAll(".mcq-option").forEach((button) => {
      button.addEventListener("click", () => {
        if (submitted) return;

        selectedAnswers[currentQuestion] = Number(button.dataset.option);
        renderQuestion();
        updateProgress();

        feedback.textContent =
          "Answer record ho gaya. Sahi hai ya nahi, result mein pata chalega.";
        feedback.classList.remove("warning");
      });
    });

    previousButton.disabled = currentQuestion === 0;

    nextButton.innerHTML =
      currentQuestion === questions.length - 1
        ? 'SUBMIT EXAMINATION <span>→</span>'
        : 'NEXT QUESTION <span>→</span>';

    updateProgress();
  }

  function updateProgress() {
    const answered = selectedAnswers.filter((value) => value !== null).length;
    const percentage = ((currentQuestion + 1) / questions.length) * 100;

    answeredCount.textContent = `${answered} / ${questions.length}`;
    progressLabel.textContent =
      `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} OF ${questions.length}`;

    progressFill.style.width = `${percentage}%`;
    progressTrack.setAttribute("aria-valuenow", String(currentQuestion + 1));
  }

  function submitMcq() {
    const firstUnanswered = selectedAnswers.findIndex(
      (answer) => answer === null
    );

    if (firstUnanswered !== -1) {
      currentQuestion = firstUnanswered;
      renderQuestion();

      feedback.textContent =
        "Arre madam! Saare questions answer karo, phir submit karna.";
      feedback.classList.add("warning");
      return;
    }

    const score = questions.reduce((total, item, index) => {
      return total + (selectedAnswers[index] === item.answer ? 1 : 0);
    }, 0);

    const result = {
      submitted: true,
      score,
      total: questions.length,
      selectedAnswers,
      submittedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(MCQ_STORAGE_KEY, JSON.stringify(result));
    } catch {
      feedback.textContent =
        "Answers save nahi ho paaye. Browser storage allow karke dobara try karo.";
      feedback.classList.add("warning");
      return;
    }

    submitted = true;
    mcqApp.hidden = true;
    document.querySelector(".mcq-summary").hidden = true;
    document.querySelector(".progress-heading").hidden = true;
    progressTrack.hidden = true;
    feedback.hidden = true;
    previousButton.hidden = true;
    nextButton.hidden = true;
    resultPanel.hidden = false;

    if (statusLabel) {
      statusLabel.innerHTML = "<i></i> SUBMITTED";
    }

    resultScore.textContent = `${score} / ${questions.length}`;

    if (score === 10) {
      resultHeading.textContent = "Suspiciously impressive.";
      resultMessage.textContent =
        "Full marks! Ya toh tune dhyaan diya, ya board ko kuch gadbad lag rahi hai.";
    } else if (score >= 7) {
      resultHeading.textContent = "Acceptable behaviour.";
      resultMessage.textContent =
        "Theek-thaak hai. Section B mein apni izzat bachane ki koshish kar.";
    } else if (score >= 4) {
      resultHeading.textContent = "Were you even looking?";
      resultMessage.textContent =
        "Website kholi aur phir bhi details bhool gayi? Interesting.";
    } else {
      resultHeading.textContent = "Friendship audit required.";
      resultMessage.textContent =
        "Website saamne thi, questions bhi. Ab Section B mein explanation dena.";
    }

    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  previousButton.addEventListener("click", () => {
    if (currentQuestion > 0 && !submitted) {
      currentQuestion--;
      renderQuestion();
      feedback.textContent = "Pichhle question par aa gayi. Answer change kar sakti hai.";
      feedback.classList.remove("warning");
    }
  });

  nextButton.addEventListener("click", () => {
    if (submitted) return;

    if (selectedAnswers[currentQuestion] === null) {
      feedback.textContent =
        "Pehle ek option choose kar. Screen ko dekhne se answer select nahi hota.";
      feedback.classList.add("warning");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
      feedback.textContent = "Chal aage badh. Abhi aur sawaal baaki hain.";
      feedback.classList.remove("warning");
    } else {
      submitMcq();
    }
  });

  // Restore a previously submitted result if the candidate returns.
  try {
    const savedResult = JSON.parse(localStorage.getItem(MCQ_STORAGE_KEY) || "null");

    if (
      savedResult?.submitted &&
      Array.isArray(savedResult.selectedAnswers) &&
      savedResult.selectedAnswers.length === questions.length
    ) {
      selectedAnswers = savedResult.selectedAnswers;
      submitted = true;
      renderQuestion();

      mcqApp.hidden = true;
      document.querySelector(".mcq-summary").hidden = true;
      document.querySelector(".progress-heading").hidden = true;
      progressTrack.hidden = true;
      feedback.hidden = true;
      previousButton.hidden = true;
      nextButton.hidden = true;
      resultPanel.hidden = false;

      if (statusLabel) statusLabel.innerHTML = "<i></i> SUBMITTED";

      resultScore.textContent = `${savedResult.score} / ${savedResult.total}`;
      resultHeading.textContent = "Examination already submitted.";
      resultMessage.textContent =
        "Tera MCQ result saved hai. Section B complete kar ya written answers edit kar.";
    } else {
      renderQuestion();
    }
  } catch {
    renderQuestion();
  }
}

/* ========================================
   SECTION B — WRITTEN ANSWERS
======================================== */

const writtenForm = document.querySelector("#written-form");

if (writtenForm) {
  const textareas = [...writtenForm.querySelectorAll("textarea")];
  const saveStatus = document.querySelector("#written-save-status");
  const progressLabel = document.querySelector("#written-progress-label");
  const progressTrack = document.querySelector("#written-progress-track");
  const progressFill = document.querySelector("#written-progress-fill");
  const submissionPanel = document.querySelector("#written-submission");
  const editAnswersButton = document.querySelector("#edit-answers");
  const downloadPdfButton = document.querySelector("#download-pdf");
  const pdfStatus = document.querySelector("#pdf-status");

  function readWrittenAnswers() {
    try {
      return JSON.parse(localStorage.getItem(WRITTEN_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveWrittenAnswers() {
    const answers = {};

    textareas.forEach((textarea) => {
      answers[textarea.name] = textarea.value;
    });

    try {
      localStorage.setItem(WRITTEN_STORAGE_KEY, JSON.stringify(answers));
      saveStatus.textContent =
        "Answers isi browser mein automatically save ho rahe hain.";
    } catch {
      saveStatus.textContent =
        "Auto-save nahi ho paaya. Page band karne se pehle answers copy kar lena.";
    }

    updateWrittenProgress();
  }

  function updateWrittenProgress() {
    const answered = textareas.filter(
      (textarea) => textarea.value.trim().length > 0
    ).length;

    const percentage = (answered / textareas.length) * 100;

    progressLabel.textContent = `${answered} / ${textareas.length} ANSWERED`;
    progressFill.style.width = `${percentage}%`;
    progressTrack.setAttribute("aria-valuenow", String(answered));
  }

  const savedAnswers = readWrittenAnswers();

  textareas.forEach((textarea) => {
    if (typeof savedAnswers[textarea.name] === "string") {
      textarea.value = savedAnswers[textarea.name];
    }

    textarea.addEventListener("input", saveWrittenAnswers);
  });

  updateWrittenProgress();

  writtenForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!writtenForm.reportValidity()) return;

    saveWrittenAnswers();

    // Require an MCQ submission before allowing the final combined report.
    let mcqResult;

    try {
      mcqResult = JSON.parse(localStorage.getItem(MCQ_STORAGE_KEY) || "null");
    } catch {
      mcqResult = null;
    }

    if (!mcqResult?.submitted) {
      alert("Pehle Section A ka MCQ exam complete kar, phir final submission karna.");
      return;
    }

    writtenForm.hidden = true;
    submissionPanel.hidden = false;
    saveStatus.hidden = true;
    document.querySelector(".progress-heading").hidden = true;
    progressTrack.hidden = true;

    const status = document.querySelector(".status");
    if (status) status.innerHTML = "<i></i> SUBMITTED";

    submissionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (editAnswersButton) {
    editAnswersButton.addEventListener("click", () => {
      writtenForm.hidden = false;
      submissionPanel.hidden = true;
      saveStatus.hidden = false;
      document.querySelector(".progress-heading").hidden = false;
      progressTrack.hidden = false;

      const status = document.querySelector(".status");
      if (status) status.innerHTML = "<i></i> IN PROGRESS";

      writtenForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ========================================
     COMPLETE PDF — MCQ + WRITTEN
  ======================================== */

  if (downloadPdfButton) {
    downloadPdfButton.addEventListener("click", async () => {
      let jsPDF;

      try {
        jsPDF = await window.jsPDFReady;
      } catch (error) {
        console.error("jsPDF loading failed:", error);

        alert(
          "PDF library load nahi hui. Internet check karke page refresh karo. " +
          "Agar phir bhi issue aaye, browser Console check karo."
        );

        return;
      }

      let mcqResult;

      try {
        mcqResult = JSON.parse(localStorage.getItem(MCQ_STORAGE_KEY) || "null");
      } catch {
        mcqResult = null;
      }

      if (
        !mcqResult?.submitted ||
        !Array.isArray(mcqResult.selectedAnswers) ||
        mcqResult.selectedAnswers.length !== questions.length
      ) {
        pdfStatus.textContent =
          "MCQ result nahi mila. Same browser mein Section A complete karke phir try karo.";
        return;
      }

      const writtenAnswers = textareas.map((textarea, index) => {
        const card = textarea.closest(".written-question");

        return {
          number: index + 1,
          question: card.querySelector("h2").textContent.trim(),
          answer: textarea.value.trim() || "No answer provided."
        };
      });

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      function addPage() {
        doc.addPage();
        y = 20;
      }

      function ensureSpace(height) {
        if (y + height > pageHeight - 18) addPage();
      }

      function addWrappedText(text, options = {}) {
        const {
          font = "normal",
          size = 10,
          color = [45, 43, 38],
          indent = 0,
          lineHeight = 5
        } = options;

        doc.setFont("helvetica", font);
        doc.setFontSize(size);
        doc.setTextColor(...color);

        const lines = doc.splitTextToSize(
          String(text),
          contentWidth - indent
        );

        lines.forEach((line) => {
          ensureSpace(lineHeight + 1);
          doc.text(line, margin + indent, y);
          y += lineHeight;
        });

        return lines.length;
      }

      function addSectionHeading(title, subtitle) {
        ensureSpace(24);

        doc.setFillColor(156, 48, 56);
        doc.rect(margin, y - 5, contentWidth, 13, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin + 3, y + 3);

        y += 17;

        if (subtitle) {
          addWrappedText(subtitle, {
            size: 9,
            color: [100, 92, 82],
            lineHeight: 5
          });
          y += 3;
        }
      }

      function addQuestionBlock(number, question, answer, options = {}) {
        const { correctAnswer = null, selectedAnswer = null, isCorrect = false } = options;

        y += 2;
        ensureSpace(20);

        doc.setFillColor(247, 241, 231);
        doc.rect(margin, y - 4, contentWidth, 9, "F");

        addWrappedText(
          `${String(number).padStart(2, "0")}. ${question}`,
          { font: "bold", size: 10, color: [156, 48, 56], indent: 2, lineHeight: 5.5 }
        );

        y += 2;

        addWrappedText(`Your answer: ${answer}`, {
          size: 9.5,
          indent: 3,
          lineHeight: 5
        });

        if (correctAnswer !== null) {
          addWrappedText(`Correct answer: ${correctAnswer}`, {
            font: "bold",
            size: 9,
            color: [52, 100, 70],
            indent: 3,
            lineHeight: 5
          });

          addWrappedText(
            selectedAnswer === correctAnswer
              ? "Result: CORRECT (+1)"
              : "Result: INCORRECT (+0)",
            {
              font: "bold",
              size: 8.5,
              color: selectedAnswer === correctAnswer
                ? [52, 100, 70]
                : [156, 48, 56],
              indent: 3,
              lineHeight: 4.5
            }
          );
        }

        y += 5;
      }

      // Cover / report heading
      doc.setFillColor(156, 48, 56);
      doc.rect(0, 0, pageWidth, 43, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("N.D. EXAMINATION BOARD", margin, 17);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("DEPARTMENT OF FRIENDSHIP AFFAIRS", margin, 25);
      doc.text("COMPLETE FRIENDSHIP EXAMINATION REPORT", margin, 33);

      y = 54;

      addWrappedText("Candidate: Darshika", {
        font: "bold",
        size: 12,
        lineHeight: 6
      });

      addWrappedText(
        `Report generated: ${new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        })}`,
        { size: 9, color: [100, 92, 82], lineHeight: 5 }
      );

      y += 5;

      // Section A: score summary
      addSectionHeading("SECTION A — MCQ EXAMINATION", "10 questions | 1 mark each");

      const score = questions.reduce((total, item, index) => {
        return total + (mcqResult.selectedAnswers[index] === item.answer ? 1 : 0);
      }, 0);

      doc.setFillColor(247, 241, 231);
      doc.rect(margin, y, contentWidth, 17, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(156, 48, 56);
      doc.text(`MCQ SCORE: ${score} / ${questions.length}`, margin + 4, y + 11);
      y += 25;

      questions.forEach((item, index) => {
        const selectedIndex = mcqResult.selectedAnswers[index];
        const selectedText =
          Number.isInteger(selectedIndex) && item.options[selectedIndex] !== undefined
            ? `${String.fromCharCode(65 + selectedIndex)}. ${item.options[selectedIndex]}`
            : "No answer recorded";

        const correctText =
          `${String.fromCharCode(65 + item.answer)}. ${item.options[item.answer]}`;

        addQuestionBlock(
          index + 1,
          item.question,
          selectedText,
          {
            selectedAnswer: selectedIndex,
            correctAnswer: correctText
          }
        );
      });

      // Section B: written answers
      addSectionHeading(
        "SECTION B — WRITTEN EXAMINATION",
        "5 questions | 2 marks each | Answers reproduced as submitted"
      );

      writtenAnswers.forEach((item) => {
        addQuestionBlock(item.number, item.question, item.answer);
      });

      // Closing note
      y += 3;
      ensureSpace(28);

      doc.setDrawColor(210, 200, 187);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      addWrappedText("EXAMINATION COMPLETED", {
        font: "bold",
        size: 10,
        color: [156, 48, 56],
        lineHeight: 5
      });

      addWrappedText(
        "Dear examiner, meri answer sheet check kar lena. Marks kaatne se pehle hamari friendship yaad kar lena. - Darshika",
        { size: 9, lineHeight: 5 }
      );

      // Add page numbers and footer to every page.
      const totalPages = doc.internal.getNumberOfPages();

      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);

        doc.setDrawColor(210, 200, 187);
        doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 112, 100);

        doc.text("N.D. EXAMINATION BOARD", margin, pageHeight - 7);
        doc.text(
          `PAGE ${page} OF ${totalPages}`,
          pageWidth - margin,
          pageHeight - 7,
          { align: "right" }
        );
      }

      doc.save("Darshika_Complete_Friendship_Exam.pdf");

      pdfStatus.textContent =
        "Complete PDF generate ho gayi! Downloads folder check kar aur file examiner ko bhej de.";
    });
  }
}
