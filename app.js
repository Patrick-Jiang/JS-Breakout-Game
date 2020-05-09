const rules = document.getElementById("rules");
const closeBtn = document.getElementById("close-btn");
const rulesBtn = document.getElementById("rules-btn");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const bricksRow = 9;
const bricksCol = 5;
let score = 0;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 2,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 70,
  visible: true,
};
console.log(111);
const bricks = [];
for (let i = 0; i < bricksRow; i++) {
  bricks[i] = [];

  for (let j = 0; j < bricksCol; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

console.log(bricks);

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score : ${score}`, canvas.width - 100, 30);
}
function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y + ball.size > canvas.height || ball.y + ball.size < 0) {
    ball.dy *= -1;
  }
  if (ball.x + ball.size > canvas.width || ball.x + ball.size < 0) {
    ball.dx *= -1;
  }

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}
function increaseScore() {
  score++;
  if (score % (bricksCol * bricksRow) === 0) {
    showAllBricks();
  }
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = "true";
    });
  });
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}
function update() {
  movePaddle();
  moveBall();
  draw();

  requestAnimationFrame(update);
}
requestAnimationFrame(update);

function keyUp(e) {
  if (e.key === "ArrowRight") {
    paddle.dx = 0;
  } else if (e.key === "ArrowLeft") {
    paddle.dx = 0;
  }
}

function keyDown(e) {
  if (e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

update();

rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});
closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
