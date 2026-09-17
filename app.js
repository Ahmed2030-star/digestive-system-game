const PARTS = [
  {id:"mouth",name:"Mouth",image:"1_mouth.svg",highlight:"1_mouth_Highlight.svg",hint:"Food enters the digestive system here and chewing begins."},
 {id:"esophagus",name:"Food pipe (Esophagus)",image:"2_esophagus.svg",highlight:"2_esophagus_Highlight.svg",hint:"A muscular tube that carries food from the mouth to the stomach."},
 {id:"stomach",name:"Stomach",image:"3_stomach.svg",highlight:"3_stomach_Highlight.svg",hint:"A muscular organ that mixes food with digestive juices."},
 {id:"small-intestine",name:"Small Intestine",image:"4_small_intestine.svg",highlight:"4_small_intestine_Highlight.svg",hint:"Most digestion and absorption of nutrients take place here."},
 {id:"large-intestine",name:"Large Intestine",image:"5_large_intestine.svg",highlight:"5_large_intestine_Highlight.svg",hint:"It absorbs water and forms solid waste."},
 {id:"anus",name:"Anus",image:"6_anus.svg",highlight:"6_anus_Highlight.svg",hint:"The opening through which solid waste leaves the body."}
];
const PATH="assets/digestive-system/";
const EXPLORER_HIGHLIGHT_FILES = {
  mouth: "assets/digestive-system/explorer-highlights/1_mouth_Highlight.svg",
  esophagus: "assets/digestive-system/explorer-highlights/2_esophagus_Highlight.svg",
  stomach: "assets/digestive-system/explorer-highlights/3_stomach_Highlight.svg",
  "small-intestine": "assets/digestive-system/explorer-highlights/4_small_intestine_Highlight.svg",
  "large-intestine": "assets/digestive-system/explorer-highlights/5_large_intestine_Highlight.svg",
  anus: "assets/digestive-system/explorer-highlights/6_anus_Highlight.svg"
};
const CHALLENGE_HIGHLIGHT_FILES = {
  mouth: "assets/digestive-system/challenge-highlights/1_mouth_Highlight.svg",
  esophagus: "assets/digestive-system/challenge-highlights/2_esophagus_Highlight.svg",
  stomach: "assets/digestive-system/challenge-highlights/3_stomach_Highlight.svg",
  "small-intestine": "assets/digestive-system/challenge-highlights/4_small_intestine_Highlight.svg",
  "large-intestine": "assets/digestive-system/challenge-highlights/5_large_intestine_Highlight.svg",
  anus: "assets/digestive-system/challenge-highlights/6_anus_Highlight.svg"
};
const EXPLORER_AUDIO_FILES = {
  mouth: "assets/audio/digestive-system/explorer/mouth.mp3",
  esophagus: "assets/audio/digestive-system/explorer/esophagus.mp3",
  stomach: "assets/audio/digestive-system/explorer/stomach.mp3",
  "small-intestine": "assets/audio/digestive-system/explorer/small-intestine.mp3",
  "large-intestine": "assets/audio/digestive-system/explorer/large-intestine.mp3",
  anus: "assets/audio/digestive-system/explorer/anus.mp3"
};
const CHALLENGE_AUDIO_FILES = {
  mouth: "assets/audio/digestive-system/challenge/mouth.mp3",
  esophagus: "assets/audio/digestive-system/challenge/esophagus.mp3",
  stomach: "assets/audio/digestive-system/challenge/stomach.mp3",
  "small-intestine": "assets/audio/digestive-system/challenge/small-intestine.mp3",
  "large-intestine": "assets/audio/digestive-system/challenge/large-intestine.mp3",
  anus: "assets/audio/digestive-system/challenge/anus.mp3"
};
const explorerAudioPlayer = new Audio();
const challengeAudioPlayer = new Audio();
const challengeCompletionSound = new Audio(
  "assets/audio/digestive-system/challenge/completion-sound.mp3"
);
const examSuccessSound = new Audio(
  "assets/audio/digestive-system/exam/success.mp3"
);
const examWrongSound = new Audio(
  "assets/audio/digestive-system/exam/wrong.mp3"
);
explorerAudioPlayer.preload = "auto";
challengeAudioPlayer.preload = "auto";
challengeCompletionSound.preload = "auto";
examSuccessSound.preload = "auto";
examWrongSound.preload = "auto";
explorerAudioPlayer.volume = 1;
challengeAudioPlayer.volume = 1;
challengeCompletionSound.volume = 1;
examSuccessSound.volume = 1;
examWrongSound.volume = 1;
const image=document.getElementById("wholeImage");
const highlightImage=document.getElementById("digestiveHighlight");
const level1=document.getElementById("level1");
const level2=document.getElementById('level2');
const level3=document.getElementById('level3');

