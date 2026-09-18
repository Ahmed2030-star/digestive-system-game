window.GAME_CONFIG = {
  version: "2.0.0",

  game: {
    id: "digestive-system",
    title: "Digestive System Explorer",
    subtitle: "Hover over a part name to highlight it.",
    grade: 4,
    language: "en-US"
  },

  explorer: {
    guidedTour: {
      enabled: true,
      durationPerPart: 3500,
      playAudio: true
    }
  },

  ui: {
    explorer: {
      title: "Digestive System Explorer",
      subtitle: "Hover over a part name to highlight it.",
      startChallenge: "Start Challenge",
      guidedTour: {
        start: "▶ Guided Tour",
        stop: "■ Stop Tour",
        startAriaLabel: "Start guided tour",
        stopAriaLabel: "Stop guided tour"
      }
    },
    challenge: {
      title: "Challenge Mode",
      instructions: "Drag each name to its correct numbered position.",
      emptySlot: "Drop the name here",
      checkAnswers: "Check Answers",
      resetIncorrect: "RESET INCORRECT",
      resetAll: "Reset All",
      startExam: "Start Exam",
      back: "Back",
      incorrectResetMessage: "Incorrect answers have been reset.",
      scoreFormat: "Score: {score}/{total}",
      congratulations: "Congratulations!",
      completionMessage: "You have successfully completed the activity.",
      playAgain: "Play Again",
      close: "Close"
    },
    exam: {
      title: "Digestive System Exam",
      progressFormat: "Question {current} of {total}",
      correctFeedback: "Correct answer!",
      incorrectFeedback: "Correct answer: {answer}",
      nextQuestion: "Next Question",
      back: "Back"
    },
  },

  parts: [
    {
      id: "mouth",
      name: "Mouth",
      hint: "Food enters the digestive system here and chewing begins.",
      description: "Food enters the digestive system here and chewing begins.",
      explorerHighlight: "assets/digestive-system/explorer-highlights/1_mouth_Highlight.svg",
      challengeHighlight: "assets/digestive-system/challenge-highlights/1_mouth_Highlight.svg",
      explorerAudio: "assets/audio/digestive-system/explorer/mouth.mp3",
      challengeAudio: "assets/audio/digestive-system/challenge/mouth.mp3",
      explorerConnectorTarget: {x: 57, y: 6},
      challengeConnectorTarget: {x: 57, y: 6},
      challengeSide: "left"
    },
    {
      id: "esophagus",
      name: "Food pipe (Esophagus)",
      hint: "A muscular tube that carries food from the mouth to the stomach.",
      description: "A muscular tube that carries food from the mouth to the stomach.",
      explorerHighlight: "assets/digestive-system/explorer-highlights/2_esophagus_Highlight.svg",
      challengeHighlight: "assets/digestive-system/challenge-highlights/2_esophagus_Highlight.svg",
      explorerAudio: "assets/audio/digestive-system/explorer/esophagus.mp3",
      challengeAudio: "assets/audio/digestive-system/challenge/esophagus.mp3",
      explorerConnectorTarget: {x: 50, y: 31},
      challengeConnectorTarget: {x: 50, y: 31},
      challengeSide: "left"
    },
    {
      id: "stomach",
      name: "Stomach",
      hint: "A muscular organ that mixes food with digestive juices.",
      description: "A muscular organ that mixes food with digestive juices.",
      explorerHighlight: "assets/digestive-system/explorer-highlights/3_stomach_Highlight.svg",
      challengeHighlight: "assets/digestive-system/challenge-highlights/3_stomach_Highlight.svg",
      explorerAudio: "assets/audio/digestive-system/explorer/stomach.mp3",
      challengeAudio: "assets/audio/digestive-system/challenge/stomach.mp3",
      explorerConnectorTarget: {x: 55, y: 58},
      challengeConnectorTarget: {x: 55, y: 58},
      challengeSide: "left"
    },
    {
      id: "small-intestine",
      name: "Small Intestine",
      hint: "Most digestion and absorption of nutrients take place here.",
      description: "Most digestion and absorption of nutrients take place here.",
      explorerHighlight: "assets/digestive-system/explorer-highlights/4_small_intestine_Highlight.svg",
      challengeHighlight: "assets/digestive-system/challenge-highlights/4_small_intestine_Highlight.svg",
      explorerAudio: "assets/audio/digestive-system/explorer/small-intestine.mp3",
      challengeAudio: "assets/audio/digestive-system/challenge/small-intestine.mp3",
      explorerConnectorTarget: {x: 50, y: 76},
      challengeConnectorTarget: {x: 50, y: 76},
      challengeSide: "right"
    },
    {
      id: "large-intestine",
      name: "Large Intestine",
      hint: "It absorbs water and forms solid waste.",
      description: "It absorbs water and forms solid waste.",
      explorerHighlight: "assets/digestive-system/explorer-highlights/5_large_intestine_Highlight.svg",
      challengeHighlight: "assets/digestive-system/challenge-highlights/5_large_intestine_Highlight.svg",
      explorerAudio: "assets/audio/digestive-system/explorer/large-intestine.mp3",
      challengeAudio: "assets/audio/digestive-system/challenge/large-intestine.mp3",
      explorerConnectorTarget: {x: 68, y: 72},
      challengeConnectorTarget: {x: 68, y: 72},
      challengeSide: "right"
    },
    {
      id: "anus",
      name: "Anus",
      hint: "The opening through which solid waste leaves the body.",
      description: "The opening through which solid waste leaves the body.",
      explorerHighlight: "assets/digestive-system/explorer-highlights/6_anus_Highlight.svg",
      challengeHighlight: "assets/digestive-system/challenge-highlights/6_anus_Highlight.svg",
      explorerAudio: "assets/audio/digestive-system/explorer/anus.mp3",
      challengeAudio: "assets/audio/digestive-system/challenge/anus.mp3",
      explorerConnectorTarget: {x: 49, y: 95},
      challengeConnectorTarget: {x: 49, y: 95},
      challengeSide: "right"
    }
  ],

  challenge: {
    completionSound: "assets/audio/digestive-system/challenge/completion-sound.mp3",
    leftParts: ["mouth", "esophagus", "stomach"],
    rightParts: ["small-intestine", "large-intestine", "anus"],
    numberOfParts: 6,
    completionMessage: "You have successfully completed the activity."
  },

  exam: {
    successSound: "assets/audio/digestive-system/exam/success.mp3",
    wrongSound: "assets/audio/digestive-system/exam/wrong.mp3",
    questionsPerAttempt: 6,
    questions: [
      {q: "Where does food enter the digestive system?", o: ["Mouth", "Stomach", "Anus", "Large Intestine"], a: "Mouth"},
      {q: "Which tube carries food to the stomach?", o: ["Esophagus", "Small Intestine", "Large Intestine", "Anus"], a: "Esophagus"},
      {q: "Which organ mixes food with digestive juices?", o: ["Stomach", "Mouth", "Anus", "Esophagus"], a: "Stomach"},
      {q: "Where are most nutrients absorbed?", o: ["Small Intestine", "Large Intestine", "Mouth", "Anus"], a: "Small Intestine"},
      {q: "Which part absorbs water and forms solid waste?", o: ["Large Intestine", "Stomach", "Esophagus", "Mouth"], a: "Large Intestine"},
      {q: "Through which opening does solid waste leave the body?", o: ["Anus", "Mouth", "Stomach", "Esophagus"], a: "Anus"}
    ]
  },

  certificate: {
    title: "Certificate of Excellence",
    gameTitle: "Digestive System Explorer",
    description:
      "This certificate is proudly awarded for successfully completing the Level 3 Exam.",
    studentName: "Ahmed Sayed Nasary",
    studentNameEnabled: true,
    minimumPassingScore: 0,
    dateEnabled: false,
    printButton: "🖨 Print Certificate"
  }
};