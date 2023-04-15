export class Player {
  constructor(x, y, radius, context, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.c = context;
    this.color = color;
  }

  draw() {
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.c.fillStyle = this.color;
    this.c.fill();
  }
}