function stopExplorerAudio() {
  explorerAudioPlayer.pause();
  explorerAudioPlayer.currentTime = 0;
}

function stopChallengeAudio() {
  challengeAudioPlayer.pause();
  challengeAudioPlayer.currentTime = 0;
}

function stopChallengeCompletionSound() {
  challengeCompletionSound.pause();
  challengeCompletionSound.currentTime = 0;
}

function stopExamSounds() {
  examSuccessSound.pause();
  examSuccessSound.currentTime = 0;
  examWrongSound.pause();
  examWrongSound.currentTime = 0;
}

// Connector target points as percentages of the displayed SVG image.
const PART_TARGETS = {
  mouth: { x: 57, y: 6 },
  esophagus: { x: 50, y: 31 },
  stomach: { x: 55, y: 58 },
  "small-intestine": { x: 50, y: 76 },
  "large-intestine": { x: 68, y: 72 },
  anus: { x: 49, y: 95 }
};
const explorerGrid = document.getElementById("explorerGrid");
const connectorLayer = document.getElementById("connectorLayer");
const connectorLines = document.getElementById("connectorLines");
const SVG_NS = "http://www.w3.org/2000/svg";

function createConnectorLines() {
  connectorLines.innerHTML = "";
  Object.keys(PART_TARGETS).forEach(id => {
    const line = document.createElementNS(SVG_NS, "line");
    line.classList.add("connector-line");
    line.dataset.part = id;
    connectorLines.appendChild(line);
  });
  updateConnectorLines();
}

