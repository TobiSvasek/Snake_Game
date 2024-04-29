//konstanty
const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector('#scoreText');
const resetBtn = document.querySelector('#resetBtn');
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground ="white";
const snakeColor = "lightgreen";
const snakeBorder = "cadetblue";
const foodColor = "red";
const foodBorder = "green";
const unitSize = 25;
const eatSound = new Audio('food.mp3');
const gameoverSound = new Audio('gameover.mp3');

let gameLoop;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let highScore = 0;
let snake = [
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

// vyvolani zmeny smeru hada, resetu hry a highscore pri smrti
window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);
window.onload = function() {
    localStorage.removeItem('highScore');

    if(localStorage.getItem('highScore')) {
        highScore = localStorage.getItem('highScore');
    }
};

//start hry
gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick()
}
function nextTick(){
    if(running){
        gameLoop = setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
    }
}

//funkce na cistení canvasu
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

//funkce na vytvoření jablek
function createFood(){
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize / 2);
    foodY = randomFood(0, gameHeight - unitSize);
}
function drawFood() {
    ctx.font = "30px Arial";
    ctx.fillText("🍎", foodX + unitSize / 2, foodY + unitSize);
}

//funkce na pohyb hada
function moveSnake(){
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head); // Add new head

    // Check if the snake ate the apple
    if (snake[0].x < foodX + unitSize &&
        snake[0].x + unitSize > foodX &&
        snake[0].y < foodY + unitSize &&
        snake[0].y + unitSize > foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
        eatSound.play().then(r => r);
    } else {
        // If the snake didn't eat the apple, remove the tail
        snake.pop(); // Remove the last segment if the snake didn't eat the apple
    }
}
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.beginPath();
        ctx.arc(snakePart.x + unitSize / 2, snakePart.y + unitSize / 2, unitSize / 2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    });
}

function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch(true){
        case(keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed === UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed === DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

//funkce na kontrolu konce hry
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            running = false;
        }
    }
}

function updateHighScore() {
    if(score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

// Display the high score
function displayHighScore() {
    ctx.font = "bold 25px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("High Score: " + highScore, gameWidth / 2, gameHeight / 2 + 50);
    const highScoreText = document.querySelector('#highScoreText');
    highScoreText.textContent = "High Score: " + highScore;
}

function displayGameOver(){
    ctx.font = "bold 50px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", gameWidth / 2, gameHeight / 2);
    updateHighScore();
    displayHighScore();
    running = false;
    gameoverSound.play().then(r => r);
}

//funkce na reset hry
function resetGame(){
    clearTimeout(gameLoop); // Clear the previous game loop
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    gameStart();
}

window.onload = function() {
    localStorage.removeItem('highScore');

    if(localStorage.getItem('highScore')) {
        highScore = localStorage.getItem('highScore');
    }

    resetBtn.click(); // Simulate a click on the restart button
};
