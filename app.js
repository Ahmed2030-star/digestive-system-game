/**
 * Flower Parts Explorer - Interactive Science Learning Hub
 * Connects labels around the flower with SVG connector lines
 * Highlights parts on hover with smooth animations
 */


console.log("Flower Parts Explorer initialized");

const AUDIO_FILES = {

  anther:
    "https://raw.githubusercontent.com/Ahmed2030-star/Qwen3.7-Plus---Knowledge-Map2/main/anther.mp3",

  filament:
    "https://raw.githubusercontent.com/Ahmed2030-star/Qwen3.7-Plus---Knowledge-Map2/main/filament.mp3",

  stigma:
    "https://raw.githubusercontent.com/Ahmed2030-star/Qwen3.7-Plus---Knowledge-Map2/main/stigma.mp3",

  style:
    "https://raw.githubusercontent.com/Ahmed2030-star/Qwen3.7-Plus---Knowledge-Map2/main/style.mp3",

  ovary:
    "https://raw.githubusercontent.com/Ahmed2030-star/Qwen3.7-Plus---Knowledge-Map2/main/ovary.mp3",

  ovule:
    "https://raw.githubusercontent.com/Ahmed2030-star/Qwen3.7-Plus---Knowledge-Map2/main/ovule.mp3",

  sepal:
    "https://raw.githubusercontent.com/Ahmed2030-star/Qwen3.7-Plus---Knowledge-Map2/main/sepal.mp3",

  petal:
    "https://raw.githubusercontent.com/Ahmed2030-star/Qwen3.7-Plus---Knowledge-Map2/main/petal.mp3"

};

// =========================
// Sound System
// =========================

const successSound = new Audio("assets/sounds/success.mp3");
const errorSound = new Audio("assets/sounds/wrong.mp3");
const completeSound = new Audio("assets/sounds/Completion Sound.mp3");

let soundEnabled = true;

function playSound(audio) {
  if (!soundEnabled) return;

  audio.currentTime = 0;

  audio.play().catch(err => {
    console.log(err);
  });
}
// ============================================
// CONFIGURATION
// ============================================

// Flower part center coordinates in SVG viewBox (0 0 210 297)
// These are approximate centers for each flower part

const START_OFFSET = {
  anther:   { x: 0,  y: -1 },
  filament: { x: 0,  y: 5 },
  petal:    { x: 0,  y: 0 },
  sepal:    { x: 0,  y: -1 },

  stigma:   { x: 0,  y: -1 },
  style:    { x: 0,  y: 0 },
  ovary:    { x: 0,  y: -1 },
  ovule:    { x: 0,  y: -3 }
};

const PART_CENTERS = {
  anther:    { x: 75, y: 95 },
  filament:  { x: 81, y: 115 },
  stigma:    { x: 110, y: 75 },
  style:     { x: 115, y: 100 },
  ovary:     { x: 120, y: 135 },
  ovule:     { x: 105, y: 150 },
  sepal:     { x: 65, y: 160 },
  petal:     { x: 50, y: 120 }
};

const CHALLENGE_PART_CENTERS = {
  anther:   { x: 60, y: 90 },
  filament: { x: 75, y: 115 },
  stigma:   { x: 90, y: 70 },
  style:    { x: 115, y: 100 },
  ovary:    { x: 100, y: 135 },
  ovule:    { x: 90, y: 150 },
  sepal:    { x: 30, y: 160 },
  petal:    { x: 50, y: 120 }
};

const CHALLENGE_SLOT_OFFSETS = {
  anther:   { x: 50, y: -8 },
  filament: { x: 50, y: -15 },
  sepal:    { x: 50, y: -20 },
  petal:    { x: 50, y: -20 },

  stigma:   { x: -125, y: -15 },
  style:    { x: -125, y: -20 },
  ovary:    { x: -125, y: -25 },
  ovule:    { x: -125, y: -30 }
};

