const friction = 0.99;
export class Particle {
  constructor(x, y, radius, context, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.c = context;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    this.c.save();
    this.c.globalAlpha = this.alpha;
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.c.fillStyle = this.color;
    this.c.fill();
    this.c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}
