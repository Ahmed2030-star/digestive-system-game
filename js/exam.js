(() => {
  let examQuestions;
  let examQuestionIndex = 0;
  let examScore = 0;
  let examAnswerHistory = [];
  let examAnswered = false;
  let level2;
  let level3;
  let startExamButton;
  let backToChallengeButton;
  let nextQuestionButton;
  let examProgressText;
  let examProgressFill;
  let examQuestion;
  let examOptions;
  let examFeedback;
  let examMarkup;
  let examContainer;
  let currentStudentName = "";
  let initialized = false;

  function cacheElements() {
    backToChallengeButton = document.getElementById("backToChallengeBtn");
    nextQuestionButton = document.getElementById("nextQuestionBtn");
    examProgressText = document.getElementById("examProgressText");
    examProgressFill = document.getElementById("examProgressFill");
    examQuestion = document.getElementById("examQuestion");
    examOptions = document.getElementById("examOptions");
    examFeedback = document.getElementById("examFeedback");
    examFeedback.setAttribute("role", "status");
    examFeedback.setAttribute("aria-live", "polite");
  }

  function loadQuestion() {
    examAnswered = false;
    nextQuestionButton.style.display = "none";
    const question = examQuestions[examQuestionIndex];
    examProgressText.textContent = window.GAME_CONFIG.ui.exam.progressFormat
      .replace("{current}", examQuestionIndex + 1)
      .replace("{total}", examQuestions.length);
    examProgressFill.style.width = `${(examQuestionIndex + 1) / examQuestions.length * 100}%`;
    examQuestion.textContent = question.question;
    examFeedback.textContent = "";
    examOptions.innerHTML = "";
    [...question.options].sort(() => Math.random() - 0.5).forEach(option => {
      const optionButton = document.createElement("button");
      optionButton.className = "exam-option";
      optionButton.textContent = option;
      optionButton.onclick = () => {
        if (examAnswered) return;
        examAnswered = true;
        examAnswerHistory.push({
          questionId: question.id,
          type: question.type,
          question: question.question,
          selectedAnswer: option,
          correctAnswer: question.answer,
          isCorrect: option === question.answer,
          explanation: question.explanation
        });
        document.querySelectorAll(".exam-option").forEach(button => button.disabled = true);
        if (option === question.answer) {
          examScore++;
          optionButton.classList.add("correct");
          examFeedback.textContent = `Correct! ${question.explanation}`;
          GameAudio.playExamSuccess();
        } else {
          optionButton.classList.add("incorrect");
          [...document.querySelectorAll(".exam-option")]
            .find(button => button.textContent === question.answer)
            ?.classList.add("correct");
          examFeedback.textContent = `Not quite. The correct answer is ${question.answer}. ${question.explanation}`;
          GameAudio.playExamWrong();
        }
        nextQuestionButton.style.display = "inline-block";
      };
      examOptions.appendChild(optionButton);
    });
  }

  function start() {
    GameChallenge.cleanup();
    level2.hidden = true;
    level3.hidden = false;
    GameAudio.stopExplorer();
    GameAudio.stopChallenge();
    GameAudio.stopChallengeCompletion();
    GameExplorer.hideHighlight();
    GameChallenge.hideHighlight();
    currentStudentName = "";
    cleanup();
    restoreExamMarkup();
    if (window.GAME_CONFIG.exam.studentEntry.enabled) {
      showStudentEntry();
      return;
    }
    currentStudentName = window.GAME_CONFIG.certificate.studentName;
    beginExam();
  }

  function beginExam() {
    examQuestionIndex = 0;
    examScore = 0;
    examAnswerHistory = [];
    loadQuestion();
  }

  function restoreExamMarkup() {
    examContainer.innerHTML = examMarkup;
    cacheElements();
    bindExamControls();
  }

  function restartExamWithCurrentStudent() {
    GameAudio.stopExam();
    restoreExamMarkup();
    beginExam();
  }

  function showStudentEntry() {
    const entry = window.GAME_CONFIG.exam.studentEntry;
    examContainer.innerHTML = `<section class="exam-student-entry" aria-labelledby="examStudentEntryTitle"><h2 id="examStudentEntryTitle">${entry.title}</h2><p>${entry.instruction}</p><form class="exam-student-form"><label class="exam-student-label" for="examStudentName">${entry.label}</label><input class="exam-student-input" id="examStudentName" name="studentName" type="text" placeholder="${entry.placeholder}" maxlength="${entry.maxLength}" autocomplete="name"><p class="exam-student-error" role="alert" aria-live="polite"></p><div class="exam-student-actions"><button type="submit">${entry.beginButton}</button><button type="button" class="exam-student-back">${entry.backButton}</button></div></form></section>`;
    const form = examContainer.querySelector(".exam-student-form");
    const input = examContainer.querySelector(".exam-student-input");
    const error = examContainer.querySelector(".exam-student-error");
    input.focus();
    form.onsubmit = event => {
      event.preventDefault();
      const studentName = input.value.trim();
      if (!studentName) {
        input.setAttribute("aria-invalid", "true");
        error.textContent = entry.requiredMessage;
        input.focus();
        return;
      }
      currentStudentName = studentName;
      restoreExamMarkup();
      beginExam();
    };
    input.oninput = () => {
      input.removeAttribute("aria-invalid");
      error.textContent = "";
    };
    examContainer.querySelector(".exam-student-back").onclick = backToChallenge;
  }

  function backToChallenge() {
    cleanup();
    currentStudentName = "";
    restoreExamMarkup();
    level3.hidden = true;
    level2.hidden = false;
  }

  function reset() {
    examQuestionIndex = 0;
    examScore = 0;
    examAnswerHistory = [];
    examAnswered = false;
  }

  function cleanup() {
    GameAudio.stopExam();
    reset();
  }

  function showCertificate() {
    const CONFIG = window.GAME_CONFIG;
    const certificate = CONFIG.certificate;
    const scoreStatus = examScore >= certificate.minimumPassingScore ? "" : " (Not Passed)";
    const studentName = certificate.studentNameEnabled
      ? `<p class="certificate-student">${currentStudentName.trim() || certificate.studentName}</p>`
      : "";
    const date = certificate.dateEnabled
      ? `<p>${new Date().toLocaleDateString()}</p>`
      : "";
    examContainer.innerHTML = `<div class="certificate"><h1>🏆 ${certificate.title}</h1><h2>${certificate.gameTitle}</h2><p>${certificate.description}</p><h3>Score: ${examScore}/${examQuestions.length}${scoreStatus}</h3>${studentName}${date}<button class="certificate-print" onclick="window.print()">🖨 Print Certificate</button></div>`;
  }

  function showReview() {
    const review = window.GAME_CONFIG.exam.review;
    const accuracy = Math.round((examScore / examQuestions.length) * 100);
    const performance = review.levels.find(level => accuracy >= level.minimum).label;
    const incorrectAnswers = examAnswerHistory.filter(record => !record.isCorrect);
    const stat = (label, value, className = "") => `<div class="exam-review-stat ${className}"><dt>${label}</dt><dd>${value}</dd></div>`;
    const incorrectSection = incorrectAnswers.length
      ? `<h2 class="exam-review-section-title">${review.incorrectSectionTitle}</h2><div class="incorrect-review-list">${incorrectAnswers.map(record => { const questionNumber = examQuestions.findIndex(question => question.id === record.questionId) + 1; return `<article class="incorrect-review-card"><h3>Question ${questionNumber} (${record.questionId}): ${record.question}</h3><dl><div><dt>${review.yourAnswerLabel}</dt><dd>${record.selectedAnswer}</dd></div><div><dt>${review.correctAnswerLabel}</dt><dd>${record.correctAnswer}</dd></div><div><dt>${review.explanationLabel}</dt><dd>${record.explanation}</dd></div></dl></article>`; }).join("")}</div>`
      : `<p class="exam-review-all-correct">${review.allCorrectMessage}</p>`;
    examContainer.innerHTML = `<section class="exam-review" aria-labelledby="examReviewTitle"><h1 id="examReviewTitle" tabindex="-1">${review.title}</h1><dl class="exam-review-summary">${stat(`${review.scoreLabel}:`, `${examScore}/${examQuestions.length}`)}${stat(review.correctLabel, examScore)}${stat(review.incorrectLabel, incorrectAnswers.length)}${stat(review.accuracyLabel, `${accuracy}%`)}<div class="exam-review-stat exam-review-level"><dt>${review.performanceLabel}</dt><dd>${performance}</dd></div></dl>${incorrectSection}<div class="exam-review-actions"><button type="button" class="exam-review-certificate">${review.viewCertificateButton}</button><button type="button" class="exam-review-retry">${review.retryExamButton}</button></div></section>`;
    examContainer.querySelector(".exam-review-certificate").onclick = showCertificate;
    examContainer.querySelector(".exam-review-retry").onclick = restartExamWithCurrentStudent;
  }

  function init() {
    if (initialized) return;
    initialized = true;
    const config = window.GAME_CONFIG;
    examQuestions = config.exam.questions;
    level2 = document.getElementById("level2");
    level3 = document.getElementById("level3");
    startExamButton = document.getElementById("startExamBtn");
    examContainer = document.querySelector(".exam-container");
    examMarkup = examContainer.innerHTML;
    cacheElements();
    startExamButton.onclick = start;
    restoreExamMarkup();
  }

  function bindExamControls() {
    backToChallengeButton.onclick = backToChallenge;
    nextQuestionButton.onclick = () => {
      examQuestionIndex++;
      if (examQuestionIndex < examQuestions.length) loadQuestion();
      else showReview();
    };
  }

  window.GameExam = {
    init,
    start,
    reset,
    cleanup
  };
})();