// Part display names
const PART_NAMES = {
  anther: "Anther",
  filament: "Filament",
  stigma: "Stigma",
  style: "Style",
  ovary: "Ovary",
  ovule: "Ovule",
  sepal: "Sepal",
  petal: "Petal",
};

const PART_HINTS = {

  anther:
    "Where pollen is made and stored in pollen sacs.",

  filament:
    "The slender stalk that supports the anther.",

  stigma:
    "Female part that receives pollen from another flower.",

  style:
    "The stalk that connects the stigma and the ovary.",

  ovary:
    "Contains the ovules in the female part of the plant.",

  ovule:
    "Contains female sex cells and develops into a seed after fertilization.",

  sepal:
    "Acts as a case to protect the flower bud before it opens.",

  petal:
    "Colored part of the flower that helps attract pollinators."

};

// Desktop left/right panel assignment
const LEFT_PANEL_PARTS = ["anther", "filament", "sepal", "petal"];
const RIGHT_PANEL_PARTS = ["stigma", "style", "ovary", "ovule"];

// ============================================
// DOM ELEMENTS
// ============================================

const flowerContainer = document.getElementById("flowerContainer");
const connectorLayer = document.getElementById("connectorLayer");
const connectorLinesGroup = document.getElementById("connectorLines");
const baseLayer = document.getElementById("baseLayer");

// All highlight layers
const highlightLayers = flowerContainer.querySelectorAll(".highlight-layer");

// All part buttons (both desktop and mobile)
const allPartButtons = document.querySelectorAll(".part-btn");

// Desktop panels
const leftPanel = document.querySelector(".labels-panel.left");
const rightPanel = document.querySelector(".labels-panel.right");

// Mobile panel
const mobilePanel = document.querySelector(".mobile-panel");

// ============================================
// STATE
// ============================================

let activePart = null;
let isLocked = false;

let connectorLines = {};
let labelPositions = {};

let flowerRect = null;
let connectorLayerRect = null;

let debugCircles = {};

let draggedPart = null;
let draggedWord = null;


// ============================================
// 
// ============================================

const examQuestions = [

  {
    question: "What is the name of the male part that produces pollen?",
    options: ["Anther", "Petal", "Sepal", "Ovule"],
    answer: "Anther"
  },

  {
    question: "Which part receives pollen?",
    options: ["Style", "Stigma", "Ovary", "Filament"],
    answer: "Stigma"
  },

  {
    question: "Which part protects the flower bud?",
    options: ["Petal", "Ovule", "Sepal", "Anther"],
    answer: "Sepal"
  },

  {
    question: "Which part attracts insects?",
    options: ["Petal", "Filament", "Style", "Ovary"],
    answer: "Petal"
  },

  {
    question: "Which part contains ovules?",
    options: ["Ovary", "Petal", "Anther", "Sepal"],
    answer: "Ovary"
  },

  {
    question: "Which part develops into a seed?",
    options: ["Ovule", "Style", "Filament", "Petal"],
    answer: "Ovule"
  }

];

let currentQuestion = 0;
let examScore = 0;

function updateExamProgress() {

  const totalQuestions =
    examQuestions.length;

  const progressPercent =
    ((currentQuestion + 1) /
      totalQuestions) * 100;

  document.getElementById(
    "examProgressFill"
  ).style.width =
    `${progressPercent}%`;

  document.getElementById(
    "examProgressText"
  ).textContent =
    `Question ${currentQuestion + 1} of ${totalQuestions}`;

}


