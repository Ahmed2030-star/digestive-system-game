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
const image=document.getElementById("wholeImage");
const highlightImage=document.getElementById("digestiveHighlight");
const level1=document.getElementById("level1");
const level2=document.getElementById('level2');
const level3=document.getElementById('level3');

// Connector target points as percentages of the displayed SVG image.
const explorerGrid = document.getElementById("explorerGrid");
const connectorLayer = document.getElementById("connectorLayer");
const connectorLines = document.getElementById("connectorLines");
const SVG_NS = "http://www.w3.org/2000/svg";

function createConnectorLines() {
  connectorLines.innerHTML = "";
  PARTS.forEach(part => {
    const line = document.createElementNS(SVG_NS, "line");
    line.classList.add("connector-line");
    line.dataset.part = part.id;
    connectorLines.appendChild(line);
  });
  updateConnectorLines();
}

function updateConnectorLines() {
  if (!explorerGrid || !connectorLayer || !image) return;
  const gridRect = explorerGrid.getBoundingClientRect();
  const imageRect = image.getBoundingClientRect();
  connectorLayer.setAttribute("viewBox", `0 0 ${gridRect.width} ${gridRect.height}`);
  PARTS.forEach(part => {
    const id = part.id;
    const point = part.explorerConnectorTarget;
    const button = document.querySelector(`.parts-panel .part-btn[data-part="${id}"]`);
    const line = connectorLines.querySelector(`.connector-line[data-part="${id}"]`);
    if (!button || !line) return;
    const buttonRect = button.getBoundingClientRect();
    const isLeft = button.closest("#leftParts") !== null;
    const x1 = (isLeft ? buttonRect.right : buttonRect.left) - gridRect.left;
    const y1 = buttonRect.top + buttonRect.height / 2 - gridRect.top;
    const x2 = imageRect.left - gridRect.left + imageRect.width * point.x / 100;
    const y2 = imageRect.top - gridRect.top + imageRect.height * point.y / 100;
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
  });
}

function setActiveConnector(id) {
  document.querySelectorAll(".connector-line").forEach(line =>
    line.classList.toggle("active", line.dataset.part === id)
  );
}

function showExplorerHighlight(partId) {
  if (level1.hidden) return;
  const source = PARTS.find(part => part.id === partId)?.explorerHighlight;
  if (!source || !highlightImage) return;
  highlightImage.src = source;
  highlightImage.classList.add("active");
}

function hideExplorerHighlight() {
  if (!highlightImage) return;
  highlightImage.classList.remove("active");
  highlightImage.removeAttribute("src");
  highlightImage.removeAttribute("alt");
}

const tooltip=document.getElementById("partTooltip");
function showPart(p,e){
  if (level1.hidden) return;
  const isWhole=p.id==="whole";
  if (isWhole) {
    hideExplorerHighlight();
    setActiveConnector("");
  } else {
    showExplorerHighlight(p.id);
    setActiveConnector(p.id);
  }
  document.querySelectorAll(".part-btn").forEach(b=>b.classList.toggle("active",b.dataset.part===p.id));
  if (e) {
    tooltip.textContent=p.hint;
    tooltip.style.left=(e.clientX+15)+"px";
    tooltip.style.top=(e.clientY+15)+"px";
    tooltip.classList.add("show");
  }
}

function resetPart(){
  showPart(PARTS[0]);
  setActiveConnector('');
  tooltip.classList.remove('show');
}

function makeButton(p){
  const b=document.createElement('button');
  b.className='part-btn audio-btn';
  b.dataset.part=p.id;
  b.textContent=p.name;
  b.onmouseenter=e=>showPart(p,e);
  b.onmousemove=e=>{tooltip.style.left=(e.clientX+15)+'px';tooltip.style.top=(e.clientY+15)+'px'};
  b.onmouseleave=resetPart;
  b.onclick=e=>{showPart(p,e);};
  return b;
}

const leftParts=document.getElementById("leftParts");
const rightParts=document.getElementById("rightParts");
PARTS.slice(0, 3).forEach(p => leftParts.appendChild(makeButton(p)));
PARTS.slice(3).forEach(p => rightParts.appendChild(makeButton(p)));

