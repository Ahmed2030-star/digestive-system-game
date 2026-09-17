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

  const certificate = config.ui?.certificate;
  addMissing(certificate?.title, "GAME_CONFIG.ui.certificate.title");
  addMissing(certificate?.courseTitle, "GAME_CONFIG.ui.certificate.courseTitle");
  addMissing(certificate?.description, "GAME_CONFIG.ui.certificate.description");
  return errors;
}

const CONFIG = window.GAME_CONFIG;
const configErrors = validateGameConfig(CONFIG);
if (configErrors.length) {
  configErrors.forEach(error => console.error(`GAME_CONFIG validation error: ${error}`));
  throw new Error("GAME_CONFIG validation failed.");
}
console.log("GAME_CONFIG validation passed.");
const PARTS = CONFIG.parts;
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
GameExplorer.init();
GameChallenge.init();
const level1=document.getElementById("level1");
const level2=document.getElementById('level2');
const level3=document.getElementById('level3');
const startChallengeBtn=document.getElementById('startChallengeBtn');
const startExamBtn=document.getElementById('startExamBtn');
const backToExploreBtn=document.getElementById('backToExploreBtn');

document.addEventListener("click", event => {
  const button = event.target.closest("#level1 .audio-btn");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  GameAudio.playExplorer(button.dataset.part);
});

const examQuestions=CONFIG.exam.questions;let qi=0,score=0,answered=false;
function loadQuestion(){answered=false;nextQuestionBtn.style.display='none';const q=examQuestions[qi];examProgressText.textContent=CONFIG.ui.exam.progressFormat.replace("{current}",qi+1).replace("{total}",examQuestions.length);examProgressFill.style.width=`${(qi+1)/examQuestions.length*100}%`;examQuestion.textContent=q.q;examFeedback.textContent='';examOptions.innerHTML='';[...q.o].sort(()=>Math.random()-.5).forEach(o=>{const b=document.createElement('button');b.className='exam-option';b.textContent=o;b.onclick=()=>{if(answered)return;answered=true;document.querySelectorAll('.exam-option').forEach(x=>x.disabled=true);if(o===q.a){score++;b.classList.add('correct');examFeedback.textContent=CONFIG.ui.exam.correctFeedback;GameAudio.playExamSuccess()}else{b.classList.add('incorrect');examFeedback.textContent=CONFIG.ui.exam.incorrectFeedback.replace("{answer}",q.a);GameAudio.playExamWrong()}nextQuestionBtn.style.display='inline-block'};examOptions.appendChild(b)})}
startChallengeBtn.onclick=()=>{level1.hidden=true;level2.hidden=false;GameAudio.stopExplorer();GameExplorer.hideHighlight();document.querySelectorAll('.connector-line').forEach(line => line.classList.remove('active'));document.querySelectorAll('.part-btn').forEach(button => button.classList.remove('active'));GameChallenge.start()};
backToExploreBtn.onclick=()=>{GameChallenge.cleanup();level2.hidden=true;level1.hidden=false};
startExamBtn.onclick=()=>{GameChallenge.cleanup();level2.hidden=true;level3.hidden=false;GameAudio.stopExplorer();GameAudio.stopChallenge();GameAudio.stopChallengeCompletion();GameExplorer.hideHighlight();GameChallenge.hideHighlight();qi=0;score=0;loadQuestion()};
backToChallengeBtn.onclick=()=>{GameAudio.stopExam();level3.hidden=true;level2.hidden=false};
nextQuestionBtn.onclick=()=>{qi++;if(qi<examQuestions.length)loadQuestion();else document.querySelector('.exam-container').innerHTML=`<div class="certificate"><h1>🏆 ${CONFIG.ui.certificate.title}</h1><h2>${CONFIG.ui.certificate.courseTitle}</h2><p>${CONFIG.ui.certificate.description}</p><h3>${CONFIG.ui.certificate.scoreLabel} ${score}/${examQuestions.length}</h3><p class="certificate-student">${CONFIG.ui.certificate.studentName}</p><button class="certificate-print" onclick="window.print()">${CONFIG.ui.certificate.printButton}</button></div>`};