function loadQuestion() {

  document.getElementById(
    "nextQuestionBtn"
  ).style.display = "none";

  const prevBtn =
    document.getElementById("prevQuestionBtn");

  if (currentQuestion === 0) {

    prevBtn.style.display = "none";

  } else {

    prevBtn.style.display = "inline-block";

  }

  updateExamProgress();

  const q =
    examQuestions[currentQuestion];

  document.getElementById(
    "examQuestion"
  ).textContent = q.question;

  const optionsContainer =
    document.getElementById("examOptions");

  optionsContainer.innerHTML = "";

  const shuffledOptions =
  [...q.options].sort(
    () => Math.random() - 0.5
  );

shuffledOptions.forEach(option => {

  const btn =
    document.createElement("button");

  btn.textContent = option;

  btn.className = "exam-option";

  btn.addEventListener("click", () => {

    document.getElementById(
      "nextQuestionBtn"
    ).style.display = "inline-block";

    const feedback =
      document.getElementById("examFeedback");

    if (option === q.answer) {

      examScore++;

      playSound(successSound);

      btn.classList.add("correct");

      feedback.textContent =
        "✅ Correct Answer!";

      feedback.className =
        "feedback-correct";

    } else {

      playSound(errorSound);

      btn.classList.add("incorrect");

      feedback.textContent =
        `❌ Wrong! Correct answer: ${q.answer}`;

      feedback.className =
        "feedback-incorrect";

    }

    document
      .querySelectorAll(".exam-option")
      .forEach(b => {
        b.disabled = true;
      });

  });

  optionsContainer.appendChild(btn);

}); // نهاية forEach

} // نهاية loadQuestion

  document
    .querySelectorAll(".exam-option")
    .forEach(b => {
      b.disabled = true;
    });


// ============================================
// INITIALIZATION
// ============================================

function init() {
  // Ensure base layer is visible
  if (baseLayer) baseLayer.style.opacity = "1";

  // Create connector lines
  createConnectorLines();

  // Event listeners
  setupEventListeners();

  // Calculate initial positions
  updatePositions();

  // Update on resize
  window.addEventListener(
    "resize",
    debounce(updatePositions, 100)
  );

  // Update on scroll
  window.addEventListener(
    "scroll",
    debounce(updatePositions, 20)
  );

  console.log("Flower Parts Explorer ready");
}
// ============================================
// POSITION CALCULATION
// ============================================

function updatePositions() {
  // Get flower container rect (for flower part positions)
  flowerRect = flowerContainer.getBoundingClientRect();
  
  // Get connector layer rect (for SVG coordinate conversion - spans entire main-grid)
  connectorLayerRect = connectorLayer.getBoundingClientRect();

  // Calculate label positions for all buttons
  allPartButtons.forEach(btn => {
    const part = btn.dataset.part;
    const rect = btn.getBoundingClientRect();

    // Center of the label button
    labelPositions[part] = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  });

  // Update connector lines
  updateConnectorLines();
}

function getFlowerPartScreenPosition(part) {

  const challengeFlower =
    document.querySelector(".challenge-flower");

  const targetFlower =
    challengeFlower &&
    !document.getElementById("level2").hidden
      ? challengeFlower
      : flowerContainer;

  if (!targetFlower) return null;

  const rect =
    targetFlower.getBoundingClientRect();

  const center =
  !document.getElementById("level2").hidden
    ? CHALLENGE_PART_CENTERS[part]
    : PART_CENTERS[part];

  if (!center) return null;

  const scaleX =
    rect.width / 210;

  const scaleY =
    rect.height / 297;

  const finalX =
    rect.left + center.x * scaleX;

  const finalY =
    rect.top + center.y * scaleY;

  
  return {
    x: finalX,
    y: finalY
  };

}
 

// أضفها هنا ▼
function getLabelStartPoint(part, labelRect) {
  const isLeftPanel = LEFT_PANEL_PARTS.includes(part);

  const offset = START_OFFSET[part] || { x: 0, y: 0 };

  return {
    x: (isLeftPanel ? labelRect.right : labelRect.left) + offset.x,
    y: (labelRect.top + labelRect.height / 2) + offset.y
  };
}


// ============================================
// CONNECTOR LINES
// ============================================

