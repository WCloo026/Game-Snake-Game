const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");
const timerElement = document.getElementById("timerVal");
const hungerBar = document.getElementById("hungerBar");
const hungerPopup = document.getElementById("hunger-popup");
const overlay = document.getElementById("overlay");
const statusTitle = document.getElementById("statusTitle");
const startBtn = document.getElementById("startBtn");
const hintElement = document.getElementById("gameHint");
const muteBtn = document.getElementById("muteBtn");

const appleSound = document.getElementById("appleSound");
const bgm = document.getElementById("bgm");
const gameOverSound = document.getElementById("gameOverSound");

const box = 20;
const APPLE_TIME_LIMIT = 15;

let score, seconds, appleTimer, snake, food, d, gameLoop, timerInterval;
let isPaused = true;
let isMoving = false;
let isMuted = false;
let lastDisplayedSecond = 15;
let needsReset = false; 

function init() {
    score = 0;
    seconds = 0;
    appleTimer = APPLE_TIME_LIMIT;
    lastDisplayedSecond = APPLE_TIME_LIMIT;
    snake = [{ x: 10 * box, y: 15 * box }];
    food = { x: 15 * box, y: 5 * box };
    d = undefined;
    isMoving = false;
    needsReset = false;
    
    scoreElement.innerText = score;
    timerElement.innerText = "0";
    statusTitle.innerText = "SNAKE GAME";
    statusTitle.classList.remove("times-up-text");
    startBtn.innerText = "Play / Resume";
    startBtn.classList.remove("restart-mode");
    hungerPopup.classList.add("hidden");
    updateHungerBarUI();
    render();
}

muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    appleSound.muted = isMuted;
    gameOverSound.muted = isMuted;
    muteBtn.innerText = isMuted ? "🔇" : "🔊";
    muteBtn.classList.toggle("is-muted", isMuted);
});

function updateHungerBarUI() {
    const percentage = appleTimer / APPLE_TIME_LIMIT;
    hungerBar.style.transform = `scaleX(${Math.max(0, percentage)})`;
    const currentSec = Math.ceil(appleTimer);
    if (currentSec <= 5 && currentSec > 0) {
        hungerBar.classList.add("low-hunger");
        if (currentSec !== lastDisplayedSecond) {
            showHungerPopup(currentSec);
            lastDisplayedSecond = currentSec;
        }
    } else {
        hungerBar.classList.remove("low-hunger");
        hungerPopup.classList.add("hidden");
    }
}

function showHungerPopup(num) {
    hungerPopup.innerText = num;
    hungerPopup.classList.remove("hidden", "animate-pop");
    void hungerPopup.offsetWidth; 
    hungerPopup.classList.add("animate-pop");
}

function startGame() {
    if (needsReset) {
        init(); 
    }
    isPaused = false;
    overlay.classList.add("hidden");
    hintElement.innerText = "Press a direction key to move!";
    bgm.play().catch(() => {});
    render(); 
}

function startEngine() {
    if (isMoving) return;
    isMoving = true;
    gameLoop = setInterval(update, 120);
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.innerText = seconds;
    }, 1000);
}

function pauseGame() {
    isPaused = true;
    isMoving = false;
    clearInterval(gameLoop);
    clearInterval(timerInterval);
    statusTitle.innerText = "PAUSED";
    overlay.classList.remove("hidden");
    bgm.pause();
}

function gameOver(message, isTimeUp = false) {
    isMoving = false;
    isPaused = true;
    needsReset = true; 
    clearInterval(gameLoop);
    clearInterval(timerInterval);
    
    bgm.pause();
    bgm.currentTime = 0;

    if (!isMuted) {
        gameOverSound.currentTime = 0;
        gameOverSound.play();
    }

    statusTitle.innerText = isTimeUp ? "TIME'S UP!" : "GAME OVER";
    if (isTimeUp) statusTitle.classList.add("times-up-text");
    
    startBtn.innerText = "Try Again";
    startBtn.classList.add("restart-mode");
    overlay.classList.remove("hidden");
    hungerPopup.classList.add("hidden");
}

function restartGame() {
    // Popup Message Upgrade
    const userConfirmed = confirm("Are you sure you want to restart? Your progress will be lost.");
    
    if (userConfirmed) {
        pauseGame();
        init();
    }
}

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (!isPaused && !isMoving) {
        const moveKeys = ["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"];
        if (moveKeys.includes(key)) startEngine();
    }
    if (isPaused) return;

    if ((key === "a" || e.keyCode === 37) && d !== "RIGHT") d = "LEFT";
    else if ((key === "w" || e.keyCode === 38) && d !== "DOWN") d = "UP";
    else if ((key === "d" || e.keyCode === 39) && d !== "LEFT") d = "RIGHT";
    else if ((key === "s" || e.keyCode === 40) && d !== "UP") d = "DOWN";
});

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function render() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    snake.forEach((part, i) => {
        ctx.fillStyle = (i === 0) ? "#4ecca3" : "#45b391";
        ctx.fillRect(part.x, part.y, box, box);
    });
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);
}

function update() {
    if (isMoving) {
        appleTimer -= 0.12; 
        updateHungerBarUI();
        if (appleTimer <= 0) return gameOver("Starved!", true);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    let newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake)) return gameOver("Collision!");

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerText = score;
        food = { x: Math.floor(Math.random()*19+1)*box, y: Math.floor(Math.random()*19+1)*box };
        appleTimer = APPLE_TIME_LIMIT; 
        lastDisplayedSecond = APPLE_TIME_LIMIT;
        if (!isMuted) { appleSound.currentTime = 0; appleSound.play(); }
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    render();
}

startBtn.addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", pauseGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);

init();