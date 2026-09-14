/**
 * Flower Parts Explorer - Interactive Science Learning Hub
 * Connects labels around the flower with SVG connector lines
 * Highlights parts on hover with smooth animations
 */

console.log("Flower Parts Explorer initialized");

// ============================================
// CONFIGURATION
// ============================================

// Flower part center coordinates in SVG viewBox (0 0 210 297)
// These are approximate centers for each flower part
const PART_CENTERS = {
  anther:    { x: 135, y:  95 }, // Top center - anthers
  filament:  { x: 105, y: 115 }, // Below anther - filaments
  stigma:    { x: 105, y:  55 }, // Very top - stigma
  style:     { x: 105, y:  90 }, // Below stigma - style
  ovary:     { x: 105, y: 165 }, // Lower center - ovary
  ovule:     { x: 105, y: 185 }, // Inside ovary - ovules
  sepal:     { x: 105, y: 210 }, // Below petals - sepals
  petal:     { x: 105, y: 140 }, // Mid-upper - petals
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

// Desktop left/right panel assignment
const LEFT_PANEL_PARTS = ["anther", "filament", "sepal", "petal"];
const RIGHT_PANEL_PARTS = ["stigma", "style", "ovary", "ovule"];

// ============================================
// LINE START/END CONTROL
// ============================================
// Controls exactly where each connector line begins (at the label button)
// and ends (at the flower part). Adjust these values to fine-tune the lines.

// Where on the label button the line starts.
// "edge"   -> starts at the button's inner edge (facing the flower), offset by edgeInset
// "center" -> starts at the button's center
// You can also nudge the point with offsetX / offsetY (in screen pixels).
const START_ANCHOR = {
  anther:   { mode: "edge", edgeInset: 0, offsetX: 0, offsetY: 0 },
  filament: { mode: "edge", edgeInset: 0, offsetX: 0, offsetY: 0 },
  sepal:    { mode: "edge", edgeInset: 0, offsetX: 0, offsetY: 0 },
  petal:    { mode: "edge", edgeInset: 0, offsetX: 0, offsetY: 0 },
  stigma:   { mode: "edge", edgeInset: 0, offsetX: 0, offsetY: 0 },
  style:    { mode: "edge", edgeInset: 0, offsetX: 0, offsetY: 0 },
  ovary:    { mode: "edge", edgeInset: 0, offsetX: 0, offsetY: 0 },
  ovule:    { mode: "edge", edgeInset: 0, offsetX: 0, offsetY: 0 },
};

// Fine-tune where each line ends on the flower image, in SVG viewBox units
// (0 0 210 297). These are ADDED on top of PART_CENTERS above, so you don't
// have to touch PART_CENTERS itself when nudging the endpoint.
const END_OFFSET = {
  anther:   { dx: 0, dy: 0 },
  filament: { dx: 0, dy: 0 },
  stigma:   { dx: 0, dy: 0 },
  style:    { dx: 0, dy: 0 },
  ovary:    { dx: 0, dy: 0 },
  ovule:    { dx: 0, dy: 0 },
  sepal:    { dx: 0, dy: 0 },
  petal:    { dx: 0, dy: 0 },
};

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
let debugCircles = {}; // For temporary debug visualization

// ============================================
// INITIALIZATION
// ============================================

function init() {
  // Ensure base layer is visible
  if (baseLayer) baseLayer.style.opacity = "1";

  // Create connector lines (but don't calculate positions yet)
  createConnectorLines();

  // Set up event listeners
  setupEventListeners();

  // Handle resize - will calculate positions after layout is ready
  window.addEventListener("resize", debounce(updatePositions, 100));

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
  if (!flowerRect) return null;

  const center = PART_CENTERS[part];
  if (!center) return null;

  const offset = END_OFFSET[part] || { dx: 0, dy: 0 };

  // Convert from SVG viewBox (0-210, 0-297) to screen coordinates
  const scaleX = flowerRect.width / 210;
  const scaleY = flowerRect.height / 297;

  return {
    x: flowerRect.left + (center.x + offset.dx) * scaleX,
    y: flowerRect.top + (center.y + offset.dy) * scaleY,
  };
}

// Given a label button's rect and its START_ANCHOR config, compute the
// screen-space (x, y) point where its connector line should start.
function getLabelStartPoint(part, labelRect) {
  const anchor = START_ANCHOR[part] || { mode: "center", edgeInset: 0, offsetX: 0, offsetY: 0 };
  const isLeftPanel = LEFT_PANEL_PARTS.includes(part);

  let x, y;

  if (anchor.mode === "edge") {
    // Left-panel buttons point toward the flower on their RIGHT edge.
    // Right-panel buttons point toward the flower on their LEFT edge.
    x = isLeftPanel
      ? labelRect.right - anchor.edgeInset
      : labelRect.left + anchor.edgeInset;
    y = labelRect.top + labelRect.height / 2;
  } else {
    // "center" mode
    x = labelRect.left + labelRect.width / 2;
    y = labelRect.top + labelRect.height / 2;
  }

  return {
    x: x + (anchor.offsetX || 0),
    y: y + (anchor.offsetY || 0),
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
  console.log("svgRect", svgRect);
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
    // Start point comes from START_ANCHOR (edge or center of the button),
    // end point comes from PART_CENTERS + END_OFFSET.
    const labelStart = getLabelStartPoint(part, labelRect);

    const svgLabelX = (labelStart.x - svgRect.left) / svgRect.width * 210;
    const svgLabelY = (labelStart.y - svgRect.top) / svgRect.height * 297;
    const svgFlowerX = (flowerPos.x - svgRect.left) / svgRect.width * 210;
    const svgFlowerY = (flowerPos.y - svgRect.top) / svgRect.height * 297;

    // Debug logging - one part only for verification
    if (part === "anther") {
      console.log(`[${part}] labelRect:`, {
        left: labelRect.left.toFixed(2),
        top: labelRect.top.toFixed(2),
        width: labelRect.width.toFixed(2),
        height: labelRect.height.toFixed(2)
      }, `svgRect:`, {
        left: svgRect.left.toFixed(2),
        top: svgRect.top.toFixed(2)
      }, `x1: ${svgLabelX.toFixed(2)}, y1: ${svgLabelY.toFixed(2)}`);
    }

    line.setAttribute("x1", svgLabelX.toFixed(2));
    line.setAttribute("y1", svgLabelY.toFixed(2));
    line.setAttribute("x2", svgFlowerX.toFixed(2));
    line.setAttribute("y2", svgFlowerY.toFixed(2));

    // Debug circles: green = start (label), red = end (flower part)
    createDebugCircles(part, svgLabelX, svgLabelY, svgFlowerX, svgFlowerY);
  });
}