function createConnectorLines() {
  Object.keys(PART_CENTERS).forEach(part => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "connector-line");
    line.setAttribute("data-part", part);
    line.setAttribute("id", `connector-${part}`);
    connectorLinesGroup.appendChild(line);
    connectorLines[part] = line;
  });
}

function updateConnectorLines() {
  // Use connector layer rect for SVG coordinate space (covers entire main-grid)
  const svgRect = connectorLayerRect;
 // console.log("svgRect", svgRect);
  if (!svgRect) return;

  Object.keys(PART_CENTERS).forEach(part => {
    const line = connectorLines[part];
    if (!line) return;

    // Get the label button directly and compute its center in screen coordinates
    const labelBtn = document.querySelector(`.part-btn[data-part="${part}"]`);
    if (!labelBtn) return;
    
    const labelRect = labelBtn.getBoundingClientRect();
    const flowerPos = getFlowerPartScreenPosition(part);

    // Verify label rect has valid dimensions (not collapsed/zero)
    if (!flowerPos || labelRect.width === 0 || labelRect.height === 0) return;

    // Convert to SVG coordinate space (viewBox 0 0 210 297)
    const labelStart = getLabelStartPoint(part, labelRect);
    const svgLabelX = (labelStart.x - svgRect.left) / svgRect.width * 210;
const svgLabelY = (labelStart.y - svgRect.top) / svgRect.height * 297;
const svgFlowerX = (flowerPos.x - svgRect.left) / svgRect.width * 210;
const svgFlowerY = (flowerPos.y - svgRect.top) / svgRect.height * 297;

line.setAttribute("x1", svgLabelX.toFixed(2));
line.setAttribute("y1", svgLabelY.toFixed(2));
line.setAttribute("x2", svgFlowerX.toFixed(2));
line.setAttribute("y2", svgFlowerY.toFixed(2));

});
}


// ============================================
// HIGHLIGHT MANAGEMENT
// ============================================

function highlightPart(part, lock = false) {

  console.trace("highlightPart", part);

  if (isLocked && !lock && activePart !== part) return;

  // Clear previous if different part
  if (activePart && activePart !== part) {
    clearHighlight(activePart);
  }

  activePart = part;
      isLocked = lock;

  // Highlight label button
  const btns = document.querySelectorAll(`.part-btn[data-part="${part}"]`);
  btns.forEach(btn => btn.classList.add("active"));

  // Highlight connector line
  const line = connectorLines[part];
  if (line) line.classList.add("active");

// Show all matching highlight layers
document
  .querySelectorAll(
    `#highlight-${part}, #challenge-highlight-${part}`
  )
  .forEach(layer =>
    layer.classList.add("active")
  );

// Also highlight the part layer itself
const partLayer =
  document.getElementById(`challenge-part-${part}`) ||
  document.getElementById(`part-${part}`);

if (partLayer) partLayer.classList.add("active");

}

function clearHighlight(part) {
  if (!part) return;

  // Remove active from label buttons
  const btns = document.querySelectorAll(
    `.part-btn[data-part="${part}"]`
  );
  btns.forEach(btn =>
    btn.classList.remove("active")
  );

  // Remove active from connector line
  const line = connectorLines[part];
  if (line) line.classList.remove("active");

  // Hide all matching highlight layers
document
  .querySelectorAll(
    `#highlight-${part},
     #challenge-highlight-${part}`
  )
  .forEach(layer => {
    layer.classList.remove("active");
  });

  // Remove active from part layer
  const partLayer =
    document.getElementById(`challenge-part-${part}`) ||
    document.getElementById(`part-${part}`);

  if (partLayer) {
    partLayer.classList.remove("active");
  }

  if (activePart === part) {
    activePart = null;
    isLocked = false;
  }
}

/* أضف هذه الدالة هنا بالضبط */
function clearAllHighlights() {

  Object.keys(PART_CENTERS).forEach(part => {
    clearHighlight(part);
  });

  activePart = null;
  isLocked = false;

}


