const PARTS = [
 {id:"whole",name:"Whole",image:"0_whole.svg",hint:"The complete digestive system."},
 {id:"mouth",name:"Mouth",image:"1_mouth.svg",highlight:"1_mouth_Highlight.svg",hint:"Food enters the digestive system here and chewing begins."},
 {id:"esophagus",name:"Food pipe (Esophagus)",image:"2_esophagus.svg",highlight:"2_esophagus_Highlight.svg",hint:"A muscular tube that carries food from the mouth to the stomach."},
 {id:"stomach",name:"Stomach",image:"3_stomach.svg",highlight:"3_stomach_Highlight.svg",hint:"A muscular organ that mixes food with digestive juices."},
 {id:"small-intestine",name:"Small Intestine",image:"4_small_intestine.svg",highlight:"4_small_intestine_Highlight.svg",hint:"Most digestion and absorption of nutrients take place here."},
 {id:"large-intestine",name:"Large Intestine",image:"5_large_intestine.svg",highlight:"5_large_intestine_Highlight.svg",hint:"It absorbs water and forms solid waste."},
 {id:"anus",name:"Anus",image:"6_anus.svg",highlight:"6_anus_Highlight.svg",hint:"The opening through which solid waste leaves the body."}
];
const PATH="assets/digestive-system/";
const HIGHLIGHT_PATH="assets/digestive-system/highlights/";
const AUDIO_FILES = {
  mouth: "assets/audio/digestive-system/mouth.mp3",
  esophagus: "assets/audio/digestive-system/esophagus.mp3",
  stomach: "assets/audio/digestive-system/stomach.mp3",
  smallIntestine: "assets/audio/digestive-system/small-intestine.mp3",
  largeIntestine: "assets/audio/digestive-system/large-intestine.mp3",
  anus: "assets/audio/digestive-system/anus.mp3"
};
const audioPlayer = new Audio();
const image=document.getElementById("wholeImage");
const highlightImage=document.getElementById("digestiveHighlight");

