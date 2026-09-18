function validateGameConfig(config) {
  const errors = [];
  const addMissing = (condition, path) => {
    if (!condition) errors.push(`Missing or invalid ${path}`);
  };

  if (!config) return ["window.GAME_CONFIG"];
  addMissing(Array.isArray(config.parts), "GAME_CONFIG.parts array");
  if (Array.isArray(config.parts)) {
    const ids = new Set();
    config.parts.forEach((part, index) => {
      const path = `GAME_CONFIG.parts[${index}]`;
      addMissing(part && part.id, `${path}.id`);
      if (part?.id && ids.has(part.id)) errors.push(`Duplicate ${path}.id: ${part.id}`);
      if (part?.id) ids.add(part.id);
      addMissing(part && part.name, `${path}.name`);
      addMissing(part && part.hint, `${path}.hint`);
      addMissing(part && part.explorerHighlight, `${path}.explorerHighlight`);
      addMissing(part && part.challengeHighlight, `${path}.challengeHighlight`);
      addMissing(part && part.explorerAudio, `${path}.explorerAudio`);
      addMissing(part && part.challengeAudio, `${path}.challengeAudio`);
      addMissing(Number.isFinite(part?.explorerConnectorTarget?.x), `${path}.explorerConnectorTarget.x`);
      addMissing(Number.isFinite(part?.explorerConnectorTarget?.y), `${path}.explorerConnectorTarget.y`);
      addMissing(Number.isFinite(part?.challengeConnectorTarget?.x), `${path}.challengeConnectorTarget.x`);
      addMissing(Number.isFinite(part?.challengeConnectorTarget?.y), `${path}.challengeConnectorTarget.y`);
      addMissing(part?.challengeSide === "left" || part?.challengeSide === "right", `${path}.challengeSide`);
    });
  }

  const challenge = config.challenge;
  addMissing(Array.isArray(challenge?.leftParts) && challenge.leftParts.length === 3, "GAME_CONFIG.challenge.leftParts with exactly 3 parts");
  addMissing(Array.isArray(challenge?.rightParts) && challenge.rightParts.length === 3, "GAME_CONFIG.challenge.rightParts with exactly 3 parts");
  addMissing(challenge?.completionSound, "GAME_CONFIG.challenge.completionSound");

  const exam = config.exam;
  addMissing(Array.isArray(exam?.questions) && exam.questions.length >= 6, "GAME_CONFIG.exam.questions with at least 6 questions");
  addMissing(exam?.successSound, "GAME_CONFIG.exam.successSound");
  addMissing(exam?.wrongSound, "GAME_CONFIG.exam.wrongSound");
  if (Array.isArray(exam?.questions)) {
    exam.questions.forEach((question, index) => {
      const path = `GAME_CONFIG.exam.questions[${index}]`;
      addMissing(question?.q, `${path}.q`);
      addMissing(Array.isArray(question?.o) && question.o.length >= 2, `${path}.o with at least 2 options`);
      addMissing(question?.a, `${path}.a`);
      addMissing(Array.isArray(question?.o) && question.o.includes(question.a), `${path}.a included in ${path}.o`);
    });
  }

  const certificate = config.certificate;
  addMissing(certificate?.title, "GAME_CONFIG.certificate.title");
  addMissing(certificate?.gameTitle, "GAME_CONFIG.certificate.gameTitle");
  addMissing(certificate?.description, "GAME_CONFIG.certificate.description");
  addMissing(certificate?.studentName, "GAME_CONFIG.certificate.studentName");
  addMissing(typeof certificate?.studentNameEnabled === "boolean", "GAME_CONFIG.certificate.studentNameEnabled");
  addMissing(Number.isFinite(certificate?.minimumPassingScore), "GAME_CONFIG.certificate.minimumPassingScore");
  addMissing(typeof certificate?.dateEnabled === "boolean", "GAME_CONFIG.certificate.dateEnabled");
  addMissing(certificate?.printButton, "GAME_CONFIG.certificate.printButton");
  return errors;
}

const CONFIG = window.GAME_CONFIG;

function applyUiText() {
  document.title = CONFIG.game.title;
  document.querySelector("header h1").textContent = CONFIG.ui.explorer.title;
  document.querySelector(".subtitle").textContent = CONFIG.ui.explorer.subtitle;
  document.getElementById("startChallengeBtn").textContent = CONFIG.ui.explorer.startChallenge;
  document.querySelector("#level2 h2").textContent = CONFIG.ui.challenge.title;
  document.querySelector("#level2 > p").textContent = CONFIG.ui.challenge.instructions;
  document.getElementById("checkAnswersBtn").textContent = CONFIG.ui.challenge.checkAnswers;
  document.getElementById("resetIncorrectBtn").textContent = CONFIG.ui.challenge.resetIncorrect;
  document.getElementById("resetAllBtn").textContent = CONFIG.ui.challenge.resetAll;
  document.getElementById("startExamBtn").textContent = CONFIG.ui.challenge.startExam;
  document.getElementById("backToExploreBtn").textContent = CONFIG.ui.challenge.back;
  document.querySelector("#winTitle").textContent = CONFIG.ui.challenge.congratulations;
  document.querySelector("#winModal .win-box p").textContent = CONFIG.ui.challenge.completionMessage;
  document.getElementById("playAgainBtn").textContent = CONFIG.ui.challenge.playAgain;
  document.getElementById("closeModalBtn").textContent = CONFIG.ui.challenge.close;
  document.querySelector("#level3 h2").textContent = CONFIG.ui.exam.title;
  document.getElementById("backToChallengeBtn").textContent = CONFIG.ui.exam.back;
  document.getElementById("nextQuestionBtn").textContent = CONFIG.ui.exam.nextQuestion;
}

function initializeGame() {
  const configErrors = validateGameConfig(CONFIG);
  if (configErrors.length) {
    configErrors.forEach(error => console.error(`GAME_CONFIG validation error: ${error}`));
    throw new Error("GAME_CONFIG validation failed.");
  }
  console.log("GAME_CONFIG validation passed.");
  applyUiText();
  GameExplorer.init();
  GameChallenge.init();
  GameExam.init();
}

initializeGame();
const level1=document.getElementById("level1");
const level2=document.getElementById('level2');
const startChallengeBtn=document.getElementById('startChallengeBtn');
const backToExploreBtn=document.getElementById('backToExploreBtn');

document.addEventListener("click", event => {
  const button = event.target.closest("#level1 .audio-btn");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  GameAudio.playExplorer(button.dataset.part);
});

startChallengeBtn.onclick=()=>{level1.hidden=true;level2.hidden=false;GameAudio.stopExplorer();GameExplorer.hideHighlight();document.querySelectorAll('.connector-line').forEach(line => line.classList.remove('active'));document.querySelectorAll('.part-btn').forEach(button => button.classList.remove('active'));GameChallenge.start()};
backToExploreBtn.onclick=()=>{GameChallenge.cleanup();level2.hidden=true;level1.hidden=false};
