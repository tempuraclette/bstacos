const canvas = document.getElementById("tacosGame");
const ctx = canvas.getContext("2d");
let player = { x: 270, y: 360, width: 60, height: 30, speed: 7 };
let tacos = [];
let score = 0;
let keys = {};
let gameInterval = null;
let tacoInterval = null;
let gameStarted = false;
let surpriseTriggered = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

const tacoImg = new Image();
tacoImg.src = "tacoicon.png";
const burgerImg = new Image();
burgerImg.src = "burgericon.png";

let burger = null;
let burgerCooldown = 0;

function spawnTaco() {
    tacos.push({ x: Math.random() * 560, y: -40, speed: 4 + Math.random() * 3 });
    if (!burger && burgerCooldown <= 0 && Math.random() < 0.05) {
        burger = { x: Math.random() * 560, y: -40, speed: 8 + Math.random() * 2 };
        burgerCooldown = 10; 
    }
    if (burgerCooldown > 0) burgerCooldown--;
}

function drawPlayer() {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(player.x + player.width / 2, player.y + player.height / 2, player.width / 2, player.height / 2, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#B43A18";
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 - 3, player.height / 2 - 3, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FFB347";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFB347";
    ctx.shadowColor = "#FFB347";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
}

function drawTacos() {
    tacos.forEach(t => {
        if (tacoImg.complete) {
            ctx.save();
            ctx.shadowColor = "#FFB347";
            ctx.shadowBlur = 10;
            ctx.drawImage(tacoImg, t.x, t.y, 30, 30);
            ctx.restore();
        } else {
            ctx.fillStyle = "#FF9B19";
            ctx.fillRect(t.x, t.y, 30, 30);
        }
    });
    if (burger) {
        if (burgerImg.complete) {
            ctx.save();
            ctx.shadowColor = "#ffb347";
            ctx.shadowBlur = 12;
            ctx.drawImage(burgerImg, burger.x, burger.y, 34, 34);
            ctx.restore();
        } else {
            ctx.fillStyle = "#e6b800";
            ctx.fillRect(burger.x, burger.y, 34, 34);
        }
    }
}

function updateTacos() {
    for (let i = tacos.length - 1; i >= 0; i--) {
        tacos[i].y += tacos[i].speed;
        if (
            tacos[i].x < player.x + player.width &&
            tacos[i].x + 30 > player.x &&
            tacos[i].y < player.y + player.height &&
            tacos[i].y + 30 > player.y
        ) {
            tacos.splice(i, 1);
            score++;
        } else if (tacos[i].y > 400) {
            tacos.splice(i, 1);
        }
    }
    if (burger) {
        burger.y += burger.speed;
        if (
            burger.x < player.x + player.width &&
            burger.x + 34 > player.x &&
            burger.y < player.y + player.height &&
            burger.y + 34 > player.y
        ) {
            score += 5;
            burger = null;
            burgerCooldown = 15; 
        } else if (burger.y > 400) {
            burger = null;
            burgerCooldown = 10;
        }
    }
}

function drawScore() {
    ctx.save();
    ctx.font = "bold 24px Lexend, Poppins, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#B43A18";
    ctx.lineWidth = 4;
    ctx.strokeText("Score : " + score, 440, 40);
    ctx.fillText("Score : " + score, 440, 40);
    ctx.restore();
    const scoreAffichage = document.getElementById("jeu-score-affichage");
    if (scoreAffichage) scoreAffichage.textContent = score;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
    if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    drawPlayer();
    drawTacos();
    updateTacos();
    drawScore();
    if (score >= 100 && !surpriseTriggered) {
        surpriseTriggered = true;
        multicolorBackground();
    }
}

function resetGame() {
    player.x = 270;
    player.y = 360;
    tacos = [];
    score = 0;
    keys = {};
    surpriseTriggered = false;
    drawScore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    burger = null;
}

function startGame() {
    if (gameStarted) return;
    resetGame();
    gameStarted = true;
    document.getElementById("startGameBtn").disabled = true;
    document.getElementById("startGameBtn").style.opacity = "0.6";
    tacoInterval = setInterval(spawnTaco, 300);
    gameInterval = setInterval(update, 20);
}

function stopGame() {
    clearInterval(tacoInterval);
    clearInterval(gameInterval);
    gameStarted = false;
    document.getElementById("startGameBtn").disabled = false;
    document.getElementById("startGameBtn").style.opacity = "1";
}

function multicolorBackground() {
    const sectionJeu = document.querySelector('.section-jeu');
    let colors = [
        "linear-gradient(120deg,#ff0080,#7928ca)",
        "linear-gradient(120deg,#ffb347,#ff4e45)",
        "linear-gradient(120deg,#00ffea,#ffb347)",
        "linear-gradient(120deg,#ff4e45,#00ffea)",
        "linear-gradient(120deg,#B43A18,#FFB347,#00ffea)"
    ];
    let i = 0;
    let originalBg = sectionJeu.style.background;
    let interval = setInterval(() => {
        sectionJeu.style.background = colors[i % colors.length];
        i++;
    }, 200);
    setTimeout(() => {
        clearInterval(interval);
        sectionJeu.style.background = "";
    }, 5000);
}

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st > 50) {
        navbar.style.transform = "translateY(-100%)";
    } else {
        navbar.style.transform = "translateY(0)";
    }
    lastScrollTop = st <= 0 ? 0 : st;
}, false);

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById("startGameBtn");
    if (startBtn) {
        startBtn.addEventListener("click", startGame);
    }
    document.querySelectorAll('.navbar .milieu a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    window.scrollTo({
                        top: section.offsetTop - 54,
                        behavior: 'smooth'
                    });
                }
                document.querySelectorAll('.navbar .milieu a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    const form = document.querySelector('.insolite-form');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            form.reset();
            const feedback = document.querySelector('.insolite-feedback');
            if(feedback) {
                feedback.style.display = 'block';
                setTimeout(() => { feedback.style.display = 'none'; }, 2500);
            }
        });
    }
    const challengeForm = document.querySelector('.challenge-form');
    if (challengeForm) {
        challengeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            challengeForm.reset();
            const feedback = document.querySelector('.challenge-feedback');
            if (feedback) {
                feedback.style.display = 'block';
                setTimeout(() => { feedback.style.display = 'none'; }, 2500);
            }
        });
    }
});
