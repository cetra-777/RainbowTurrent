import { Player } from "./player.js";
import { Projectile } from "./projectile.js";
import { Enemy } from "./enemy.js";
import { Particle } from "./particle.js";

// Setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#scoreEl");
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const bigScoreEl = document.querySelector("#bigScoreEl");

// Create Player

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let player = new Player(centerX, centerY, 10, c, "white");

// Create projectile hopper
let projectiles = [];
let particles = [];
let enemies = [];

// Init Function
function init() {
  player = new Player(centerX, centerY, 10, c, "white");
  projectiles = [];
  particles = [];
  enemies = [];
  score = 0;
  scoreEl.innerHTML = score;
  bigScoreEl.innerHTML = score;
}

// Create Enemeies
function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;

    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? -radius : canvas.height + radius;
    }
    const context = c;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

    const angle = Math.atan2(centerY - y, centerX - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    enemies.push(new Enemy(x, y, radius, context, color, velocity));
  }, 1000);
}

// Create Animation Loop
let animationId = undefined;
let score = 0;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
    particle.update();
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();

    // Remove left over projectiles from game
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  // Collision
  enemies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    // end game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      modalEl.style.display = "flex";
      bigScoreEl.innerHTML = score;
    }

    projectiles.forEach((projectile, projectileindex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // Remove enemies on collision
      if (dist - enemy.radius - projectile.radius < 1) {
        // increase score
        score += 100;
        scoreEl.innerHTML = score;
        // Create explosion particles
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              c,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }
        if (enemy.radius - 10 > 5) {
          gsap.to(enemy, { radius: enemy.radius - 10 });
          setTimeout(() => {
            projectiles.splice(projectileindex, 1);
          }, 0);
        } else {
          //remove from scene altogether
          score += 250;
          scoreEl.innerHTML = score;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileindex, 1);
          }, 0);
        }
      }
    });
  });
}

// Event Listeners
addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
  const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
  projectiles.push(new Projectile(centerX, centerY, 5, c, "white", velocity));
});

startGameBtn.addEventListener("click", () => {
  // Start animation loop
  init();
  animate();
  spawnEnemies();
  modalEl.style.display = "none";
});