// Connector target points as percentages of the displayed SVG image.
const PART_TARGETS = {
  mouth: { x: 57, y: 11 },
  esophagus: { x: 55, y: 31 },
  stomach: { x: 59, y: 58 },
  "small-intestine": { x: 55, y: 76 },
  "large-intestine": { x: 52, y: 72 },
  anus: { x: 52, y: 96 }
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

const tooltip=document.getElementById("partTooltip");
function showPart(p,e){
  const isWhole=p.id==="whole";
  highlightImage.classList.toggle("active",!isWhole);
  highlightImage.src=isWhole ? "" : HIGHLIGHT_PATH+p.highlight;
  highlightImage.alt=isWhole ? "" : `${p.name} highlighted`;
  setActiveConnector(isWhole ? "" : p.id);
  document.querySelectorAll(".part-btn").forEach(b=>b.classList.toggle("active",b.dataset.part===p.id));
  if(e){tooltip.textContent=p.hint;tooltip.style.left=(e.clientX+15)+"px";tooltip.style.top=(e.clientY+15)+"px";tooltip.classList.add("show")}
}
function resetPart(){showPart(PARTS[0]);setActiveConnector('');tooltip.classList.remove('show')}
function playPartAudio(id){
  const audioKey = id === "small-intestine" ? "smallIntestine" : id === "large-intestine" ? "largeIntestine" : id;
  const audioFile = AUDIO_FILES[audioKey];
  if (!audioFile) return;
  audioPlayer.src = audioFile;
  audioPlayer.currentTime = 0;
  audioPlayer.play().catch(() => {});
}
function makeButton(p){const b=document.createElement('button');b.className='part-btn';b.dataset.part=p.id;b.textContent=p.name;b.onmouseenter=e=>showPart(p,e);b.onmousemove=e=>{tooltip.style.left=(e.clientX+15)+'px';tooltip.style.top=(e.clientY+15)+'px'};b.onmouseleave=resetPart;b.onclick=e=>{showPart(p,e);playPartAudio(p.id)};return b}
PARTS.slice(0,4).forEach(p=>leftParts.appendChild(makeButton(p)));PARTS.slice(4).forEach(p=>rightParts.appendChild(makeButton(p)));PARTS.forEach(p=>mobileParts.appendChild(makeButton(p)));
const challengeParts=PARTS.slice(1);
function buildChallenge(){wordBank.innerHTML='';answerSlots.innerHTML='';challengeFeedback.textContent='';[...challengeParts].sort(()=>Math.random()-.5).forEach(p=>{const w=document.createElement('div');w.className='drag-word';w.draggable=true;w.dataset.part=p.id;w.textContent=p.name;w.ondragstart=e=>e.dataTransfer.setData('text/plain',p.id);wordBank.appendChild(w)});challengeParts.forEach((p,i)=>{const s=document.createElement('div');s.className='answer-slot';s.dataset.part=p.id;s.innerHTML=`<strong>${i+1}</strong><span>Drop the name here</span>`;s.ondragover=e=>e.preventDefault();s.ondrop=e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');const item=challengeParts.find(x=>x.id===id);s.dataset.answer=id;s.innerHTML=`<strong>${i+1}</strong><span>${item.name}</span>`;document.querySelector(`.drag-word[data-part="${id}"]`)?.classList.add('used')};answerSlots.appendChild(s)})}
startChallengeBtn.onclick=()=>{level1.hidden=true;level2.hidden=false;buildChallenge()};backToExploreBtn.onclick=()=>{level2.hidden=true;level1.hidden=false};resetAllBtn.onclick=buildChallenge;
checkAnswersBtn.onclick=()=>{let score=0;document.querySelectorAll('.answer-slot').forEach(s=>{const ok=s.dataset.answer===s.dataset.part;s.classList.toggle('correct',ok);s.classList.toggle('incorrect',!ok);if(ok)score++});challengeFeedback.textContent=`Score: ${score}/${challengeParts.length}`};
const examQuestions=[
 {q:"Where does food enter the digestive system?",o:["Mouth","Stomach","Anus","Large Intestine"],a:"Mouth"},
 {q:"Which tube carries food to the stomach?",o:["Esophagus","Small Intestine","Large Intestine","Anus"],a:"Esophagus"},
 {q:"Which organ mixes food with digestive juices?",o:["Stomach","Mouth","Anus","Esophagus"],a:"Stomach"},
 {q:"Where are most nutrients absorbed?",o:["Small Intestine","Large Intestine","Mouth","Anus"],a:"Small Intestine"},
 {q:"Which part absorbs water and forms solid waste?",o:["Large Intestine","Stomach","Esophagus","Mouth"],a:"Large Intestine"},
 {q:"Through which opening does solid waste leave the body?",o:["Anus","Mouth","Stomach","Esophagus"],a:"Anus"}
];let qi=0,score=0,answered=false;
function loadQuestion(){answered=false;nextQuestionBtn.style.display='none';const q=examQuestions[qi];examProgressText.textContent=`Question ${qi+1} of ${examQuestions.length}`;examProgressFill.style.width=`${(qi+1)/examQuestions.length*100}%`;examQuestion.textContent=q.q;examFeedback.textContent='';examOptions.innerHTML='';[...q.o].sort(()=>Math.random()-.5).forEach(o=>{const b=document.createElement('button');b.className='exam-option';b.textContent=o;b.onclick=()=>{if(answered)return;answered=true;document.querySelectorAll('.exam-option').forEach(x=>x.disabled=true);if(o===q.a){score++;b.classList.add('correct');examFeedback.textContent='Correct answer!'}else{b.classList.add('incorrect');examFeedback.textContent=`Correct answer: ${q.a}`}nextQuestionBtn.style.display='inline-block'};examOptions.appendChild(b)})}
startExamBtn.onclick=()=>{level2.hidden=true;level3.hidden=false;qi=0;score=0;loadQuestion()};backToChallengeBtn.onclick=()=>{level3.hidden=true;level2.hidden=false};nextQuestionBtn.onclick=()=>{qi++;if(qi<examQuestions.length)loadQuestion();else document.querySelector('.exam-container').innerHTML=`<div class="certificate"><h1>Certificate of Excellence</h1><h2>Digestive System Explorer</h2><p>Successfully completed the exam.</p><h3>Score: ${score}/${examQuestions.length}</h3><button onclick="window.print()">Print Certificate</button></div>`};
createConnectorLines();
window.addEventListener("resize", updateConnectorLines);
image.addEventListener("load", updateConnectorLines);
highlightImage.addEventListener("load", updateConnectorLines);
resetPart();