const challengeParts=CONFIG.challenge.leftParts.concat(CONFIG.challenge.rightParts).map(id=>PARTS.find(p=>p.id===id));
const challengeLeftParts=CONFIG.challenge.leftParts.map(id=>PARTS.find(p=>p.id===id));
const challengeRightParts=CONFIG.challenge.rightParts.map(id=>PARTS.find(p=>p.id===id));
const wordBank=document.getElementById('wordBank');
const challengeLeftSlots=document.getElementById('challengeLeftSlots');
const challengeRightSlots=document.getElementById('challengeRightSlots');
const challengeFeedback=document.getElementById('challengeFeedback');
const checkAnswersBtn=document.getElementById('checkAnswersBtn');
const resetIncorrectBtn=document.getElementById('resetIncorrectBtn');
const resetAllBtn=document.getElementById('resetAllBtn');
const startChallengeBtn=document.getElementById('startChallengeBtn');
const startExamBtn=document.getElementById('startExamBtn');
const backToExploreBtn=document.getElementById('backToExploreBtn');
const challengeLayout=document.querySelector('.challenge-layout');
const challengeImage=document.getElementById('challengeImage');
const challengeHighlightImage=document.getElementById('challengeHighlightImage');
challengeHighlightImage.classList.add('challenge-digestive-highlight');
const challengeConnectorLayer=document.getElementById('challengeConnectorLayer');
const challengeConnectorLines=document.getElementById('challengeConnectorLines');
let challengeDragging=false;

function showChallengeHighlight(partId) {
  if (level2.hidden) return;
  const source = PARTS.find(part => part.id === partId)?.challengeHighlight;
  if (!source || !challengeHighlightImage) return;
  challengeHighlightImage.src = source;
  challengeHighlightImage.classList.add('active');
}

function hideChallengeHighlight() {
  if (!challengeHighlightImage) return;
  challengeHighlightImage.classList.remove('active');
  challengeHighlightImage.removeAttribute('src');
  challengeHighlightImage.removeAttribute('alt');
}

function setChallengeConnector(id){
  challengeConnectorLines.querySelectorAll('.challenge-connector-line').forEach(line =>
    line.classList.toggle('active', line.dataset.part === id)
  );
}

function clearChallengeDragState(){
  challengeDragging=false;
  hideChallengeHighlight();
  setChallengeConnector('');
  document.querySelectorAll('#level2 .answer-slot').forEach(slot => slot.classList.remove('active'));
  tooltip.classList.remove('show');
}

function leaveChallenge(){
  clearChallengeDragState();
  GameAudio.stopChallenge();
  GameAudio.stopChallengeCompletion();
  hideChallengeHighlight();
  setChallengeConnector('');
  document.querySelectorAll('#level2 .answer-slot').forEach(slot => {
    slot.classList.remove('active');
  });
}

function updateChallengeConnectorLines(){
  if(!challengeLayout||!challengeImage||!challengeConnectorLayer)return;
  const layoutRect=challengeLayout.getBoundingClientRect();
  const imageRect=challengeImage.getBoundingClientRect();
  challengeConnectorLayer.setAttribute('viewBox',`0 0 ${layoutRect.width} ${layoutRect.height}`);
  challengeParts.forEach(part=>{const slot=document.querySelector(`.challenge-slots .answer-slot[data-part="${part.id}"]`);const line=challengeConnectorLines.querySelector(`.challenge-connector-line[data-part="${part.id}"]`);const target=part.challengeConnectorTarget;if(!slot||!line||!target)return;const slotRect=slot.getBoundingClientRect();const isLeft=slot.closest('.challenge-slots-left')!==null;line.setAttribute('x1',(isLeft?slotRect.right:slotRect.left)-layoutRect.left);line.setAttribute('y1',slotRect.top+slotRect.height/2-layoutRect.top);line.setAttribute('x2',imageRect.left-layoutRect.left+imageRect.width*target.x/100);line.setAttribute('y2',imageRect.top-layoutRect.top+imageRect.height*target.y/100)})
}

