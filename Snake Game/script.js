const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");
const timerElement = document.getElementById("timerVal");
const hungerBar = document.getElementById("hungerBar");
const hungerPopup = document.getElementById("hunger-popup");
const overlay = document.getElementById("overlay");
const statusTitle = document.getElementById("statusTitle");
const hintElement = document.getElementById("gameHint");

const box = 20;
const APPLE_TIME_LIMIT = 15;

let score, seconds, appleTimer, snake, food, d, gameLoop, timerInterval;
let isPaused = true;
let isMoving = false;
let lastDisplayedSecond = 15;

function init() {
    score = 0;
    seconds = 0;
    appleTimer = APPLE_TIME_LIMIT;
    lastDisplayedSecond = APPLE_TIME_LIMIT;
    snake = [{ x: 10 * box, y: 15 * box }];
    food = { x: 15 * box, y: 5 * box };
    d = undefined;
    isMoving = false;
    
    scoreElement.innerText = score;
    timerElement.innerText = "0";
    statusTitle.classList.remove("times-up-text");
    hungerPopup.classList.add("hidden");
    updateHungerBarUI();
    render();
}

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
}

function updateHungerBarUI() {
    const percentage = appleTimer / APPLE_TIME_LIMIT;
    hungerBar.style.transform = `scaleX(${Math.max(0, percentage)})`;
    
    const currentSec = Math.ceil(appleTimer);
    
    if (currentSec <= 5 && currentSec > 0) {
        hungerBar.classList.add("low-hunger");
        // Trigger Popup
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
    void hungerPopup.offsetWidth; // Trigger reflow
    hungerPopup.classList.add("animate-pop");
}

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (!isPaused && !isMoving) {
        if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)) {
            startEngine();
        }
    }
    if (isPaused) return;

    if ((key === "a" || e.keyCode === 37) && d !== "RIGHT") d = "LEFT";
    else if ((key === "w" || e.keyCode === 38) && d !== "DOWN") d = "UP";
    else if ((key === "d" || e.keyCode === 39) && d !== "LEFT") d = "RIGHT";
    else if ((key === "s" || e.keyCode === 40) && d !== "UP") d = "DOWN";
});

function startGame() {
    isPaused = false;
    overlay.classList.add("hidden");
    hintElement.innerText = "Press a direction key to move!";
    render(); 
}

function startEngine() {
    if (isMoving) return;
    isMoving = true;
    hintElement.innerText = "Hurry! Eat before the bar disappears!";
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
}

function gameOver(message, isTimeUp = false) {
    isMoving = false;
    clearInterval(gameLoop);
    clearInterval(timerInterval);
    hungerPopup.classList.add("hidden");

    if (isTimeUp) {
        statusTitle.innerText = "TIME'S UP!";
        statusTitle.classList.add("times-up-text");
    } else {
        statusTitle.innerText = "GAME OVER";
    }

    setTimeout(() => {
        alert(message + `\nScore: ${score}`);
        restartGame();
    }, 100);
}

function restartGame() {
    isPaused = true;
    isMoving = false;
    clearInterval(gameLoop);
    clearInterval(timerInterval);
    statusTitle.innerText = "SNAKE GAME";
    overlay.classList.remove("hidden");
    init();
}

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function render() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#4ecca3" : "#45b391";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);
}

function update() {
    if (isMoving) {
        appleTimer -= 0.12; 
        updateHungerBarUI();
        if (appleTimer <= 0) {
            gameOver("The snake starved!", true);
            return;
        }
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

    if (collision(newHead, snake)) {
        gameOver("You hit yourself!");
        return;
    }

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerText = score;
        food = getRandomFood();
        appleTimer = APPLE_TIME_LIMIT; 
        lastDisplayedSecond = APPLE_TIME_LIMIT;
        updateHungerBarUI();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    render();
}

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", pauseGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);

init();