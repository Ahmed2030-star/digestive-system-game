(() => {
  let examQuestions;
  let examQuestionIndex = 0;
  let examScore = 0;
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
  let initialized = false;

  function loadQuestion() {
    examAnswered = false;
    nextQuestionButton.style.display = "none";
    const question = examQuestions[examQuestionIndex];
    examProgressText.textContent = window.GAME_CONFIG.ui.exam.progressFormat
      .replace("{current}", examQuestionIndex + 1)
      .replace("{total}", examQuestions.length);
    examProgressFill.style.width = `${(examQuestionIndex + 1) / examQuestions.length * 100}%`;
    examQuestion.textContent = question.q;
    examFeedback.textContent = "";
    examOptions.innerHTML = "";
    [...question.o].sort(() => Math.random() - 0.5).forEach(option => {
      const optionButton = document.createElement("button");
      optionButton.className = "exam-option";
      optionButton.textContent = option;
      optionButton.onclick = () => {
        if (examAnswered) return;
        examAnswered = true;
        document.querySelectorAll(".exam-option").forEach(button => button.disabled = true);
        if (option === question.a) {
          examScore++;
          optionButton.classList.add("correct");
          examFeedback.textContent = window.GAME_CONFIG.ui.exam.correctFeedback;
          GameAudio.playExamSuccess();
        } else {
          optionButton.classList.add("incorrect");
          examFeedback.textContent = window.GAME_CONFIG.ui.exam.incorrectFeedback.replace("{answer}", question.a);
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
    examQuestionIndex = 0;
    examScore = 0;
    loadQuestion();
  }

  function reset() {
    examQuestionIndex = 0;
    examScore = 0;
    examAnswered = false;
  }

  function cleanup() {
    GameAudio.stopExam();
    reset();
  }

  function showCertificate() {
    const certificate = window.GAME_CONFIG.ui.certificate;
    document.querySelector(".exam-container").innerHTML = `<div class="certificate"><h1>🏆 ${certificate.title}</h1><h2>${certificate.courseTitle}</h2><p>${certificate.description}</p><h3>${certificate.scoreLabel} ${examScore}/${examQuestions.length}</h3><p class="certificate-student">${certificate.studentName}</p><button class="certificate-print" onclick="window.print()">${certificate.printButton}</button></div>`;
  }

  function init() {
    if (initialized) return;
    initialized = true;
    const config = window.GAME_CONFIG;
    examQuestions = config.exam.questions;
    level2 = document.getElementById("level2");
    level3 = document.getElementById("level3");
    startExamButton = document.getElementById("startExamBtn");
    backToChallengeButton = document.getElementById("backToChallengeBtn");
    nextQuestionButton = document.getElementById("nextQuestionBtn");
    examProgressText = document.getElementById("examProgressText");
    examProgressFill = document.getElementById("examProgressFill");
    examQuestion = document.getElementById("examQuestion");
    examOptions = document.getElementById("examOptions");
    examFeedback = document.getElementById("examFeedback");
    startExamButton.onclick = start;
    backToChallengeButton.onclick = () => {
      cleanup();
      level3.hidden = true;
      level2.hidden = false;
    };
    nextQuestionButton.onclick = () => {
      examQuestionIndex++;
      if (examQuestionIndex < examQuestions.length) loadQuestion();
      else showCertificate();
    };
  }

  window.GameExam = {
    init,
    start,
    reset,
    cleanup
  };
})();
