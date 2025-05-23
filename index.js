//CONSTANTS
const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector('#scoreText');
const resetBtn = document.querySelector('#resetBtn');
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground ="#dce8de";
const snakeColor = "lightgreen";
const snakeBorder = "cadetblue";
const unitSize = 25;
const eatSound = new Audio('food.mp3');
const gameoverSound = new Audio('gameover.mp3');
const appleImg = new Image();
const totalCells = (gameWidth * gameHeight) / (unitSize * unitSize);
appleImg.src = 'red-apple.png';

//VARIABLES
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

//Change of direction, reset and high score event listeners
window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);
window.onload = function() {
    localStorage.removeItem('highScore');

    if(localStorage.getItem('highScore')) {
        highScore = localStorage.getItem('highScore');
    }
};

//Start game
gameStart();

//FUNCTIONS
//Game start function
function gameStart(){
    //Initialize the snake array and the score variable
    snake = [
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    score = 0;

    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick()
}

//Game loop function
function nextTick(){
    if(running){
        gameLoop = setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();

            //Check for victory
            if (snake.length === totalCells) {
                displayVictory();
            } else {
                nextTick();
            }
        }, 75);
    } else {
        displayGameOver();
    }
}

//Canvas clearing function
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

//Apple creation function
function createFood(){
    function randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}
function drawFood() {
    const unitSize = 31;
    ctx.drawImage(appleImg, foodX - 3, foodY - 3, unitSize, unitSize);
}


//Snake movement function
function moveSnake(){
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head); // Add new head

    //Check if the snake ate the apple
    const dx = (snake[0].x + unitSize / 2) - (foodX + unitSize / 2);
    const dy = (snake[0].y + unitSize / 2) - (foodY + unitSize / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < unitSize / 2) {
        score += 1;
        scoreText.textContent = score;
        createFood();
        eatSound.play().then(r => r);
    } else {
        //If the snake didn't eat the apple, remove the tail
        snake.pop(); // Remove the last segment if the snake didn't eat the apple
    }
}

//Snake drawing function
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

//Function for changing the direction of the snake
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

//Function for game-over check
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

//Update the high score function
function updateHighScore() {
    if(score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

//Display the high score function
function displayHighScore() {
    ctx.font = "bold 25px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("High Score: " + highScore, gameWidth / 2, gameHeight / 2 + 50);
    const highScoreText = document.querySelector('#highScoreText');
    highScoreText.innerHTML = "High Score: <span id='highScoreNumber'>" + highScore + "</span>";
}

//Display game over pop-up function
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

//Display victory pop-up function
function displayVictory() {
    clearTimeout(gameLoop);
    ctx.font = "bold 50px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Victory!", gameWidth / 2, gameHeight / 2);
}

//Game reset
function resetGame(){
    clearTimeout(gameLoop); // Clear the previous game loop
    xVelocity = unitSize;
    yVelocity = 0;
    gameStart();
}