function makeChallengeSlot(part,index){
  const slot=document.createElement('div');
  slot.className='answer-slot';
  slot.dataset.part=part.id;
  slot.innerHTML=`<strong>${index+1}</strong><span>${CONFIG.ui.challenge.emptySlot}</span>`;
  slot.ondragover=e=>e.preventDefault();
  slot.ondragenter=()=>{slot.classList.add('active');setChallengeConnector(part.id);showChallengeHighlight(part.id)};
  slot.onmouseenter=()=>{slot.classList.add('active');setChallengeConnector(part.id);showChallengeHighlight(part.id)};
  slot.onmouseleave=()=>{slot.classList.remove('active');setChallengeConnector('');if(!challengeDragging)hideChallengeHighlight()};
  slot.ondrop=e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');const item=challengeParts.find(x=>x.id===id);if(!item)return;slot.dataset.answer=id;slot.innerHTML=`<strong>${index+1}</strong><span class="slot-answer-text">${item.name}</span>`;const audioButton=document.createElement('button');audioButton.type='button';audioButton.className='audio-btn';audioButton.dataset.part=id;audioButton.setAttribute('aria-label',`Play ${item.name} audio`);audioButton.textContent='🔊';slot.appendChild(audioButton);document.querySelector(`#level2 .drag-word[data-part="${id}"]`)?.classList.add('used');clearChallengeDragState()};
  return slot;
}

function buildChallenge(){
  wordBank.innerHTML='';
  challengeLeftSlots.innerHTML='';
  challengeRightSlots.innerHTML='';
  challengeFeedback.textContent='';
  setChallengeConnector('');
  challengeConnectorLines.innerHTML='';
  challengeParts.forEach(part=>{const line=document.createElementNS(SVG_NS,'line');line.classList.add('challenge-connector-line');line.dataset.part=part.id;challengeConnectorLines.appendChild(line)});
  [...challengeParts].sort(()=>Math.random()-.5).forEach(part=>{const word=document.createElement('div');word.className='drag-word';word.draggable=true;word.dataset.part=part.id;word.textContent=part.name;word.onmouseenter=e=>{tooltip.textContent=part.hint;tooltip.style.left=(e.clientX+15)+'px';tooltip.style.top=(e.clientY+15)+'px';tooltip.classList.add('show')};word.onmousemove=e=>{tooltip.style.left=(e.clientX+15)+'px';tooltip.style.top=(e.clientY+15)+'px'};word.onmouseleave=()=>tooltip.classList.remove('show');word.ondragstart=e=>{challengeDragging=true;e.dataTransfer.setData('text/plain',part.id);tooltip.classList.remove('show');showChallengeHighlight(part.id);setChallengeConnector(part.id)};word.ondragend=clearChallengeDragState;wordBank.appendChild(word)});
  challengeLeftParts.forEach((part,index)=>challengeLeftSlots.appendChild(makeChallengeSlot(part,index)));
  challengeRightParts.forEach((part,index)=>challengeRightSlots.appendChild(makeChallengeSlot(part,index+3)));
  requestAnimationFrame(updateChallengeConnectorLines);
}

document.addEventListener("click", event => {
  const button = event.target.closest("#level1 .audio-btn");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  GameAudio.playExplorer(button.dataset.part);
});

document.addEventListener("click", event => {
  const button = event.target.closest("#level2 .answer-slot .audio-btn");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  GameAudio.playChallenge(button.dataset.part);
});

