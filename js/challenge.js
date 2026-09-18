(() => {
  let challengeParts;
  let challengeLeftParts;
  let challengeRightParts;
  let wordBank;
  let challengeLeftSlots;
  let challengeRightSlots;
  let challengeFeedback;
  let checkAnswersBtn;
  let resetIncorrectBtn;
  let resetAllBtn;
  let startExamBtn;
  let backToExploreBtn;
  let challengeLayout;
  let challengeImage;
  let challengeHighlightImage;
  let challengeConnectorLayer;
  let challengeConnectorLines;
  let challengeTooltip;
  let hintButton;
  let hintsConfig;
  let hintTimeoutId = null;
  let challengeDragging = false;
  let selectedPartId = null;
  let winModal;
  let initialized = false;

  function clearChallengeHint() {
    if (hintTimeoutId !== null) {
      clearTimeout(hintTimeoutId);
      hintTimeoutId = null;
    }
    hideHighlight();
    setChallengeConnector("");
    challengeTooltip.classList.remove("show");
    if (selectedPartId) {
      challengeFeedback.textContent = window.GAME_CONFIG.ui.challenge.tapToPlaceInstruction;
    }
  }

  function showChallengeHint(partId) {
    const part = challengeParts.find(item => item.id === partId);
    if (!part) return;
    clearChallengeHint();
    showChallengeHighlight(partId);
    setChallengeConnector(partId);
    challengeTooltip.textContent = part.hint;
    challengeTooltip.style.left = "50%";
    challengeTooltip.style.top = "12px";
    challengeTooltip.classList.add("show");
    challengeFeedback.textContent = part.hint;
    if (hintsConfig.playAudio) GameAudio.playChallenge(partId);
    hintTimeoutId = setTimeout(clearChallengeHint, hintsConfig.duration);
  }

  function showChallengeHighlight(partId) {
    if (document.getElementById("level2").hidden) return;
    const source = challengeParts.find(part => part.id === partId)?.challengeHighlight;
    if (!source || !challengeHighlightImage) return;
    challengeHighlightImage.src = source;
    challengeHighlightImage.classList.add("active");
  }

  function hideHighlight() {
    if (!challengeHighlightImage) return;
    challengeHighlightImage.classList.remove("active");
    challengeHighlightImage.removeAttribute("src");
    challengeHighlightImage.removeAttribute("alt");
  }

  function setChallengeConnector(id) {
    challengeConnectorLines.querySelectorAll(".challenge-connector-line").forEach(line =>
      line.classList.toggle("active", line.dataset.part === id)
    );
  }

  function clearChallengeDragState() {
    challengeDragging = false;
    clearChallengeHint();
    hideHighlight();
    setChallengeConnector("");
    document.querySelectorAll("#level2 .answer-slot").forEach(slot => slot.classList.remove("active"));
    challengeTooltip.classList.remove("show");
  }

  function cleanup() {
    clearChallengeHint();
    clearChallengeDragState();
    GameAudio.stopChallenge();
    GameAudio.stopChallengeCompletion();
    hideHighlight();
    setChallengeConnector("");
    document.querySelectorAll("#level2 .answer-slot").forEach(slot => {
      slot.classList.remove("active");
    });
  }

  function updateConnectors() {
    if (!challengeLayout || !challengeImage || !challengeConnectorLayer) return;
    const layoutRect = challengeLayout.getBoundingClientRect();
    const imageRect = challengeImage.getBoundingClientRect();
    challengeConnectorLayer.setAttribute("viewBox", `0 0 ${layoutRect.width} ${layoutRect.height}`);
    challengeParts.forEach(part => {
      const slot = document.querySelector(`.challenge-slots .answer-slot[data-part="${part.id}"]`);
      const line = challengeConnectorLines.querySelector(`.challenge-connector-line[data-part="${part.id}"]`);
      const target = part.challengeConnectorTarget;
      if (!slot || !line || !target) return;
      const slotRect = slot.getBoundingClientRect();
      const isLeft = slot.closest(".challenge-slots-left") !== null;
      line.setAttribute("x1", (isLeft ? slotRect.right : slotRect.left) - layoutRect.left);
      line.setAttribute("y1", slotRect.top + slotRect.height / 2 - layoutRect.top);
      line.setAttribute("x2", imageRect.left - layoutRect.left + imageRect.width * target.x / 100);
      line.setAttribute("y2", imageRect.top - layoutRect.top + imageRect.height * target.y / 100);
    });
  }

  function getSlotPartId(slot) {
    return slot.dataset.answer || "";
  }

  function clearChallengeSlot(slot) {
    const number = slot.querySelector("strong")?.textContent || "";
    slot.innerHTML = `<strong>${number}</strong><span>${window.GAME_CONFIG.ui.challenge.emptySlot}</span>`;
    delete slot.dataset.answer;
    slot.classList.remove("filled", "correct", "incorrect", "active", "success", "error");
  }

  function returnPartToWordBank(partId) {
    if (!partId) return;
    document.querySelector(`#level2 .drag-word[data-part="${partId}"]`)?.classList.remove("used");
  }

  function clearSelectedPart() {
    clearChallengeHint();
    selectedPartId = null;
    wordBank?.querySelectorAll(".drag-word").forEach(word => {
      word.classList.remove("selected-for-placement");
      word.setAttribute("aria-pressed", "false");
    });
    if (challengeFeedback) challengeFeedback.textContent = window.GAME_CONFIG.ui.challenge.instructions;
  }

  function selectPartForPlacement(partId, word) {
    clearChallengeHint();
    if (selectedPartId === partId) {
      clearSelectedPart();
      return;
    }
    wordBank.querySelectorAll(".drag-word").forEach(item => {
      item.classList.remove("selected-for-placement");
      item.setAttribute("aria-pressed", "false");
    });
    selectedPartId = partId;
    word.classList.add("selected-for-placement");
    word.setAttribute("aria-pressed", "true");
    challengeFeedback.textContent = window.GAME_CONFIG.ui.challenge.tapToPlaceInstruction;
  }

  function placePartInSlot(partId, slot) {
    const item = challengeParts.find(part => part.id === partId);
    if (!item) return;

    const currentPartId = getSlotPartId(slot);
    if (currentPartId === partId) return;

    const previousSlot = document.querySelector(`#level2 .answer-slot[data-answer="${partId}"]`);
    if (previousSlot && previousSlot !== slot) clearChallengeSlot(previousSlot);

    if (currentPartId) returnPartToWordBank(currentPartId);
    clearChallengeSlot(slot);
    slot.dataset.answer = partId;
    slot.innerHTML = `<strong>${slot.querySelector("strong")?.textContent || ""}</strong><span class="slot-answer-text">${item.name}</span>`;
    const audioButton = document.createElement("button");
    audioButton.type = "button";
    audioButton.className = "audio-btn";
    audioButton.dataset.part = partId;
    audioButton.setAttribute("aria-label", `Play ${item.name} audio`);
    audioButton.textContent = "🔊";
    slot.appendChild(audioButton);
    document.querySelector(`#level2 .drag-word[data-part="${partId}"]`)?.classList.add("used");
  }

  function placeSelectedPartInSlot(slot) {
    if (!selectedPartId) return;
    placePartInSlot(selectedPartId, slot);
    clearSelectedPart();
  }

  function makeChallengeSlot(part, index) {
    const slot = document.createElement("div");
    slot.className = "answer-slot";
    slot.dataset.part = part.id;
    slot.tabIndex = 0;
    slot.setAttribute("role", "button");
    slot.setAttribute("aria-label", `Answer slot ${index + 1}`);
    slot.innerHTML = `<strong>${index + 1}</strong><span>${window.GAME_CONFIG.ui.challenge.emptySlot}</span>`;
    slot.ondragover = event => event.preventDefault();
    slot.ondragenter = () => {
      slot.classList.add("active");
      setChallengeConnector(part.id);
      showChallengeHighlight(part.id);
    };
    slot.onmouseenter = () => {
      slot.classList.add("active");
      setChallengeConnector(part.id);
      showChallengeHighlight(part.id);
    };
    slot.onmouseleave = () => {
      slot.classList.remove("active");
      setChallengeConnector("");
      if (!challengeDragging) hideHighlight();
    };
    slot.ondrop = event => {
      event.preventDefault();
      const id = event.dataTransfer.getData("text/plain");
      placePartInSlot(id, slot);
      clearSelectedPart();
      clearChallengeDragState();
    };
    slot.onclick = event => {
      if (event.target.closest(".audio-btn")) return;
      placeSelectedPartInSlot(slot);
    };
    slot.onkeydown = event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      placeSelectedPartInSlot(slot);
    };
    return slot;
  }

  function buildChallenge() {
    clearChallengeHint();
    clearSelectedPart();
    wordBank.innerHTML = "";
    challengeLeftSlots.innerHTML = "";
    challengeRightSlots.innerHTML = "";
    challengeFeedback.textContent = "";
    setChallengeConnector("");
    challengeConnectorLines.innerHTML = "";
    challengeParts.forEach(part => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.classList.add("challenge-connector-line");
      line.dataset.part = part.id;
      challengeConnectorLines.appendChild(line);
    });
    [...challengeParts].sort(() => Math.random() - 0.5).forEach(part => {
      const word = document.createElement("div");
      word.className = "drag-word";
      word.draggable = true;
      word.tabIndex = 0;
      word.setAttribute("role", "button");
      word.setAttribute("aria-pressed", "false");
      word.dataset.part = part.id;
      word.textContent = part.name;
      word.onmouseenter = event => {
        challengeTooltip.textContent = part.hint;
        challengeTooltip.style.left = (event.clientX + 15) + "px";
        challengeTooltip.style.top = (event.clientY + 15) + "px";
        challengeTooltip.classList.add("show");
      };
      word.onmousemove = event => {
        challengeTooltip.style.left = (event.clientX + 15) + "px";
        challengeTooltip.style.top = (event.clientY + 15) + "px";
      };
      word.onmouseleave = () => challengeTooltip.classList.remove("show");
      word.ondragstart = event => {
        clearChallengeHint();
        challengeDragging = true;
        event.dataTransfer.setData("text/plain", part.id);
        challengeTooltip.classList.remove("show");
        showChallengeHighlight(part.id);
        setChallengeConnector(part.id);
      };
      word.ondragend = clearChallengeDragState;
      word.onclick = () => selectPartForPlacement(part.id, word);
      word.onkeydown = event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectPartForPlacement(part.id, word);
      };
      wordBank.appendChild(word);
    });
    challengeLeftParts.forEach((part, index) => challengeLeftSlots.appendChild(makeChallengeSlot(part, index)));
    challengeRightParts.forEach((part, index) => challengeRightSlots.appendChild(makeChallengeSlot(part, index + 3)));
    requestAnimationFrame(updateConnectors);
  }

  function init() {
    if (initialized) return;
    initialized = true;
    const config = window.GAME_CONFIG;
    challengeParts = config.challenge.leftParts.concat(config.challenge.rightParts).map(id => config.parts.find(part => part.id === id));
    challengeLeftParts = config.challenge.leftParts.map(id => config.parts.find(part => part.id === id));
    challengeRightParts = config.challenge.rightParts.map(id => config.parts.find(part => part.id === id));
    wordBank = document.getElementById("wordBank");
    challengeLeftSlots = document.getElementById("challengeLeftSlots");
    challengeRightSlots = document.getElementById("challengeRightSlots");
    challengeFeedback = document.getElementById("challengeFeedback");
    checkAnswersBtn = document.getElementById("checkAnswersBtn");
    resetIncorrectBtn = document.getElementById("resetIncorrectBtn");
    resetAllBtn = document.getElementById("resetAllBtn");
    startExamBtn = document.getElementById("startExamBtn");
    backToExploreBtn = document.getElementById("backToExploreBtn");
    challengeLayout = document.querySelector(".challenge-layout");
    challengeImage = document.getElementById("challengeImage");
    challengeHighlightImage = document.getElementById("challengeHighlightImage");
    challengeHighlightImage.classList.add("challenge-digestive-highlight");
    challengeConnectorLayer = document.getElementById("challengeConnectorLayer");
    challengeConnectorLines = document.getElementById("challengeConnectorLines");
    challengeTooltip = document.getElementById("partTooltip");
    winModal = document.getElementById("winModal");
    hintsConfig = config.challenge.hints;
    if (hintsConfig.enabled) {
      const hintControls = document.createElement("div");
      hintControls.className = "challenge-hint-controls";
      hintButton = document.createElement("button");
      hintButton.type = "button";
      hintButton.className = "challenge-hint-btn";
      hintButton.setAttribute("aria-label", hintsConfig.buttonText);
      hintButton.textContent = hintsConfig.buttonText;
      hintButton.onclick = () => {
        if (!selectedPartId) {
          challengeFeedback.textContent = hintsConfig.selectFirstMessage;
          return;
        }
        showChallengeHint(selectedPartId);
      };
      hintControls.append(hintButton);
      document.querySelector("#level2 > p")?.after(hintControls);
    }

    document.addEventListener("click", event => {
      const button = event.target.closest("#level2 .answer-slot .audio-btn");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      GameAudio.playChallenge(button.dataset.part);
    });
    resetIncorrectBtn.onclick = () => {
      document.querySelectorAll("#level2 .answer-slot").forEach(slot => {
        const wrongId = getSlotPartId(slot);
        if (!wrongId || wrongId === slot.dataset.part) return;
        returnPartToWordBank(wrongId);
        clearChallengeSlot(slot);
      });
      clearChallengeDragState();
      challengeFeedback.textContent = config.ui.challenge.incorrectResetMessage;
    };
    resetAllBtn.onclick = buildChallenge;
    checkAnswersBtn.onclick = () => {
      let challengeScore = 0;
      document.querySelectorAll("#level2 .answer-slot").forEach(slot => {
        const correct = slot.dataset.answer === slot.dataset.part;
        slot.classList.toggle("correct", correct);
        slot.classList.toggle("incorrect", !correct);
        if (correct) challengeScore++;
      });
      challengeFeedback.textContent = config.ui.challenge.scoreFormat.replace("{score}", challengeScore).replace("{total}", challengeParts.length);
      const score = challengeScore;
      if (score === 6) {
        clearChallengeHint();
        GameAudio.playChallengeCompletion();
        document.getElementById("winModal")?.classList.add("show");
      }
    };
    document.getElementById("closeModalBtn")?.addEventListener("click", () => {
      clearChallengeHint();
      GameAudio.stopChallengeCompletion();
      winModal?.classList.remove("show");
    });
    document.getElementById("playAgainBtn")?.addEventListener("click", () => {
      clearChallengeHint();
      winModal?.classList.remove("show");
      resetAllBtn.click();
    });
    window.addEventListener("resize", updateConnectors);
    window.addEventListener("scroll", updateConnectors, true);
    challengeImage.addEventListener("load", updateConnectors);
  }

  function start() {
    buildChallenge();
  }

  window.GameChallenge = {
    init,
    start,
    resetAll: buildChallenge,
    hideHighlight,
    updateConnectors,
    cleanup
  };
})();