function updateConnectorLines() {
  if (!explorerGrid || !connectorLayer || !image) return;
  const gridRect = explorerGrid.getBoundingClientRect();
  const imageRect = image.getBoundingClientRect();
  connectorLayer.setAttribute("viewBox", `0 0 ${gridRect.width} ${gridRect.height}`);
  Object.entries(PART_TARGETS).forEach(([id, point]) => {
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
  const source = EXPLORER_HIGHLIGHT_FILES[partId];
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

function playExplorerAudio(partId) {
  if (level1.hidden) return;
  const source = EXPLORER_AUDIO_FILES[partId];
  if (!source) return;
  stopChallengeAudio();
  explorerAudioPlayer.pause();
  explorerAudioPlayer.currentTime = 0;
  explorerAudioPlayer.src = source;
  explorerAudioPlayer.play().catch(error => {
    console.error("Explorer audio error:", error);
  });
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

const challengeParts=["mouth","esophagus","stomach","small-intestine","large-intestine","anus"].map(id=>PARTS.find(p=>p.id===id));
const challengeLeftParts=challengeParts.slice(0,3);
const challengeRightParts=challengeParts.slice(3);
const challengeTargets={mouth:{x:57,y:6},esophagus:{x:50,y:31},stomach:{x:55,y:58},"small-intestine":{x:50,y:76},"large-intestine":{x:68,y:72},anus:{x:49,y:95}};
const CHALLENGE_SLOT_OFFSETS={mouth:{x:0,y:0},esophagus:{x:0,y:0},stomach:{x:0,y:20},"small-intestine":{x:0,y:0},"large-intestine":{x:0,y:0},anus:{x:0,y:0}};
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
  const source = CHALLENGE_HIGHLIGHT_FILES[partId];
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
  stopChallengeAudio();
  stopChallengeCompletionSound();
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
  challengeParts.forEach(part=>{const slot=document.querySelector(`.challenge-slots .answer-slot[data-part="${part.id}"]`);const line=challengeConnectorLines.querySelector(`.challenge-connector-line[data-part="${part.id}"]`);const target=challengeTargets[part.id];if(!slot||!line||!target)return;const slotRect=slot.getBoundingClientRect();const isLeft=slot.closest('.challenge-slots-left')!==null;line.setAttribute('x1',(isLeft?slotRect.right:slotRect.left)-layoutRect.left);line.setAttribute('y1',slotRect.top+slotRect.height/2-layoutRect.top);line.setAttribute('x2',imageRect.left-layoutRect.left+imageRect.width*target.x/100);line.setAttribute('y2',imageRect.top-layoutRect.top+imageRect.height*target.y/100)})
}

function makeChallengeSlot(part,index){
  const slot=document.createElement('div');
  slot.className='answer-slot';
  slot.dataset.part=part.id;
  slot.innerHTML=`<strong>${index+1}</strong><span>Drop the name here</span>`;
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

function playChallengeAudio(partId) {
  if (level2.hidden) return;
  const source = CHALLENGE_AUDIO_FILES[partId];
  if (!source) return;
  stopExplorerAudio();
  challengeAudioPlayer.pause();
  challengeAudioPlayer.currentTime = 0;
  challengeAudioPlayer.src = source;
  challengeAudioPlayer.play().catch(error => {
    console.error("Challenge audio error:", error);
  });
}

document.addEventListener("click", event => {
  const button = event.target.closest("#level1 .audio-btn");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  playExplorerAudio(button.dataset.part);
});

document.addEventListener("click", event => {
  const button = event.target.closest("#level2 .answer-slot .audio-btn");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  playChallengeAudio(button.dataset.part);
});

resetIncorrectBtn.onclick=()=>{document.querySelectorAll('#level2 .answer-slot').forEach(slot=>{const wrongId=slot.dataset.answer;if(!wrongId||wrongId===slot.dataset.part)return;document.querySelector(`#level2 .drag-word[data-part="${wrongId}"]`)?.classList.remove('used');slot.innerHTML=`<strong>${slot.querySelector('strong')?.textContent||''}</strong><span>Drop the name here</span>`;delete slot.dataset.answer;slot.classList.remove('filled','correct','incorrect','active','success')});clearChallengeDragState();challengeFeedback.textContent='Incorrect answers have been reset.'};
startChallengeBtn.onclick=()=>{level1.hidden=true;level2.hidden=false;stopExplorerAudio();hideExplorerHighlight();document.querySelectorAll('.connector-line').forEach(line => line.classList.remove('active'));document.querySelectorAll('.part-btn').forEach(button => button.classList.remove('active'));buildChallenge()};
backToExploreBtn.onclick=()=>{leaveChallenge();level2.hidden=true;level1.hidden=false};
resetAllBtn.onclick=buildChallenge;
checkAnswersBtn.onclick=()=>{let challengeScore=0;document.querySelectorAll('#level2 .answer-slot').forEach(slot=>{const correct=slot.dataset.answer===slot.dataset.part;slot.classList.toggle('correct',correct);slot.classList.toggle('incorrect',!correct);if(correct)challengeScore++});challengeFeedback.textContent=`Score: ${challengeScore}/${challengeParts.length}`;const score=challengeScore;if(score===6){challengeCompletionSound.pause();challengeCompletionSound.currentTime=0;challengeCompletionSound.muted=false;challengeCompletionSound.volume=1;challengeCompletionSound.play().catch(error=>{console.error("Completion sound error:",error)});document.getElementById("winModal")?.classList.add("show")}};
const winModal=document.getElementById("winModal");
document.getElementById("closeModalBtn")?.addEventListener("click",()=>winModal?.classList.remove("show"));
document.getElementById("playAgainBtn")?.addEventListener("click",()=>{winModal?.classList.remove("show");resetAllBtn.click()});
const examQuestions=[
 {q:"Where does food enter the digestive system?",o:["Mouth","Stomach","Anus","Large Intestine"],a:"Mouth"},
 {q:"Which tube carries food to the stomach?",o:["Esophagus","Small Intestine","Large Intestine","Anus"],a:"Esophagus"},
 {q:"Which organ mixes food with digestive juices?",o:["Stomach","Mouth","Anus","Esophagus"],a:"Stomach"},
 {q:"Where are most nutrients absorbed?",o:["Small Intestine","Large Intestine","Mouth","Anus"],a:"Small Intestine"},
 {q:"Which part absorbs water and forms solid waste?",o:["Large Intestine","Stomach","Esophagus","Mouth"],a:"Large Intestine"},
 {q:"Through which opening does solid waste leave the body?",o:["Anus","Mouth","Stomach","Esophagus"],a:"Anus"}
];let qi=0,score=0,answered=false;
function loadQuestion(){answered=false;nextQuestionBtn.style.display='none';const q=examQuestions[qi];examProgressText.textContent=`Question ${qi+1} of ${examQuestions.length}`;examProgressFill.style.width=`${(qi+1)/examQuestions.length*100}%`;examQuestion.textContent=q.q;examFeedback.textContent='';examOptions.innerHTML='';[...q.o].sort(()=>Math.random()-.5).forEach(o=>{const b=document.createElement('button');b.className='exam-option';b.textContent=o;b.onclick=()=>{if(answered)return;answered=true;document.querySelectorAll('.exam-option').forEach(x=>x.disabled=true);if(o===q.a){score++;b.classList.add('correct');examFeedback.textContent='Correct answer!';examWrongSound.pause();examWrongSound.currentTime=0;examSuccessSound.pause();examSuccessSound.currentTime=0;examSuccessSound.muted=false;examSuccessSound.volume=1;examSuccessSound.play().catch(error=>{console.error("Success sound error:",error)})}else{b.classList.add('incorrect');examFeedback.textContent=`Correct answer: ${q.a}`;examSuccessSound.pause();examSuccessSound.currentTime=0;examWrongSound.pause();examWrongSound.currentTime=0;examWrongSound.muted=false;examWrongSound.volume=1;examWrongSound.play().catch(error=>{console.error("Wrong sound error:",error)})}nextQuestionBtn.style.display='inline-block'};examOptions.appendChild(b)})}
startExamBtn.onclick=()=>{leaveChallenge();level2.hidden=true;level3.hidden=false;stopExplorerAudio();stopChallengeAudio();stopChallengeCompletionSound();hideExplorerHighlight();hideChallengeHighlight();qi=0;score=0;loadQuestion()};
backToChallengeBtn.onclick=()=>{stopExamSounds();level3.hidden=true;level2.hidden=false};
nextQuestionBtn.onclick=()=>{qi++;if(qi<examQuestions.length)loadQuestion();else document.querySelector('.exam-container').innerHTML=`<div class="certificate"><h1>🏆 Certificate of Excellence</h1><h2>Digestive System Explorer</h2><p>This certificate is proudly awarded for successfully completing the Level 3 Exam.</p><h3>Score: ${score}/${examQuestions.length}</h3><p class="certificate-student">Ahmed Sayed Nasary</p><button class="certificate-print" onclick="window.print()">🖨 Print Certificate</button></div>`};
createConnectorLines();
window.addEventListener("resize", updateConnectorLines);
window.addEventListener("resize", updateChallengeConnectorLines);
window.addEventListener("scroll", updateChallengeConnectorLines, true);
image.addEventListener("load", updateConnectorLines);
highlightImage.addEventListener("load", updateConnectorLines);
challengeImage.addEventListener("load", updateChallengeConnectorLines);
resetPart();