resetIncorrectBtn.onclick=()=>{document.querySelectorAll('#level2 .answer-slot').forEach(slot=>{const wrongId=slot.dataset.answer;if(!wrongId||wrongId===slot.dataset.part)return;document.querySelector(`#level2 .drag-word[data-part="${wrongId}"]`)?.classList.remove('used');slot.innerHTML=`<strong>${slot.querySelector('strong')?.textContent||''}</strong><span>${CONFIG.ui.challenge.emptySlot}</span>`;delete slot.dataset.answer;slot.classList.remove('filled','correct','incorrect','active','success')});clearChallengeDragState();challengeFeedback.textContent=CONFIG.ui.challenge.incorrectResetMessage};
startChallengeBtn.onclick=()=>{level1.hidden=true;level2.hidden=false;GameAudio.stopExplorer();hideExplorerHighlight();document.querySelectorAll('.connector-line').forEach(line => line.classList.remove('active'));document.querySelectorAll('.part-btn').forEach(button => button.classList.remove('active'));buildChallenge()};
backToExploreBtn.onclick=()=>{leaveChallenge();level2.hidden=true;level1.hidden=false};
resetAllBtn.onclick=buildChallenge;
checkAnswersBtn.onclick=()=>{let challengeScore=0;document.querySelectorAll('#level2 .answer-slot').forEach(slot=>{const correct=slot.dataset.answer===slot.dataset.part;slot.classList.toggle('correct',correct);slot.classList.toggle('incorrect',!correct);if(correct)challengeScore++});challengeFeedback.textContent=CONFIG.ui.challenge.scoreFormat.replace("{score}",challengeScore).replace("{total}",challengeParts.length);const score=challengeScore;if(score===6){GameAudio.playChallengeCompletion();document.getElementById("winModal")?.classList.add("show")}};
const winModal=document.getElementById("winModal");
document.getElementById("closeModalBtn")?.addEventListener("click",()=>{GameAudio.stopChallengeCompletion();winModal?.classList.remove("show")});
document.getElementById("playAgainBtn")?.addEventListener("click",()=>{winModal?.classList.remove("show");resetAllBtn.click()});
const examQuestions=CONFIG.exam.questions;let qi=0,score=0,answered=false;
function loadQuestion(){answered=false;nextQuestionBtn.style.display='none';const q=examQuestions[qi];examProgressText.textContent=CONFIG.ui.exam.progressFormat.replace("{current}",qi+1).replace("{total}",examQuestions.length);examProgressFill.style.width=`${(qi+1)/examQuestions.length*100}%`;examQuestion.textContent=q.q;examFeedback.textContent='';examOptions.innerHTML='';[...q.o].sort(()=>Math.random()-.5).forEach(o=>{const b=document.createElement('button');b.className='exam-option';b.textContent=o;b.onclick=()=>{if(answered)return;answered=true;document.querySelectorAll('.exam-option').forEach(x=>x.disabled=true);if(o===q.a){score++;b.classList.add('correct');examFeedback.textContent=CONFIG.ui.exam.correctFeedback;GameAudio.playExamSuccess()}else{b.classList.add('incorrect');examFeedback.textContent=CONFIG.ui.exam.incorrectFeedback.replace("{answer}",q.a);GameAudio.playExamWrong()}nextQuestionBtn.style.display='inline-block'};examOptions.appendChild(b)})}
startExamBtn.onclick=()=>{leaveChallenge();level2.hidden=true;level3.hidden=false;GameAudio.stopExplorer();GameAudio.stopChallenge();GameAudio.stopChallengeCompletion();hideExplorerHighlight();hideChallengeHighlight();qi=0;score=0;loadQuestion()};
backToChallengeBtn.onclick=()=>{GameAudio.stopExam();level3.hidden=true;level2.hidden=false};
nextQuestionBtn.onclick=()=>{qi++;if(qi<examQuestions.length)loadQuestion();else document.querySelector('.exam-container').innerHTML=`<div class="certificate"><h1>🏆 ${CONFIG.ui.certificate.title}</h1><h2>${CONFIG.ui.certificate.courseTitle}</h2><p>${CONFIG.ui.certificate.description}</p><h3>${CONFIG.ui.certificate.scoreLabel} ${score}/${examQuestions.length}</h3><p class="certificate-student">${CONFIG.ui.certificate.studentName}</p><button class="certificate-print" onclick="window.print()">${CONFIG.ui.certificate.printButton}</button></div>`};
createConnectorLines();
window.addEventListener("resize", updateConnectorLines);
window.addEventListener("resize", updateChallengeConnectorLines);
window.addEventListener("scroll", updateChallengeConnectorLines, true);
image.addEventListener("load", updateConnectorLines);
highlightImage.addEventListener("load", updateConnectorLines);
challengeImage.addEventListener("load", updateChallengeConnectorLines);
resetPart();