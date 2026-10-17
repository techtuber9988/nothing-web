
"use strict";

// ==========================================
// NOTHING DEPARTMENT — EXAM NAVIGATION
// ==========================================

const finishButton = document.querySelector("#finish-exam");

if (finishButton) {
  finishButton.addEventListener("click", () => {
    alert(
      "SUBMISSION PROTOCOL NOT READY.\n\n" +
      "Pehle actual questions aur answers add karne hain. 🙄"
    );
  });
}
