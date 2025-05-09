const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const titleElement = document.querySelector('title');
const headingElement = document.querySelector('h1');
const scoreElement = document.getElementById('score');
const restartButtonElement = document.getElementById('restartBtn');

let player = { x: 180, y: 550, width: 40, height: 40 };
let keys = {};
let items = [];
let score = 0;
let lives = 5;
let gameOver = false;
let currentLanguage = localStorage.getItem('language') || 'es'; 

// ✅ NUEVO: ítems buenos y malos
const goodItems = ["✅", "🛡️", "🧼", "🚿", "🧴"];
const badItems = ["💣", "🪤", "☠️", "🧨", "⚠️"];

const translations = {
  es: {
    title: "Atrapa lo Seguro",
    heading: "Atrapa lo Seguro",
    score: "Puntos: 0",
    restartBtn: "🔁 Volver a Jugar",
    gameOver: "💀 Juego Terminado 💀",
    finalScore: "Puntaje: "
  },
  en: {
    title: "Catch it Safe",
    heading: "Catch it Safe",
    score: "Score: 0",
    restartBtn: "🔁 Play Again",
    gameOver: "💀 Game Over 💀",
    finalScore: "Score: "
  }
};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function translate() {
  titleElement.textContent = translations[currentLanguage].title;
  headingElement.textContent = translations[currentLanguage].heading;
  scoreElement.textContent = translations[currentLanguage].score.replace('0', score); 
  restartButtonElement.textContent = translations[currentLanguage].restartBtn;
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
  localStorage.setItem('language', currentLanguage);
  translate();
}

function drawPlayer() {
  ctx.fillStyle = "#ff4081"; 
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.font = "28px Arial";
  ctx.fillText("👧", player.x + 3, player.y + 30);
}

function spawnItem() {
  const isGood = Math.random() < 0.6;
  const emoji = isGood
    ? goodItems[Math.floor(Math.random() * goodItems.length)]
    : badItems[Math.floor(Math.random() * badItems.length)];
  items.push({
    x: Math.random() * (canvas.width - 30),
    y: 0,
    emoji: emoji,
    isGood: isGood,
    size: 30,
    speed: 2 + Math.random() * 2,
  });
}

function updateItems() {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    it.y += it.speed;

    if (
      it.y + it.size > player.y &&
      it.x < player.x + player.width &&
      it.x + it.size > player.x
    ) {
      if (it.isGood) {
        score++;
        translate(); 
      } else {
        lives--;
        updateLivesDisplay();
        if (lives <= 0) gameOver = true;
      }
      items.splice(i, 1);
    } else if (it.y > canvas.height) {
      items.splice(i, 1);
    }
  }
}

function drawItems() {
  items.forEach((it) => {
    ctx.font = "26px Arial";
    ctx.fillText(it.emoji, it.x, it.y);
  });
}

function updateLivesDisplay() {
  document.getElementById("lives").innerHTML = "❤️".repeat(lives);
}

function drawScore() {
  // opcional si quieres mostrar en canvas también
}

function gameLoop() {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "32px Arial";
    ctx.fillStyle = "#ff4081";
    ctx.fillText(translations[currentLanguage].gameOver, 60, 300);
    ctx.fillStyle = "#000";
    ctx.fillText(`${translations[currentLanguage].finalScore}${score}`, 130, 350);
    restartBtn.style.display = "block";
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += 5;

  drawPlayer();
  drawItems();
  updateItems();
  drawScore(); 

  if (Math.random() < 0.03) spawnItem();

  requestAnimationFrame(gameLoop);
}

restartBtn.onclick = () => {
  player.x = 180;
  score = 0;
  lives = 5;
  gameOver = false;
  items = [];
  updateLivesDisplay();
  translate(); 
  restartBtn.style.display = "none";
  gameLoop();
};

// 🔁 Iniciar juego
translate();
updateLivesDisplay();
gameLoop();