function showPartHint(part, x, y) {

  const tooltip =
    document.getElementById(
      "partTooltip"
    );

  if (!tooltip) return;

  tooltip.textContent =
    PART_HINTS[part] || "";

  tooltip.style.left =
    `${x + 15}px`;

  tooltip.style.top =
    `${y + 15}px`;

  tooltip.classList.add("show");

}

function hidePartHint() {

  document
    .getElementById("partTooltip")
    ?.classList.remove("show");

}


function createChallengeLines() {

  const group =
    document.getElementById(
      "challengeConnectorLines"
    );

  if (!group) return;

  const svg =
    document.getElementById(
      "challengeConnectorLayer"
    );

  const grid =
    document.querySelector(
      ".challenge-grid"
    );

  if (svg) {

  svg.removeAttribute("width");
  svg.removeAttribute("height");

  svg.setAttribute(
    "viewBox",
    "0 0 780 600"
  );

}


function hidePartHint() {

  document
    .getElementById("partTooltip")
    ?.classList.remove("show");

}
  group.innerHTML = "";

  document
  .querySelectorAll(".answer-slot")
  .forEach(slot => {

    const line =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

    line.classList.add(
      "challenge-line"
    );

    line.dataset.part =
      slot.dataset.part;

    line.addEventListener(
      "mouseenter",
      () => {

        highlightPart(
          line.dataset.part
        );

        line.classList.add(
          "active"
        );

      }
    );

    line.addEventListener(
      "mouseleave",
      () => {

        clearAllHighlights();

        line.classList.remove(
          "active"
        );

      }
    );

    line.setAttribute(
      "stroke",
      "#b0bec5"
    );

    line.setAttribute(
      "stroke-width",
      "3"
    );

    line.setAttribute(
      "stroke-dasharray",
      "8 6"
    );

    line.addEventListener("mouseenter", () => {

  const part = line.dataset.part;

  console.log("HOVER LINE:", part);

  highlightPart(part);

  line.classList.add("active");

  document
    .querySelector(
      `.answer-slot[data-part="${part}"]`
    )
    ?.classList.add("active");

});

line.addEventListener("mouseleave", () => {

  clearAllHighlights();

  line.classList.remove("active");

  document
    .querySelector(
      `.answer-slot[data-part="${line.dataset.part}"]`
    )
    ?.classList.remove("active");

});

group.appendChild(line);

});
}
      
