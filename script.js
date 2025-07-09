let threeDBoxContainer;
let p5MouseContainer;

// --- Initialization on DOM Content Loaded ---
document.addEventListener("DOMContentLoaded", () => {
  threeDBoxContainer = document.getElementById("box-container");
  p5MouseContainer = document.getElementById("canvas-container");

  initThreeDBox();
  initP5Mouse();
  positionObjectsRandomly();

  threeDBoxContainer.addEventListener(
    "click",
    () => (window.location.href = "box.html")
  );
  p5MouseContainer.addEventListener(
    "click",
    () => (window.location.href = "canvas.html")
  );

  window.addEventListener("resize", positionObjectsRandomly);
});

// --- Object Positioning Function ---
function positionObjectsRandomly() {
  const buffer = 50; // Minimum distance from window edges
  const mainContentElement = document.querySelector(".main-content");
  const mainContentRect = mainContentElement.getBoundingClientRect();

  const availableBottom = window.innerHeight;
  const availableRight = window.innerWidth;

  // Define objects to position, including their current calculated dimensions
  // Use offsetWidth/Height to get the full rendered size including padding/labels
  const objectsToPosition = [
    {
      element: threeDBoxContainer,
      width: threeDBoxContainer.offsetWidth,
      height: threeDBoxContainer.offsetHeight,
    },
    {
      element: p5MouseContainer,
      width: p5MouseContainer.offsetWidth,
      height: p5MouseContainer.offsetHeight,
    },
  ];

  // Store bounding rectangles of already placed objects
  const placedObjectRects = [];

  objectsToPosition.forEach((obj) => {
    let x, y;
    let attempts = 0;
    const maxAttempts = 200;

    do {
      // Generate random coordinates within the available bounds
      x = Math.random() * (availableRight - obj.width - 2 * buffer) + buffer;
      y = Math.random() * (availableBottom - obj.height - 2 * buffer) + buffer;
      attempts++;

      // Create a rectangle object for the current potential position
      const currentObjRect = {
        left: x,
        right: x + obj.width,
        top: y,
        bottom: y + obj.height,
      };

      // Check for overlap with the main content area
      const overlapsMainContent =
        currentObjRect.left < mainContentRect.right &&
        currentObjRect.right > mainContentRect.left &&
        currentObjRect.top < mainContentRect.bottom &&
        currentObjRect.bottom > mainContentRect.top;

      // Check for overlap with any objects already successfully placed
      let overlapsOtherObjects = false;
      for (const placedRect of placedObjectRects) {
        if (
          currentObjRect.left < placedRect.right &&
          currentObjRect.right > placedRect.left &&
          currentObjRect.top < placedRect.bottom &&
          currentObjRect.bottom > placedRect.top
        ) {
          overlapsOtherObjects = true;
          break; // Overlap found, break and try new position
        }
      }

      // If no overlaps, this is a valid position
      if (!overlapsMainContent && !overlapsOtherObjects) {
        obj.element.style.left = `${x}px`;
        obj.element.style.top = `${y}px`;
        placedObjectRects.push(currentObjRect);
        break;
      }
    } while (attempts < maxAttempts);

    // Fallback if a non-overlapping position couldn't be found
    if (attempts === maxAttempts) {
      console.warn(
        `Could not find a non-overlapping position for ${obj.element.id} after ${maxAttempts} attempts.`
      );
      // As a last resort, just place it randomly without overlap check
      obj.element.style.left = `${
        Math.random() * (window.innerWidth - obj.width)
      }px`;
      obj.element.style.top = `${
        Math.random() * (window.innerHeight - obj.height)
      }px`;
    }
  });
}

// --- Three.js 3D Box Logic ---
function initThreeDBox() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    threeDBoxContainer.clientWidth / threeDBoxContainer.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
  renderer.setSize(
    threeDBoxContainer.clientWidth,
    threeDBoxContainer.clientHeight
  );
  threeDBoxContainer.insertBefore(
    renderer.domElement,
    threeDBoxContainer.firstChild
  );

  // Create a wireframe box
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff }); // White lines
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, material);
  scene.add(line);

  camera.position.z = 2;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    line.rotation.x += 0.005;
    line.rotation.y += 0.008;
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resize for Three.js canvas
  window.addEventListener("resize", () => {
    camera.aspect =
      threeDBoxContainer.clientWidth / threeDBoxContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      threeDBoxContainer.clientWidth,
      threeDBoxContainer.clientHeight
    );
  });
}

// --- p5.js 3D Rotating Plane Logic ---
function initP5Mouse() {
  let p5Sketch = new p5((sketch) => {
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    sketch.setup = () => {
      // Create canvas within the p5MouseContainer using WEBGL renderer
      const canvas = sketch.createCanvas(
        p5MouseContainer.clientWidth,
        p5MouseContainer.clientHeight,
        sketch.WEBGL
      );
      canvas.parent("canvas-container");
      p5MouseContainer.insertBefore(canvas.elt, p5MouseContainer.firstChild);
    };

    sketch.draw = () => {
      sketch.clear();
      sketch.stroke(255);
      sketch.strokeWeight(1);
      sketch.noFill();

      sketch.rotateX(angleX);
      sketch.rotateY(angleY);
      sketch.rotateZ(angleZ);

      let planeSize = Math.min(sketch.width, sketch.height) * 0.7;

      // Draw the 3D plane (a simple square)
      sketch.plane(planeSize);

      // Increment angles for rotation
      angleX += 0.01;
      angleY += 0.015;
      angleZ += 0.008;
    };

    // Handle window resize for p5.js canvas
    sketch.windowResized = () => {
      sketch.resizeCanvas(
        p5MouseContainer.clientWidth,
        p5MouseContainer.clientHeight
      );
    };
  });
}
