const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;

const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    speed: 0,
    rotationSpeed: 0.05,
    maxSpeed: 5,
    friction: 0.98,
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-5, 5);
        ctx.lineTo(5, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    update() {
        this.speed *= this.friction;
        this.x += Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
};

const asteroids = [];
const bullets = [];
const asteroidCount = 5;

for (let i = 0; i < asteroidCount; i++) {
    asteroids.push(createAsteroid());
}

function createAsteroid() {
    const radius = Math.random() * 30 + 20;
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        draw() {
            ctx.fillStyle = 'gray';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        },
        update() {
            this.x += Math.sin(this.angle) * this.speed;
            this.y -= Math.cos(this.angle) * this.speed;

            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
    };
}

function update() {
    ship.update();

    // Update bullets
    bullets.forEach(bullet => {
        bullet.update();
    });

    // Update asteroids and check for collisions
    asteroids.forEach(asteroid => {
        asteroid.update();
        if (checkCollision(asteroid, ship)) {
            alert("Game Over! Your score: " + score);
            document.location.reload();
        }
    });

    // Check bullet collisions with asteroids
    bullets.forEach((bullet, bulletIndex) => {
        asteroids.forEach((asteroid, asteroidIndex) => {
            if (checkCollision(bullet, asteroid)) {
                score += 10;
                scoreDisplay.textContent = "Score: " + score;
                bullets.splice(bulletIndex, 1);
                asteroids.splice(asteroidIndex, 1);
                asteroids.push(createAsteroid());
            }
        });
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.draw();
    bullets.forEach(bullet => {
        bullet.draw();
    });
    asteroids.forEach(asteroid => {
        asteroid.draw();
    });

    requestAnimationFrame(update);
}

function checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj1.radius + (obj2.radius || 10); // 10 is the ship's radius
}

function keyDownHandler(event) {
    if (event.key === 'ArrowLeft') {
        ship.angle -= ship.rotationSpeed;
    } else if (event.key === 'ArrowRight') {
        ship.angle += ship.rotationSpeed;
    } else if (event.key === 'ArrowUp') {
        if (ship.speed < ship.maxSpeed) {
            ship.speed += 0.2;
        }
    } else if (event.key === ' ') {
        bullets.push(createBullet());
    }
}

function createBullet() {
    return {
        x: ship.x,
        y: ship.y,
        angle: ship.angle,
        speed: 10,
        radius: 5,
        update() {
            this.x += Math.sin(this.angle) * this.speed;
            this.y -= Math.cos(this.angle) * this.speed;

            // Remove bullet if out of bounds
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                bullets.splice(bullets.indexOf(this), 1);
            }
        },
        draw() {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    };
}

document.addEventListener('keydown', keyDownHandler);
update();