function updateChallengeLines() {

  const grid =
    document.querySelector(
      ".challenge-grid"
    );

  if (!grid) return;

  document
    .querySelectorAll(".answer-slot")
    .forEach(slot => {

      const part =
        slot.dataset.part;

      const line =
        document.querySelector(
          `.challenge-line[data-part="${part}"]`
        );

      if (!line) return;

      const slotRect =
        slot.getBoundingClientRect();

      const gridRect =
        grid.getBoundingClientRect();

      const startOffset =
  CHALLENGE_SLOT_OFFSETS[part] ||
  { x: 0, y: 0 };

const x1 =
  slotRect.left +
  slotRect.width / 2 -
  gridRect.left +
  startOffset.x;

const y1 =
  slotRect.top +
  slotRect.height / 2 -
  gridRect.top +
  startOffset.y;

  

      const flowerPos =
        getFlowerPartScreenPosition(part);

      if (!flowerPos) return;

      const x2 =
        flowerPos.x -
        gridRect.left;

      const y2 =
        flowerPos.y -
        gridRect.top;

console.log(
  part,
  flowerPos,
  x2,
  y2
);      

      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);

      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);

    });

}
// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {

  // Level 1
  allPartButtons.forEach(btn => {

  btn.addEventListener("mouseenter", handleMouseEnter);
  btn.addEventListener("mouseleave", handleMouseLeave);

  btn.addEventListener(
    "mouseenter",
    e => {

      showPartHint(
        btn.dataset.part,
        e.clientX,
        e.clientY
      );

    }
  );

  btn.addEventListener(
    "mouseleave",
    hidePartHint
  );

  btn.addEventListener("click", handleClick);
  btn.addEventListener("keydown", handleKeydown);

});

  // Challenge Mode - Word Bank

  document.querySelectorAll(".drag-word").forEach(word => {

    word.addEventListener("dragstart", e => {

        if (word.style.visibility === "hidden") {
            e.preventDefault();
            return;
        }

        draggedWord = word;

        highlightPart(
            word.dataset.part
        );

    });

    word.addEventListener(
        "mouseenter",
        e => {

            showPartHint(
                word.dataset.part,
                e.clientX,
                e.clientY
            );

        }
    );

    word.addEventListener(
        "mousemove",
        e => {

            const tooltip =
                document.getElementById(
                    "partTooltip"
                );

            if (!tooltip) return;

            tooltip.style.left =
                `${e.clientX + 15}px`;

            tooltip.style.top =
                `${e.clientY + 15}px`;

        }
    );

    word.addEventListener(
        "mouseleave",
        hidePartHint
    );

    word.addEventListener(
        "dragend",
        () => {

            clearAllHighlights();

        }
    );

});

  // Challenge Mode - Answer Slots

  document.querySelectorAll(".answer-slot").forEach(slot => {

    slot.addEventListener("mouseenter", () => {

  const part = slot.dataset.part;



  highlightPart(part);

  slot.classList.add("active");

  document
    .querySelector(
      `.challenge-line[data-part="${part}"]`
    )
    ?.classList.add("active");

});

slot.addEventListener("mouseleave", () => {

  clearAllHighlights();

  slot.classList.remove("active");

  document
    .querySelectorAll(".challenge-line")
    .forEach(line =>
      line.classList.remove("active")
    );

});
    slot.addEventListener("dragover", e => {

      e.preventDefault();

    });

    slot.addEventListener("dragenter", () => {

      if (!draggedWord) return;

      highlightPart(
        draggedWord.dataset.part
      );

    });

    slot.addEventListener("drop", e => {

  e.preventDefault();

  if (!draggedWord) return;

  if (slot.dataset.answer) return;

  slot.innerHTML = `
  <span>${draggedWord.textContent}</span>

  <button
    class="audio-btn"
    data-part="${draggedWord.dataset.part}">
    🔊
  </button>
`;

  slot.dataset.answer =
  draggedWord.dataset.part;

partAudio.pause();
partAudio.currentTime = 0;

partAudio.src =
  AUDIO_FILES[
    draggedWord.dataset.part
  ];

partAudio.play().catch(err => {
  console.log("Audio error:", err);
});

slot.classList.add("filled");

slot.classList.add("success");


setTimeout(() => {
  slot.classList.remove("success");
}, 400);

setTimeout(() => {
  slot.classList.remove("success");
}, 400);

draggedWord.style.visibility =
  "hidden";

clearAllHighlights();

draggedWord = null;

});

   slot.addEventListener("drop", e => {

  e.preventDefault();

  if (!draggedWord) return;

  if (slot.dataset.answer) return;

  slot.innerHTML = `
    <span>${draggedWord.textContent}</span>

    <button
      class="audio-btn"
      data-part="${draggedWord.dataset.part}">
      🔊
    </button>
  `;

  slot.dataset.answer =
    draggedWord.dataset.part;

  partAudio.pause();
  partAudio.currentTime = 0;

  partAudio.src =
    AUDIO_FILES[
      draggedWord.dataset.part
    ];

  partAudio.play().catch(err => {
    console.log("Audio error:", err);
  });

  slot.classList.add("filled");

  slot.classList.add("success");


setTimeout(() => {
  slot.classList.remove("success");
}, 400);

  setTimeout(() => {
    slot.classList.remove("success");
  }, 400);

  draggedWord.style.visibility =
    "hidden";

  clearAllHighlights();

  updateProgress();

  draggedWord = null;

}); // end drop
}); // end answer-slot forEach

} // end setupEventListeners


