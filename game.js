// === Gambar mobil & item ===
const playerImg = new Image();
playerImg.src = "player.png"; // mobil hijau

const enemyImg = new Image();
enemyImg.src = "enemy.png"; // mobil merah

const boosterImg = new Image();
boosterImg.src = "booster.png"; // ikon booster

const obstacleImg = new Image();
obstacleImg.src = "obstacle.png"; // rintangan

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lanes = [
  canvas.width/4 - 40,
  canvas.width/2 - 20,
  (canvas.width*3/4) - 40
]; 

let score = 0;
let gameRunning = true;

// === Player & Enemy ===
let player, enemy, obstacles, boosters;

function initGame() {
  player = { x: lanes[1], y: canvas.height - 120, width: 60, height: 90, lane: 1, speed: 2 };
  enemy = { x: lanes[1], y: 60, width: 60, height: 90, lane: 1 };
  obstacles = [];
  boosters = [];
  score = 0;
  gameRunning = true;
  document.getElementById("gameOverScreen").style.display = "none";
}

initGame();

// === Kontrol ===
function moveUp() {
  if (!gameRunning) return;
  if (player.lane > 0) player.lane--;
}
function moveDown() {
  if (!gameRunning) return;
  if (player.lane < lanes.length - 1) player.lane++;
}

// === Spawner ===
function spawnObstacle() {
  if (!gameRunning) return;
  const lane = Math.floor(Math.random() * lanes.length);
  obstacles.push({ x: lanes[lane], y: -80, width: 60, height: 60 });
}
function spawnBooster() {
  if (!gameRunning) return;
  const lane = Math.floor(Math.random() * lanes.length);
  boosters.push({ x: lanes[lane], y: -80, width: 50, height: 50 });
}

// === Update ===
function update() {
  if (!gameRunning) return;

  player.x = lanes[player.lane];

  // Enemy auto
  enemy.y += 1.5;
  if (enemy.y > canvas.height) enemy.y = -100;

  obstacles.forEach(o => o.y += 4);
  obstacles = obstacles.filter(o => o.y < canvas.height);

  boosters.forEach(b => b.y += 3);
  boosters = boosters.filter(b => b.y < canvas.height);

  // Cek obstacle
  for (let o of obstacles) {
    if (isColliding(player, o)) {
      player.speed = 1; 
      showPopup("⚠️ Latency Spike!", "#ff4444");
      setTimeout(()=> player.speed = 2, 2000);
      o.y = canvas.height + 200;
    }
  }

  // Cek booster
  for (let b of boosters) {
    if (isColliding(player, b)) {
      player.speed = 4;
      const msgs = ["⚡ Parallelism Boost!", "🚀 Low Latency!", "🧩 Modular Scaling!"];
      showPopup(msgs[Math.floor(Math.random()*msgs.length)], "#00ff88");
      setTimeout(()=> player.speed = 2, 2000);
      b.y = canvas.height + 200;
    }
  }

  score++;

  if (score >= 3000) {
    endGame(true, "🚀 Modular Parallel Execution menang lawan Monolith!");
  }
}

// === Draw ===
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // enemy
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // obstacle
  obstacles.forEach(o => {
    ctx.drawImage(obstacleImg, o.x, o.y, o.width, o.height);
  });

  // booster
  boosters.forEach(b => {
    ctx.drawImage(boosterImg, b.x, b.y, b.width, b.height);
  });

  // score
  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

// === Collider ===
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// === Popup Narasi ===
function showPopup(msg, color="#00ff88") {
  const popup = document.getElementById("popupMessage");
  popup.textContent = msg;
  popup.style.color = color;
  popup.style.display = "block";
  popup.style.opacity = "1";

  setTimeout(() => {
    popup.style.transition = "opacity 1s";
    popup.style.opacity = "0";
  }, 1200);

  setTimeout(() => {
    popup.style.display = "none";
    popup.style.transition = "none";
  }, 2200);
}

// === End game ===
function endGame(win, reason) {
  gameRunning = false;
  const screen = document.getElementById("gameOverScreen");
  const resultText = document.getElementById("resultText");
  const reasonText = document.getElementById("reasonText");

  if (win) {
    resultText.textContent = "🏆 AltiusLab Menang!";
    resultText.style.color = "#00ff88";
  } else {
    resultText.textContent = "❌ Monolith Menang!";
    resultText.style.color = "#ff4444";
  }
  reasonText.textContent = reason;
  screen.style.display = "flex";
}

// === Restart ===
function restartGame() {
  initGame();
}

// === Loop ===
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// === Start ===
setInterval(spawnObstacle, 2000);
setInterval(spawnBooster, 5000);
gameLoop();
