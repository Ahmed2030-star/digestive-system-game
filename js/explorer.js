let image;
let highlightImage;
let explorerGrid;
let connectorLayer;
let connectorLines;
let leftParts;
let rightParts;
let explorerTooltip;
let initialized = false;

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
  button.onmouseenter = event => showPart(part, event);
  button.onmousemove = event => {
    explorerTooltip.style.left = (event.clientX + 15) + "px";
    explorerTooltip.style.top = (event.clientY + 15) + "px";
  };
  button.onmouseleave = reset;
  button.onclick = event => showPart(part, event);
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
  getParts().slice(0, 3).forEach(part => leftParts.appendChild(makeButton(part)));
  getParts().slice(3).forEach(part => rightParts.appendChild(makeButton(part)));
  createConnectorLines();
  window.addEventListener("resize", updateConnectors);
  image.addEventListener("load", updateConnectors);
  highlightImage.addEventListener("load", updateConnectors);
  reset();
}

window.GameExplorer = {
  init,
  reset,
  hideHighlight,
  updateConnectors
};