function handleMouseEnter(e) {
  if (isLocked) return;

  const part = e.currentTarget.dataset.part;

  if (part) {
    highlightPart(part);
  }
}

function handleMouseLeave(e) {
  if (isLocked) return;
  const part = e.currentTarget.dataset.part;
  if (part) clearHighlight(part);
}

function handleClick(e) {
  const part = e.currentTarget.dataset.part;
  if (!part) return;

  if (activePart === part && isLocked) {
    // Click same locked part -> unlock
    clearAllHighlights();
  } else if (activePart === part) {
    // Click same part -> lock it
    highlightPart(part, true);
  } else {
    // Click different part -> switch to it
    highlightPart(part);
  }
}

function handleKeydown(e) {
  const part = e.currentTarget.dataset.part;
  if (!part) return;

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleClick(e);
  } else if (e.key === "Escape") {
    clearAllHighlights();
    e.currentTarget.blur();
  }
}

function handleOutsideClick(e) {
  if (isLocked) return;

  const isInsideFlower = flowerContainer.contains(e.target);
  const isInsidePanel =
    leftPanel?.contains(e.target) ||
    rightPanel?.contains(e.target) ||
    mobilePanel?.contains(e.target);

  if (!isInsideFlower && !isInsidePanel) {
    clearAllHighlights();
  }
}   // <-- أضف هذا القوس إذا كان مفقودًا

// ============================================
// UTILITIES
// ============================================
// ============================================
// UTILITIES
// ============================================

function debounce(fn, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

// ============================================
// START
// ============================================

function shuffleWordBank() {

  const wordBank =
    document.querySelector(".word-bank");

  if (!wordBank) return;

  const words =
    Array.from(
      wordBank.querySelectorAll(".drag-word")
    );

  for (let i = words.length - 1; i > 0; i--) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [words[i], words[j]] =
      [words[j], words[i]];
  }

  words.forEach(word => {
    wordBank.appendChild(word);
  });

}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

document
  .getElementById("startExamBtn")
  ?.addEventListener("click", () => {

    document.getElementById("level2").hidden = true;

    document.getElementById("level3").hidden = false;

    examQuestions.sort(() => Math.random() - 0.5);

    currentQuestion = 0;

    examScore = 0;

    loadQuestion();

});

// Next Question
document
  document
  .getElementById("nextQuestionBtn")
  ?.addEventListener("click", () => {

    currentQuestion++;

    if (
      currentQuestion >=
      examQuestions.length
    ) {

      document.getElementById("level3").innerHTML = `

<div class="certificate">

  <h1>🏆 Certificate of Excellence</h1>

  <h2>Flower Parts Explorer</h2>

  <p>
    This certificate is proudly awarded for
    successfully completing the Level 3 Exam.
  </p>

  <h3>
    Score:
    ${examScore}/${examQuestions.length}
  </h3>

  <p class="student-name">
    Ahmed Sayed Nasary
  </p>

  <button onclick="window.print()">
    🖨 Print Certificate
  </button>

</div>

`;

      document.getElementById(
        "examOptions"
      ).innerHTML = "";

      document.getElementById(
        "nextQuestionBtn"
      ).style.display = "none";

      document.getElementById(
        "prevQuestionBtn"
      ).style.display = "none";

      return;
    }

    loadQuestion();

});

// Previous Question
document
  .getElementById("prevQuestionBtn")
  ?.addEventListener("click", () => {

    if (currentQuestion > 0) {

      currentQuestion--;

      loadQuestion();

    }

});

const startChallengeBtn =
  document.getElementById("startChallengeBtn");

startChallengeBtn?.addEventListener("click", () => {

  document.getElementById("level1").hidden = true;

  document.getElementById("level2").hidden = false;

  shuffleWordBank();

  createChallengeLines();

  setTimeout(() => {

    updateChallengeLines();

  }, 100);

});
  
