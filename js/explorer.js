let image;
let highlightImage;
let explorerGrid;
let connectorLayer;
let connectorLines;
let leftParts;
let rightParts;
let explorerTooltip;
let guidedTourButton;
let guidedTourTimeout = null;
let guidedTourIndex = 0;
let guidedTourRunning = false;
let initialized = false;
const exploredPartIds = new Set();
let explorerProgress;

function getProgressConfig() {
  return window.GAME_CONFIG.explorer.progressTracking;
}

function getProgressStorageKey() {
  return `explorer-progress-${window.GAME_CONFIG.game.id}`;
}

function markPartExplored(partId) {
  if (!getProgressConfig().enabled || !getParts().some(part => part.id === partId)) return;
  if (exploredPartIds.has(partId)) return;
  exploredPartIds.add(partId);
  updateExplorerProgress();
}

function updateExplorerProgress() {
  const progressConfig = getProgressConfig();
  if (!progressConfig.enabled || !explorerProgress) return;
  const exploredCount = exploredPartIds.size;
  const totalParts = getParts().length;
  const progressText = `${progressConfig.label}: ${exploredCount} of ${totalParts} parts`;
  explorerProgress.textContent = exploredCount === totalParts
    ? `${progressText} - ${progressConfig.completedMessage}`
    : progressText;
  document.querySelectorAll(".part-btn").forEach(button => {
    const explored = exploredPartIds.has(button.dataset.part);
    button.classList.toggle("explored", explored);
    button.setAttribute("aria-pressed", String(explored));
    const part = getParts().find(item => item.id === button.dataset.part);
    if (part) button.setAttribute("aria-label", explored ? `${part.name}, explored` : part.name);
  });
  if (progressConfig.persist) {
    localStorage.setItem(getProgressStorageKey(), JSON.stringify([...exploredPartIds]));
  }
}

function resetExplorerProgress() {
  exploredPartIds.clear();
  if (getProgressConfig().persist) localStorage.removeItem(getProgressStorageKey());
  updateExplorerProgress();
}

function restoreExplorerProgress() {
  const progressConfig = getProgressConfig();
  if (!progressConfig.enabled || !progressConfig.persist) return;
  try {
    const savedIds = JSON.parse(localStorage.getItem(getProgressStorageKey()) || "[]");
    if (Array.isArray(savedIds)) {
      savedIds.filter(partId => getParts().some(part => part.id === partId)).forEach(partId => exploredPartIds.add(partId));
    }
  } catch (error) {
    localStorage.removeItem(getProgressStorageKey());
  }
}

function createExplorerProgress() {
  const progressConfig = getProgressConfig();
  if (!progressConfig.enabled) return;
  explorerProgress = document.createElement("p");
  explorerProgress.className = "explorer-progress";
  explorerProgress.id = "explorerProgress";
  explorerProgress.setAttribute("role", "status");
  explorerProgress.setAttribute("aria-live", "polite");
  document.getElementById("level1").insertBefore(explorerProgress, explorerGrid);
}

function getParts() {
  return window.GAME_CONFIG.parts;
}

function setActiveConnector(id) {
  document.querySelectorAll(".connector-line").forEach(line =>
    line.classList.toggle("active", line.dataset.part === id)
  );
}

function showExplorerHighlight(partId) {
  if (document.getElementById("level1").hidden) return;
  const source = getParts().find(part => part.id === partId)?.explorerHighlight;
  if (!source || !highlightImage) return;
  highlightImage.src = source;
  highlightImage.classList.add("active");
}

function hideHighlight() {
  if (!highlightImage) return;
  highlightImage.classList.remove("active");
  highlightImage.removeAttribute("src");
  highlightImage.removeAttribute("alt");
}

function showPart(part, event) {
  if (document.getElementById("level1").hidden) return;
  showExplorerHighlight(part.id);
  setActiveConnector(part.id);
  document.querySelectorAll(".part-btn").forEach(button =>
    button.classList.toggle("active", button.dataset.part === part.id)
  );
  if (event) {
    explorerTooltip.textContent = part.hint;
    explorerTooltip.style.left = (event.clientX + 15) + "px";
    explorerTooltip.style.top = (event.clientY + 15) + "px";
    explorerTooltip.classList.add("show");
  }
}

function updateGuidedTourButton() {
  const labels = window.GAME_CONFIG.ui.explorer.guidedTour;
  if (!guidedTourButton) return;
  guidedTourButton.textContent = guidedTourRunning ? labels.stop : labels.start;
  guidedTourButton.setAttribute("aria-label", guidedTourRunning ? labels.stopAriaLabel : labels.startAriaLabel);
  guidedTourButton.setAttribute("aria-pressed", String(guidedTourRunning));
}

function stopGuidedTour() {
  if (guidedTourTimeout !== null) {
    clearTimeout(guidedTourTimeout);
    guidedTourTimeout = null;
  }
  if (guidedTourRunning) GameAudio.stopExplorer();
  guidedTourRunning = false;
  updateGuidedTourButton();
}

