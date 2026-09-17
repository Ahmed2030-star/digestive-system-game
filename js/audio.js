const explorerAudioPlayer = new Audio();
const challengeAudioPlayer = new Audio();
const challengeCompletionSound = new Audio(
  window.GAME_CONFIG.challenge.completionSound
);
const examSuccessSound = new Audio(
  window.GAME_CONFIG.exam.successSound
);
const examWrongSound = new Audio(
  window.GAME_CONFIG.exam.wrongSound
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

function playExplorerAudio(partId) {
  const source = window.GAME_CONFIG.parts.find(part => part.id === partId)?.explorerAudio;
  if (!source) return;
  stopChallengeAudio();
  explorerAudioPlayer.pause();
  explorerAudioPlayer.currentTime = 0;
  explorerAudioPlayer.src = source;
  explorerAudioPlayer.play().catch(error => {
    console.error("Explorer audio error:", error);
  });
}

function playChallengeAudio(partId) {
  const source = window.GAME_CONFIG.parts.find(part => part.id === partId)?.challengeAudio;
  if (!source) return;
  stopExplorerAudio();
  challengeAudioPlayer.pause();
  challengeAudioPlayer.currentTime = 0;
  challengeAudioPlayer.src = source;
  challengeAudioPlayer.play().catch(error => {
    console.error("Challenge audio error:", error);
  });
}

function playChallengeCompletion() {
  challengeCompletionSound.pause();
  challengeCompletionSound.currentTime = 0;
  challengeCompletionSound.muted = false;
  challengeCompletionSound.volume = 1;
  challengeCompletionSound.play().catch(error => {
    console.error("Completion sound error:", error);
  });
}

function playExamSuccess() {
  examWrongSound.pause();
  examWrongSound.currentTime = 0;
  examSuccessSound.pause();
  examSuccessSound.currentTime = 0;
  examSuccessSound.muted = false;
  examSuccessSound.volume = 1;
  examSuccessSound.play().catch(error => {
    console.error("Success sound error:", error);
  });
}

function playExamWrong() {
  examSuccessSound.pause();
  examSuccessSound.currentTime = 0;
  examWrongSound.pause();
  examWrongSound.currentTime = 0;
  examWrongSound.muted = false;
  examWrongSound.volume = 1;
  examWrongSound.play().catch(error => {
    console.error("Wrong sound error:", error);
  });
}

window.GameAudio = {
  playExplorer: playExplorerAudio,
  playChallenge: playChallengeAudio,
  playChallengeCompletion,
  playExamSuccess,
  playExamWrong,
  stopExplorer: stopExplorerAudio,
  stopChallenge: stopChallengeAudio,
  stopChallengeCompletion: stopChallengeCompletionSound,
  stopExam: stopExamSounds
};
