const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

highScoreDisplay.textContent = highScore;

function drawRect(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, size, size);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            drawRect(segment.x, segment.y, gridSize, '#00ff00');
        } else {
            drawRect(segment.x, segment.y, gridSize, '#00cc00');
        }
    });

    // Draw food
    drawRect(food.x, food.y, gridSize, '#ff0000');
}

function update() {
    if (!gameRunning || gamePaused) return;

    direction = nextDirection;

    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
            return;
        }
    }
}

function gameUpdate() {
    update();
    draw();
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        pauseBtn.textContent = 'Pause';
        startBtn.textContent = 'Restart';
        if (!gameLoop) {
            gameLoop = setInterval(gameUpdate, 100);
        }
    }
}

function pauseGame() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    }
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    gameLoop = null;
    startBtn.textContent = 'Start Game';
    pauseBtn.textContent = 'Pause';

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }

    alert(`Game Over! Score: ${score}`);
    resetGame();
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 1, y: 0};
    nextDirection = {x: 1, y: 0};
    score = 0;
    scoreDisplay.textContent = score;
    generateFood();
    draw();
}

function handleKeyPress(e) {
    const key = e.key;
    const up = key === 'ArrowUp';
    const down = key === 'ArrowDown';
    const left = key === 'ArrowLeft';
    const right = key === 'ArrowRight';

    if (up && direction.y === 0) {
        nextDirection = {x: 0, y: -1};
        e.preventDefault();
    } else if (down && direction.y === 0) {
        nextDirection = {x: 0, y: 1};
        e.preventDefault();
    } else if (left && direction.x === 0) {
        nextDirection = {x: -1, y: 0};
        e.preventDefault();
    } else if (right && direction.x === 0) {
        nextDirection = {x: 1, y: 0};
        e.preventDefault();
    }
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
document.addEventListener('keydown', handleKeyPress);

// Initial draw
resetGame();
