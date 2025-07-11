let vibeCodeContainer;
let spatialCanvasContainer;
let temporalStructureContainer;

// --- Initialization on DOM Content Loaded ---
document.addEventListener("DOMContentLoaded", () => {
  vibeCodeContainer = document.getElementById("vibe-code-container");
  spatialCanvasContainer = document.getElementById("spatial-canvas-container");
  temporalStructureContainer = document.getElementById(
    "temporal-structure-container"
  );

  initVibeCodeObj();
  initSpatialCanvasObj();
  initTemporalStructureObj();
  positionObjectsRandomly();

  vibeCodeContainer.addEventListener(
    "click",
    () => (window.location.href = "02_vibe_code.html")
  );
  spatialCanvasContainer.addEventListener(
    "click",
    () => (window.location.href = "03_spatial_canvas.html")
  );
  temporalStructureContainer.addEventListener(
    "click",
    () => (window.location.href = "04_temporal_structure.html")
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
      element: vibeCodeContainer,
      width: vibeCodeContainer.offsetWidth,
      height: vibeCodeContainer.offsetHeight,
    },
    {
      element: spatialCanvasContainer,
      width: spatialCanvasContainer.offsetWidth,
      height: spatialCanvasContainer.offsetHeight,
    },
    {
      element: temporalStructureContainer,
      width: temporalStructureContainer.offsetWidth,
      height: temporalStructureContainer.offsetHeight,
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

function initVibeCodeObj() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    vibeCodeContainer.clientWidth / vibeCodeContainer.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
  renderer.setSize(
    vibeCodeContainer.clientWidth,
    vibeCodeContainer.clientHeight
  );
  vibeCodeContainer.insertBefore(
    renderer.domElement,
    vibeCodeContainer.firstChild
  );

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, material);
  scene.add(line);

  camera.position.z = 2;

  function animate() {
    requestAnimationFrame(animate);
    line.rotation.x += 0.005;
    line.rotation.y += 0.008;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect =
      vibeCodeContainer.clientWidth / vibeCodeContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      vibeCodeContainer.clientWidth,
      vibeCodeContainer.clientHeight
    );
  });
}

function initSpatialCanvasObj() {
  const spatialCanvasContainer = document.getElementById(
    "spatial-canvas-container"
  );
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    spatialCanvasContainer.clientWidth / spatialCanvasContainer.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    spatialCanvasContainer.clientWidth,
    spatialCanvasContainer.clientHeight
  );
  spatialCanvasContainer.insertBefore(
    renderer.domElement,
    spatialCanvasContainer.firstChild
  );

  const geometry = new THREE.SphereGeometry(1, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  camera.position.z = 3;

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.012;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect =
      spatialCanvasContainer.clientWidth / spatialCanvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      spatialCanvasContainer.clientWidth,
      spatialCanvasContainer.clientHeight
    );
  });
}

function initTemporalStructureObj() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    temporalStructureContainer.clientWidth /
      temporalStructureContainer.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    temporalStructureContainer.clientWidth,
    temporalStructureContainer.clientHeight
  );
  temporalStructureContainer.insertBefore(
    renderer.domElement,
    temporalStructureContainer.firstChild
  );

  const numBars = 5;
  const barSpacing = 1;
  const barHeights = [2, 1.7, 1.3, 1.5];
  const barWidth = 0.7;
  const barDepth = 0.6;

  for (let i = 0; i < numBars; i++) {
    const geometry = new THREE.BoxGeometry(barWidth, barHeights[i], barDepth);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, material);
    line.position.x = (i - (numBars - 1) / 2) * barSpacing;
    line.position.y = barHeights[i] / 2 - 0.7;
    scene.add(line);
  }

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.x += 0.01;
    scene.rotation.y += 0.012;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect =
      temporalStructureContainer.clientWidth /
      temporalStructureContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      temporalStructureContainer.clientWidth,
      temporalStructureContainer.clientHeight
    );
  });
}