document
  .getElementById("backToExploreBtn")
  ?.addEventListener("click", () => {

    document.getElementById("level2").hidden = true;

    document.getElementById("level1").hidden = false;

});

window.addEventListener("load", updatePositions);


document
  .getElementById("checkAnswersBtn")
  ?.addEventListener("click", () => {

    let score = 0;

    document
      .querySelectorAll(".answer-slot")
      .forEach(slot => {

        slot.classList.remove(
          "correct",
          "incorrect"
        );

        const correct =
          slot.dataset.part;

        const answer =
          slot.dataset.answer;

        if (
          answer &&
          answer === correct
        ) {

          slot.classList.add("correct");

          score++;

        } else {

          slot.classList.add("incorrect");

          playSound(errorSound);

        }

      });

    if (score === 8) {

      playSound(completeSound);

      document
        .getElementById("winModal")
        ?.classList.add("show");

    } else {

      alert(`Score: ${score}/8`);

    }

});

      
document
.getElementById("resetAllBtn")
?.addEventListener("click", () => {

  shuffleWordBank();

  

    document
      .querySelectorAll(".answer-slot")
      .forEach(slot => {

        slot.textContent = "";

        delete slot.dataset.answer;

        slot.classList.remove("filled");

        slot.classList.remove(
  "correct",
  "incorrect"
);

      });

    document
      .querySelectorAll(".drag-word")
      .forEach(word => {

        word.style.visibility = "visible";

      });

    clearAllHighlights();

    draggedWord = null;

    console.log("RESET ALL WORKING");

});

document
  .getElementById("resetIncorrectBtn")
  ?.addEventListener("click", () => {

    document
      .querySelectorAll(".answer-slot")
      .forEach(slot => {

        if (
          slot.dataset.answer &&
          slot.dataset.answer !== slot.dataset.part
        ) {

          const word =
            document.querySelector(
              `.drag-word[data-part="${slot.dataset.answer}"]`
            );

          if (word) {
            word.style.visibility = "visible";
          }

          slot.textContent = "";

          delete slot.dataset.answer;

          slot.classList.remove(
            "filled",
            "correct",
            "incorrect"
          );

        }

      });

  });

  document
  .getElementById("downloadExerciseBtn")
  ?.addEventListener("click", () => {

    window.print();

  });

  
  document
  .getElementById("downloadExerciseBtn")
  ?.addEventListener("click", () => {

    console.log("DOWNLOAD CLICKED");

    window.print();

  });



  
  document
  .getElementById("playAgainBtn")
  ?.addEventListener("click", () => {

    document
      .getElementById("winModal")
      ?.classList.remove("show");

    document
      .getElementById("resetAllBtn")
      ?.click();

  });

document
  .getElementById("closeModalBtn")
  ?.addEventListener("click", () => {

    console.log("Close clicked");

    document
      .getElementById("winModal")
      ?.classList.remove("show");

  });
  
Object.values(AUDIO_FILES).forEach(url => {
  const audio = new Audio();
  audio.preload = "auto";
  audio.src = url;
});

const partAudio = new Audio();

document.addEventListener("click", e => {

  const audioBtn =
    e.target.closest(".audio-btn");

  if (!audioBtn) return;

  e.stopPropagation();

  const part =
    audioBtn.dataset.part;

  partAudio.pause();
  partAudio.currentTime = 0;

  partAudio.src =
    AUDIO_FILES[part];

  partAudio.play();

});

document
  .getElementById("backToExploreBtn")
  ?.addEventListener("click", () => {

    document.getElementById("level2").hidden = true;
    document.getElementById("level1").hidden = false;

});

document
  .getElementById("backToChallengeBtn")
  ?.addEventListener("click", () => {

    document.getElementById("level3").hidden = true;
    document.getElementById("level2").hidden = false;

});

