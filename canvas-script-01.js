var sketch1 = function circlesSketch(p) {
  let num_circles = 100;
  let min_rad = 10;
  let max_rad = 40;
  let circles = [];

  const CANVAS_SZ = 400;
  const MAX_RANDOM_SPEED = 0.3; // Slow random movement
  const DAMPING = 0.98; // Reduces speed over time
  const REPULSION_RADIUS = 150; // How far the mouse influence extends
  const MAX_REPULSION_FORCE = 1; // Max force to push circles away

  class Circle {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.vx = p.random(-MAX_RANDOM_SPEED, MAX_RANDOM_SPEED);
      this.vy = p.random(-MAX_RANDOM_SPEED, MAX_RANDOM_SPEED);
    }

    // Update circle position and apply forces
    update() {
      // Apply random movement
      this.vx += p.random(-0.1, 0.1);
      this.vy += p.random(-0.1, 0.1);

      // Apply damping
      this.vx *= DAMPING;
      this.vy *= DAMPING;

      // Mouse repulsion
      // Check if mouse is on canvas (within its bounds)
      if (
        p.mouseX >= 0 &&
        p.mouseX <= p.width &&
        p.mouseY >= 0 &&
        p.mouseY <= p.height
      ) {
        let d = p.dist(p.mouseX, p.mouseY, this.x, this.y);
        if (d < REPULSION_RADIUS) {
          let angle = p.atan2(this.y - p.mouseY, this.x - p.mouseX);
          // Map distance to force: closer = stronger force, further = weaker force
          let force = p.map(d, 0, REPULSION_RADIUS, MAX_REPULSION_FORCE, 0);

          this.vx += p.cos(angle) * force;
          this.vy += p.sin(angle) * force;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // Boundary checking (bounce off edges)
      if (this.x - this.r < 0 || this.x + this.r > p.width) {
        this.vx *= -1; // Reverse horizontal velocity
        // Ensure it stays within bounds after bounce
        this.x = p.constrain(this.x, this.r, p.width - this.r);
      }
      if (this.y - this.r < 0 || this.y + this.r > p.height) {
        this.vy *= -1; // Reverse vertical velocity
        // Ensure it stays within bounds after bounce
        this.y = p.constrain(this.y, this.r, p.height - this.r);
      }
    }

    // Draw the circle with a radial gradient
    display() {
      p.noStroke();

      // Create a radial gradient for the fill
      // Parameters: x0, y0, r0, x1, y1, r1
      // x0, y0, r0: starting circle (center, radius 0)
      // x1, y1, r1: ending circle (center, full radius)
      let gradient = p.drawingContext.createRadialGradient(
        this.x,
        this.y,
        0, // Start gradient from the center with radius 0
        this.x,
        this.y,
        this.r // End gradient at the circle's edge with its full radius
      );

      // Add color stops for the gradient
      // Stop 0: At the center, mostly opaque white
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      // Stop 1: At the edge, fully transparent white
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");

      p.drawingContext.fillStyle = gradient;

      p.drawingContext.beginPath();
      p.drawingContext.arc(this.x, this.y, this.r, 0, p.TWO_PI);
      p.drawingContext.fill();
    }
  }

  p.setup = function () {
    let cnv = p.createCanvas(CANVAS_SZ, CANVAS_SZ);
    // Attach the canvas to its parent container (if provided)
    if (p.canvas.parentElement) {
      // Check if parent is set during instantiation
      cnv.parent(p.canvas.parentElement.id);
    }
    p.background(0);

    for (let i = 0; i < num_circles; i++) {
      let r = p.random(min_rad, max_rad);
      let x = p.random(r, p.width - r);
      let y = p.random(r, p.height - r);
      circles.push(new Circle(x, y, r));
    }
  };

  p.draw = function () {
    p.background(0);

    for (let circle of circles) {
      circle.update();
      circle.display();
    }
  };
};

var canvas1 = new p5(sketch1, "canvas-container-1");
