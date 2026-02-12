let num1, num2, operator, correctAnswer;
let mode = "normal"; // "normal" vagy "timed"
let timer = null;
let timeLeft = 10;

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const timeLeftEl = document.getElementById("time-left");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const timerSound = document.getElementById("timer-sound");

const modeButtons = document.querySelectorAll(".mode-btn");
const difficultySelect = document.getElementById("difficulty");

// Mód választás
modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        modeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        mode = btn.dataset.mode;

        if (mode === "timed") {
            timerEl.classList.remove("hidden");
            startTimer();
        } else {
            timerEl.classList.add("hidden");
            stopTimer();
        }

        generateQuestion();
    });
});

// Alapértelmezett: normál mód aktív
document.querySelector('.mode-btn[data-mode="normal"]').classList.add("active");

// Nehézség alapján számgenerálás
function generateQuestion() {
    stopTimer();
    resultEl.innerText = "";
    answerEl.value = "";

    const difficulty = difficultySelect.value;

    let operators;
    let maxAddSub = 50;
    let maxMul = 10;

    if (difficulty === "easy") {
        operators = ["+", "-"];
        maxAddSub = 50;
        maxMul = 10;
    } else if (difficulty === "medium") {
        operators = ["+", "-", "*"];
        maxAddSub = 100;
        maxMul = 12;
    } else { // hard
        operators = ["+", "-", "*", "/"];
        maxAddSub = 150;
        maxMul = 12;
    }

    operator = operators[Math.floor(Math.random() * operators.length)];

    if (operator === "+") {
        num1 = Math.floor(Math.random() * maxAddSub) + 1;
        num2 = Math.floor(Math.random() * maxAddSub) + 1;
        correctAnswer = num1 + num2;
    }

    if (operator === "-") {
        let a = Math.floor(Math.random() * maxAddSub) + 1;
        let b = Math.floor(Math.random() * maxAddSub) + 1;
        num1 = Math.max(a, b);
        num2 = Math.min(a, b);
        correctAnswer = num1 - num2;
    }

    if (operator === "*") {
        num1 = Math.floor(Math.random() * maxMul) + 1;
        num2 = Math.floor(Math.random() * maxMul) + 1;
        correctAnswer = num1 * num2;
    }

    if (operator === "/") {
        num2 = Math.floor(Math.random() * maxMul) + 1;
        let multiplier = Math.floor(Math.random() * maxMul) + 1;
        num1 = num2 * multiplier;
        correctAnswer = num1 / num2;
    }

    questionEl.innerText = `${num1} ${operator} ${num2} = ?`;

    if (mode === "timed") {
        timeLeft = 10;
        timeLeftEl.innerText = timeLeft;
        startTimer();
    }
}

// Időzítő
function startTimer() {
    stopTimer();
    timer = setInterval(() => {
        timeLeft--;
        timeLeftEl.innerText = timeLeft;

        if (timeLeft === 0) {
            timerSound.currentTime = 0;
            timerSound.play();
            stopTimer();
            resultEl.innerText = `Lejárt az idő! Helyes válasz: ${correctAnswer}`;
            flashWrong();
            setTimeout(generateQuestion, 1000);
        }
    }, 1000);
}

function stopTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}

// Animációk
function flashCorrect() {
    questionEl.classList.remove("wrong-flash");
    questionEl.classList.add("correct-flash");
    setTimeout(() => questionEl.classList.remove("correct-flash"), 400);
}

function flashWrong() {
    questionEl.classList.remove("correct-flash");
    questionEl.classList.add("wrong-flash");
    setTimeout(() => questionEl.classList.remove("wrong-flash"), 400);
}

// Válasz ellenőrzése
function checkAnswer() {
    const userAnswer = Number(answerEl.value);

    if (answerEl.value === "") return;

    if (userAnswer === correctAnswer) {
        resultEl.innerText = "Helyes!";
        flashCorrect();
        if (correctSound) {
            correctSound.currentTime = 0;
            correctSound.play();
        }
    } else {
        resultEl.innerText = `Rossz! Helyes válasz: ${correctAnswer}`;
        flashWrong();
        if (wrongSound) {
            wrongSound.currentTime = 0;
            wrongSound.play();
        }
    }

    answerEl.value = "";
    stopTimer();

    setTimeout(generateQuestion, 800);
}

// Gomb + Enter
document.getElementById("submit-btn").addEventListener("click", checkAnswer);
answerEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

// Nehézség váltáskor új kérdés
difficultySelect.addEventListener("change", generateQuestion);

// Első kérdés
window.onload = generateQuestion;
