var sketch2 = function spinningSpheresSketch(p) {
  let spheres = [];

  const CANVAS_SZ = 400;
  const NUM_SPHERES = 30;
  const MIN_RADIUS = 20;
  const MAX_RADIUS = 80;
  const BASE_ROTATION_SPEED = 0.005; // Default slow rotation speed
  const MAX_MOUSE_ROTATION_SPEED = 0.05; // Max speed when mouse is very close
  const MOUSE_INFLUENCE_RADIUS = 150; // Radius around the mouse for speed influence

  class Sphere {
    /**
     * Represents a single spinning mesh sphere.
     * @param {number} x - Initial X position.
     * @param {number} y - Initial Y position.
     * @param {number} z - Initial Z position.
     * @param {number} r - Radius of the sphere.
     */
    constructor(x, y, z, r) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.r = r;

      // Random initial direction for rotation speeds
      this.rotXDirection = p.random() > 0.5 ? 1 : -1;
      this.rotYDirection = p.random() > 0.5 ? 1 : -1;
      this.rotZDirection = p.random() > 0.5 ? 1 : -1;

      this.rotX = p.random(p.TWO_PI);
      this.rotY = p.random(p.TWO_PI);
      this.rotZ = p.random(p.TWO_PI);

      this.currentRotSpeed = BASE_ROTATION_SPEED;
    }

    /**
     * Updates the rotation angles of the sphere based on mouse proximity.
     * @param {p5.Vector} mousePos
     */
    update(mousePos) {
      // Calculate distance to mouse (only if mouse is on canvas)
      let d = Infinity;
      if (
        mousePos.x >= 0 &&
        mousePos.x <= p.width &&
        mousePos.y >= 0 &&
        mousePos.y <= p.height
      ) {
        // IMPORTANT: Convert mouseX/mouseY to WEBGL coordinates (relative to center)
        let mouseX_webgl = mousePos.x - p.width / 2;
        let mouseY_webgl = mousePos.y - p.height / 2;

        // Use 2D distance for mouse interaction as spheres are positioned in 3D but mouse is 2D
        d = p.dist(mouseX_webgl, mouseY_webgl, this.x, this.y);
      }

      // Map distance to rotation speed
      // Closer to mouse (0 distance) -> MAX_MOUSE_ROTATION_SPEED
      // Further from mouse (MOUSE_INFLUENCE_RADIUS or more) -> BASE_ROTATION_SPEED
      this.currentRotSpeed = p.map(
        d,
        0,
        MOUSE_INFLUENCE_RADIUS,
        MAX_MOUSE_ROTATION_SPEED,
        BASE_ROTATION_SPEED,
        true
      );
      // 'true' clamps the value between MAX_MOUSE_ROTATION_SPEED and BASE_ROTATION_SPEED

      // Update rotation angles using the dynamic speed
      this.rotX += this.currentRotSpeed * this.rotXDirection;
      this.rotY += this.currentRotSpeed * this.rotYDirection;
      this.rotZ += this.currentRotSpeed * this.rotZDirection;
    }

    display() {
      p.push();

      p.translate(this.x, this.y, this.z);

      p.rotateX(this.rotX);
      p.rotateY(this.rotY);
      p.rotateZ(this.rotZ);

      p.stroke(255);
      p.strokeWeight(1);
      p.noFill();

      p.sphere(this.r);

      p.pop();
    }
  }

  p.setup = function () {
    let canvas = p.createCanvas(CANVAS_SZ, CANVAS_SZ, p.WEBGL);
    // Attach the canvas to its parent container (if provided)
    if (p.canvas.parentElement) {
      // Check if parent is set during instantiation
      canvas.parent(p.canvas.parentElement.id);
    }
    p.background(0);

    spheres = [];

    const gridDim = p.ceil(p.sqrt(NUM_SPHERES));

    // Calculate spacing to fill about 70% of the canvas, centered
    // (gridDim - 1 || 1) handles the case where gridDim is 1 to prevent division by zero
    const spacingX = p.width / (gridDim - 1 || 1);
    const spacingY = (p.height + 100) / (gridDim - 1 || 1);

    // Calculate starting positions to center the grid
    const startX = (-(gridDim - 1) * spacingX) / 2;
    const startY = (-(gridDim - 1) * spacingY) / 2;

    for (let i = 0; i < NUM_SPHERES; i++) {
      let r = p.random(MIN_RADIUS, MAX_RADIUS);

      let col = i % gridDim;
      let row = p.floor(i / gridDim);

      let x = startX + col * spacingX;
      let y = startY + row * spacingY;

      let z = p.random(-100, 100);

      spheres.push(new Sphere(x, y, z, r));
    }
  };

  p.draw = function () {
    p.background(0);

    let mousePos = p.createVector(p.mouseX, p.mouseY);

    for (let sphere of spheres) {
      sphere.update(mousePos);
      sphere.display();
    }
  };
};

var canvas2 = new p5(sketch2, "canvas-container-mesh-2d");
