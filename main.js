const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "./img/ground.png"

const foodImg = new Image();
foodImg.src = "./img/food.png";
const modal = document.getElementById("modal");
const newGameButton = document.getElementById("newGameButton");
const scoreDisplay = document.getElementById("scoreDisplay");

let box = 32;
let score = 0;
let speed = 100; // начальная скорость
let interval;

let food = {
    x: Math.floor((Math.random() * 17 + 1)) * box,
    y: Math.floor((Math.random() * 15 + 3)) * box,
};

let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box,
};

let dir;

function direction(e) {
    if (e.keyCode === 65 && dir != "right") dir = "left";
    else if (e.keyCode === 87 && dir !== 'down') dir = "up";
    else if (e.keyCode === 68 && dir !== 'left') dir = "right";
    else if (e.keyCode === 83 && dir !== 'up') dir = "down";
}

document.addEventListener("keydown", direction);

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x === arr[i] && head.y === arr[i]) {
            clearInterval(game);
            setModal();
        }
    }
}
function setModal() {
    modal.style.display = "flex";
    scoreDisplay.textContent = `Game Over! Your score: ${score}`;
}

function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    dir = undefined;
    score = 0;
    speed = 100;
    food = {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box,
    };
    modal.style.display = "none";
    clearInterval(interval);
    interval = setInterval(drawGame, speed);
}
function drawGame() {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    // Массив цветов радуги
    const rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"];

    for (let i = 0; i < snake.length; i++){
        ctx.fillStyle = rainbowColors[i % rainbowColors.length];

        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box *2.5, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX === food.x && snakeY === food.y) {
        score++
        food = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        };
        // Увеличиваем скорость игры
        if (speed > 50) {
            speed -= 5;
            clearInterval(interval);
            interval = setInterval(drawGame, speed);
        }
    } else {
        snake.pop();
    }

    if (
        snakeX < box ||
        snakeX > box * 17 ||
        snakeY < 3 * box ||
        snakeY > box * 17
    ) {
        clearInterval(game);
        setModal();
    }

    if (dir === 'left') snakeX -= box;
    if (dir === 'right') snakeX += box;
    if (dir === 'up') snakeY -= box;
    if (dir === 'down') snakeY += box;

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    eatTail(newHead, snake);
    snake.unshift(newHead);
}
newGameButton.addEventListener("click", resetGame);

//Запускаю игру
interval = setInterval(drawGame, speed);