function createDebugCircles(part, x1, y1, x2, y2) {
  const ns = "http://www.w3.org/2000/svg";
  
  // Create or update start circle (green)
  let startCircle = debugCircles[`${part}-start`];
  if (!startCircle) {
    startCircle = document.createElementNS(ns, "circle");
    startCircle.setAttribute("r", "4");
    startCircle.setAttribute("fill", "green");
    startCircle.setAttribute("stroke", "none");
    connectorLinesGroup.appendChild(startCircle);
    debugCircles[`${part}-start`] = startCircle;
  }
  startCircle.setAttribute("cx", x1);
  startCircle.setAttribute("cy", y1);

  // Create or update end circle (red)
  let endCircle = debugCircles[`${part}-end`];
  if (!endCircle) {
    endCircle = document.createElementNS(ns, "circle");
    endCircle.setAttribute("r", "4");
    endCircle.setAttribute("fill", "red");
    endCircle.setAttribute("stroke", "none");
    connectorLinesGroup.appendChild(endCircle);
    debugCircles[`${part}-end`] = endCircle;
  }
  endCircle.setAttribute("cx", x2);
  endCircle.setAttribute("cy", y2);
}

function removeDebugCircles() {
  Object.values(debugCircles).forEach(circle => circle.remove());
  debugCircles = {};
}

// ============================================
// HIGHLIGHT MANAGEMENT
// ============================================

function highlightPart(part, lock = false) {
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

  // Show highlight layer
  const highlightLayer = document.getElementById(`highlight-${part}`);
  if (highlightLayer) highlightLayer.classList.add("active");

  // Also highlight the part layer itself
  const partLayer = document.getElementById(`part-${part}`);
  if (partLayer) partLayer.classList.add("active");
}

function clearHighlight(part) {
  if (!part) return;

  // Remove active from label buttons
  const btns = document.querySelectorAll(`.part-btn[data-part="${part}"]`);
  btns.forEach(btn => btn.classList.remove("active"));

  // Remove active from connector line
  const line = connectorLines[part];
  if (line) line.classList.remove("active");

  // Hide highlight layer
  const highlightLayer = document.getElementById(`highlight-${part}`);
  if (highlightLayer) highlightLayer.classList.remove("active");

  // Remove active from part layer
  const partLayer = document.getElementById(`part-${part}`);
  if (partLayer) partLayer.classList.remove("active");

  if (activePart === part) {
    activePart = null;
    isLocked = false;
  }
}

function clearAllHighlights() {
  Object.keys(PART_CENTERS).forEach(part => clearHighlight(part));
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Mouse enter on any part button
  allPartButtons.forEach(btn => {
    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mouseleave", handleMouseLeave);
    btn.addEventListener("focus", handleMouseEnter);
    btn.addEventListener("blur", handleMouseLeave);
    btn.addEventListener("click", handleClick);
    btn.addEventListener("keydown", handleKeydown);
  });

  // Click outside to clear
  document.addEventListener("click", handleOutsideClick);

  // Escape key to clear
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (activePart || isLocked)) {
      clearAllHighlights();
      // Remove focus from any button
      document.activeElement?.blur?.();
    }
  });
}

function handleMouseEnter(e) {
  if (isLocked) return;
  const part = e.currentTarget.dataset.part;
  if (part) highlightPart(part);
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

  // Check if click is inside flower container or any panel
  const isInsideFlower = flowerContainer.contains(e.target);
  const isInsidePanel = leftPanel?.contains(e.target) ||
                        rightPanel?.contains(e.target) ||
                        mobilePanel?.contains(e.target);

  if (!isInsideFlower && !isInsidePanel) {
    clearAllHighlights();
  }
}

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

// Wait for DOM and images to load for accurate measurements
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Also update positions when images load
window.addEventListener("load", updatePositions);

// Remove debug circles after 10 seconds (for verification)
setTimeout(removeDebugCircles, 10000);