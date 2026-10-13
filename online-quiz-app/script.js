const questions = [
  { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1, explanation: "Mars looks reddish because iron minerals in its soil have oxidized, or rusted." },
  { question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: 3, explanation: "The Pacific Ocean is the largest and deepest ocean on Earth." },
  { question: "What does HTML stand for?", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Main Link"], answer: 1, explanation: "HTML means HyperText Markup Language and structures content on web pages." },
  { question: "How many sides does a hexagon have?", options: ["Five", "Six", "Seven", "Eight"], answer: 1, explanation: "A hexagon is a polygon with six sides." },
  { question: "Which gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: 2, explanation: "Plants use carbon dioxide, water, and light energy to make sugars during photosynthesis." }
];

const intro = document.getElementById("intro");
const quizPanel = document.getElementById("quiz-panel");
const resultPanel = document.getElementById("result-panel");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const questionCount = document.getElementById("question-count");
const questionNumber = document.getElementById("question-number");
const progressFill = document.getElementById("progress-fill");
const timerLabel = document.getElementById("timer");
const answeredStatus = document.getElementById("answered-status");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultIcon = document.getElementById("result-icon");
const scoreLabel = document.getElementById("score");
const scorePercent = document.getElementById("score-percent");
const scoreFill = document.getElementById("score-fill");
const review = document.getElementById("review");

let currentIndex = 0;
let selectedAnswers = [];
let timeLeft = 30;
let timerId = null;
let locked = false;

function startQuiz() {
  currentIndex = 0;
  selectedAnswers = [];
  intro.classList.add("hidden");
  resultPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerId);
  locked = false;
  const item = questions[currentIndex];
  questionText.textContent = item.question;
  questionCount.textContent = `QUESTION ${currentIndex + 1} / ${questions.length}`;
  questionNumber.textContent = `Question ${currentIndex + 1}`;
  progressFill.style.width = `${(currentIndex / questions.length) * 100}%`;
  optionsBox.replaceChildren();
  answeredStatus.textContent = "Choose one answer";
  nextBtn.disabled = true;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "See results →" : "Next question →";

  item.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);
    const label = document.createElement("span");
    label.textContent = optionText;
    button.append(letter, label);
    button.addEventListener("click", () => selectAnswer(index));
    optionsBox.append(button);
  });
  startTimer();
}

function startTimer() {
  timeLeft = 30;
  updateTimer();
  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      if (!locked) {
        selectedAnswers[currentIndex] = null;
        lockOptions(null);
        answeredStatus.textContent = "Time is up!";
        nextBtn.disabled = false;
      }
    }
  }, 1000);
}

function updateTimer() {
  timerLabel.textContent = `⏱ ${timeLeft}s`;
  timerLabel.style.background = timeLeft <= 10 ? "#fff0f1" : "#fff5e8";
  timerLabel.style.color = timeLeft <= 10 ? "#c33c4e" : "#b56c1d";
}

function selectAnswer(index) {
  if (locked) return;
  selectedAnswers[currentIndex] = index;
  lockOptions(index);
  answeredStatus.textContent = index === questions[currentIndex].answer ? "Nice work! Answer selected." : "Answer selected — keep going!";
  nextBtn.disabled = false;
  clearInterval(timerId);
}

function lockOptions(selectedIndex) {
  locked = true;
  [...optionsBox.children].forEach((button, index) => {
    button.disabled = true;
    if (index === questions[currentIndex].answer) button.classList.add("correct");
    if (index === selectedIndex && selectedIndex !== questions[currentIndex].answer) button.classList.add("wrong");
    if (index === selectedIndex) button.classList.add("selected");
  });
}

function goNext() {
  if (nextBtn.disabled) return;
  clearInterval(timerId);
  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  clearInterval(timerId);
  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  const score = questions.reduce((total, item, index) => total + (selectedAnswers[index] === item.answer ? 1 : 0), 0);
  const percent = Math.round((score / questions.length) * 100);
  scoreLabel.textContent = `${score} / ${questions.length}`;
  scorePercent.textContent = `${percent}% correct`;
  scoreFill.style.width = `${percent}%`;
  resultIcon.textContent = percent === 100 ? "🏆" : percent >= 60 ? "🎉" : "🌱";
  resultTitle.textContent = percent === 100 ? "Perfect score!" : percent >= 60 ? "Great job!" : "Keep learning!";
  resultMessage.textContent = percent === 100 ? "Amazing! You answered every question correctly." : "Every quiz is a chance to learn something new.";
  review.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = "Answer review";
  review.append(heading);
  questions.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "review-item";
    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${item.question}`;
    const answer = document.createElement("div");
    const chosen = selectedAnswers[index];
    answer.className = chosen === item.answer ? "right" : "wrong-answer";
    answer.textContent = chosen === item.answer ? `Your answer: ${item.options[item.answer]} ✓` : `Your answer: ${chosen == null ? "No answer" : item.options[chosen]} · Correct: ${item.options[item.answer]}`;
    const explanation = document.createElement("div");
    explanation.textContent = item.explanation;
    row.append(title, answer, explanation);
    review.append(row);
  });
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goNext);
restartBtn.addEventListener("click", startQuiz);