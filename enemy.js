export class Enemy {
  constructor(x, y, radius, context, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.c = context;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.c.fillStyle = this.color;
    this.c.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
