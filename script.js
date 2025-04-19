const questions = [
  {
    question: "Name something you do before going to bed",
    answers: ["Brush teeth", "Watch TV", "Read", "Shower", "Set alarm", "Check phone"]
  },
  {
    question: "Name a popular pizza topping",
    answers: ["Pepperoni", "Mushrooms", "Cheese", "Sausage", "Olives", "Peppers"]
  },
  {
    question: "Name a place where people need to be quiet",
    answers: ["Library", "Church", "Cinema", "Hospital", "Courtroom", "Classroom"]
  }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let revealed = [];
const WRONG_ANSWER_PENALTY = 5;

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const questionEl = document.getElementById("question");
const answerBoard = document.getElementById("answer-board");
const userAnswer = document.getElementById("user-answer");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const nextRoundBtn = document.getElementById("next-round-btn");
const roundNumberEl = document.getElementById("round-number");
const totalRoundsEl = document.getElementById("total-rounds");
const feedbackEl = document.getElementById("feedback");

function startGame() {
  welcomeScreen.classList.remove("active");
  gameScreen.classList.add("active");
  totalRoundsEl.textContent = questions.length;
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  answerBoard.innerHTML = "";
  revealed = [];
  roundNumberEl.textContent = currentQuestion + 1;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  q.answers.forEach((ans, index) => {
    const box = document.createElement("div");
    box.className = "answer-box";
    box.dataset.answer = ans.toLowerCase();
    box.textContent = `${index + 1}. ${ans}`;
    answerBoard.appendChild(box);
  });

  userAnswer.value = "";
  userAnswer.disabled = false;
  userAnswer.focus();
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  nextRoundBtn.classList.add("hidden");

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endRound();
  }, 1000);
}

function submitAnswer() {
  const input = userAnswer.value.trim().toLowerCase();
  if (!input) return;

  const boxes = document.querySelectorAll(".answer-box");
  let found = false;

  boxes.forEach(box => {
    if (box.dataset.answer.includes(input) && !box.classList.contains("revealed")) {
      box.classList.add("revealed", "correct");
      revealed.push(box.dataset.answer);
      score += 10;
      scoreEl.textContent = score;
      found = true;
      showFeedback("Correct! +10 points", "correct-feedback");
    }
  });

  if (!found) {
    score = Math.max(0, score - WRONG_ANSWER_PENALTY);
    scoreEl.textContent = score;
    showFeedback(`Wrong answer! -${WRONG_ANSWER_PENALTY} points`, "incorrect-feedback");
    
    const tempBox = document.createElement("div");
    tempBox.className = "answer-box revealed incorrect";
    tempBox.textContent = input;
    answerBoard.appendChild(tempBox);
    setTimeout(() => {
      tempBox.remove();
    }, 1000);
  }

  userAnswer.value = "";
  if (revealed.length === questions[currentQuestion].answers.length) endRound();
}

function showFeedback(message, className) {
  feedbackEl.textContent = message;
  feedbackEl.className = "feedback " + className;
  setTimeout(() => {
    feedbackEl.className = "feedback";
  }, 2000);
}

function endRound() {
  clearInterval(timer);
  userAnswer.disabled = true;
  document.querySelectorAll(".answer-box").forEach(box => {
    if (!box.classList.contains("revealed")) {
      box.classList.add("revealed");
    }
  });
  
  if (currentQuestion < questions.length - 1) {
    nextRoundBtn.classList.remove("hidden");
  } else {
    nextRoundBtn.textContent = "Game Over - Play Again?";
    nextRoundBtn.classList.remove("hidden");
  }
}

function nextRound() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    currentQuestion = 0;
    score = 0;
    scoreEl.textContent = score;
    loadQuestion();
    nextRoundBtn.textContent = "Next Round";
  }
}

document.getElementById("user-answer").addEventListener("keypress", function (e) {
  if (e.key === "Enter") submitAnswer();
});