function showGuidedTourPart() {
  if (!guidedTourRunning || document.getElementById("level1").hidden) {
    stopGuidedTour();
    return;
  }

  const part = getParts()[guidedTourIndex];
  if (!part) {
    stopGuidedTour();
    return;
  }

  markPartExplored(part.id);
  showPart(part);
  const button = document.querySelector(`.part-btn[data-part="${part.id}"]`);
  explorerTooltip.textContent = part.hint;
  if (button) {
    const buttonRect = button.getBoundingClientRect();
    explorerTooltip.style.left = (buttonRect.right + 15) + "px";
    explorerTooltip.style.top = (buttonRect.top + buttonRect.height / 2) + "px";
  }
  explorerTooltip.classList.add("show");
  if (window.GAME_CONFIG.explorer.guidedTour.playAudio) GameAudio.playExplorer(part.id);
  guidedTourTimeout = setTimeout(() => {
    guidedTourIndex++;
    if (guidedTourIndex >= getParts().length) {
      stopGuidedTour();
      return;
    }
    showGuidedTourPart();
  }, Math.max(0, window.GAME_CONFIG.explorer.guidedTour.durationPerPart));
}

function startGuidedTour() {
  if (!window.GAME_CONFIG.explorer.guidedTour.enabled || document.getElementById("level1").hidden) return;
  stopGuidedTour();
  guidedTourIndex = 0;
  guidedTourRunning = true;
  updateGuidedTourButton();
  showGuidedTourPart();
}

function createGuidedTourButton() {
  guidedTourButton = document.createElement("button");
  guidedTourButton.type = "button";
  guidedTourButton.className = "primary-btn guided-tour-btn";
  guidedTourButton.onclick = () => {
    if (guidedTourRunning) stopGuidedTour();
    else startGuidedTour();
  };
  updateGuidedTourButton();
  document.getElementById("level1").appendChild(guidedTourButton);
}

function reset() {
  const parts = getParts();
  showPart(parts[0]);
  setActiveConnector("");
  explorerTooltip.classList.remove("show");
}

function makeButton(part) {
  const button = document.createElement("button");
  button.className = "part-btn audio-btn";
  button.dataset.part = part.id;
  button.textContent = part.name;
  button.onmouseenter = event => {
    stopGuidedTour();
    showPart(part, event);
  };
  button.onmousemove = event => {
    explorerTooltip.style.left = (event.clientX + 15) + "px";
    explorerTooltip.style.top = (event.clientY + 15) + "px";
  };
  button.onmouseleave = reset;
  button.onclick = event => {
    stopGuidedTour();
    markPartExplored(part.id);
    showPart(part, event);
  };
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", part.name);
  return button;
}

function createConnectorLines() {
  connectorLines.innerHTML = "";
  getParts().forEach(part => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add("connector-line");
    line.dataset.part = part.id;
    connectorLines.appendChild(line);
  });
  updateConnectors();
}

function updateConnectors() {
  if (!explorerGrid || !connectorLayer || !image) return;
  const gridRect = explorerGrid.getBoundingClientRect();
  const imageRect = image.getBoundingClientRect();
  connectorLayer.setAttribute("viewBox", `0 0 ${gridRect.width} ${gridRect.height}`);
  getParts().forEach(part => {
    const button = document.querySelector(`.parts-panel .part-btn[data-part="${part.id}"]`);
    const line = connectorLines.querySelector(`.connector-line[data-part="${part.id}"]`);
    if (!button || !line) return;
    const buttonRect = button.getBoundingClientRect();
    const isLeft = button.closest("#leftParts") !== null;
    const point = part.explorerConnectorTarget;
    const x1 = (isLeft ? buttonRect.right : buttonRect.left) - gridRect.left;
    const y1 = buttonRect.top + buttonRect.height / 2 - gridRect.top;
    const x2 = imageRect.left - gridRect.left + imageRect.width * point.x / 100;
    const y2 = imageRect.top - gridRect.top + imageRect.height * point.y / 100;
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
  });
}

function init() {
  if (initialized) return;
  initialized = true;
  image = document.getElementById("wholeImage");
  highlightImage = document.getElementById("digestiveHighlight");
  explorerGrid = document.getElementById("explorerGrid");
  connectorLayer = document.getElementById("connectorLayer");
  connectorLines = document.getElementById("connectorLines");
  leftParts = document.getElementById("leftParts");
  rightParts = document.getElementById("rightParts");
  explorerTooltip = document.getElementById("partTooltip");
  leftParts.innerHTML = "";
  rightParts.innerHTML = "";
  createExplorerProgress();
  restoreExplorerProgress();
  getParts().slice(0, 3).forEach(part => leftParts.appendChild(makeButton(part)));
  getParts().slice(3).forEach(part => rightParts.appendChild(makeButton(part)));
  updateExplorerProgress();
  if (window.GAME_CONFIG.explorer.guidedTour.enabled) createGuidedTourButton();
  createConnectorLines();
  window.addEventListener("resize", updateConnectors);
  image.addEventListener("load", updateConnectors);
  highlightImage.addEventListener("load", updateConnectors);
  new MutationObserver(() => {
    if (document.getElementById("level1").hidden) stopGuidedTour();
  }).observe(document.getElementById("level1"), {attributes: true, attributeFilter: ["hidden"]});
  reset();
}

window.GameExplorer = {
  init,
  reset,
  startGuidedTour,
  stopGuidedTour,
  hideHighlight,
  updateConnectors
};
