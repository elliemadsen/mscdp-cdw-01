let vibeCodeContainer;
let spatialCanvasContainer;
let temporalStructureContainer;
let relationalStructureContainer;
let geospatialStructureContainer;
let engagementContainer;

// --- Initialization on DOM Content Loaded ---
document.addEventListener("DOMContentLoaded", () => {
  vibeCodeContainer = document.getElementById("vibe-code-container");
  spatialCanvasContainer = document.getElementById("spatial-canvas-container");
  temporalStructureContainer = document.getElementById(
    "temporal-structure-container"
  );
  relationalStructureContainer = document.getElementById(
    "relational-structure-container"
  );
  geospatialStructureContainer = document.getElementById(
    "geospatial-structure-container"
  );
  engagementContainer = document.getElementById("engagement-container");

  initVibeCodeObj();
  initSpatialCanvasObj();
  initTemporalStructureObj();
  initRelationalStructureObj();
  initGeospatialStructureObj();
  initEngagementObj();
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
  relationalStructureContainer.addEventListener(
    "click",
    () => (window.location.href = "05_relational_structure.html")
  );
  geospatialStructureContainer.addEventListener(
    "click",
    () => (window.location.href = "06_geospatial_structure.html")
  );
  engagementContainer.addEventListener(
    "click",
    () => (window.location.href = "07_engagement.html")
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
    {
      element: relationalStructureContainer,
      width: relationalStructureContainer.offsetWidth,
      height: relationalStructureContainer.offsetHeight,
    },
    {
      element: geospatialStructureContainer,
      width: geospatialStructureContainer.offsetWidth,
      height: geospatialStructureContainer.offsetHeight,
    },
    {
      element: engagementContainer,
      width: engagementContainer.offsetWidth,
      height: engagementContainer.offsetHeight,
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

function initRelationalStructureObj() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    relationalStructureContainer.clientWidth /
      relationalStructureContainer.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    relationalStructureContainer.clientWidth,
    relationalStructureContainer.clientHeight
  );
  relationalStructureContainer.insertBefore(
    renderer.domElement,
    relationalStructureContainer.firstChild
  );

  // Define 6 nodes in 3D space (vertices of an octahedron for visual clarity)
  const nodePositions = [
    [1.2, 0, 0],
    [-1.2, 0, 0],
    [0, 1.2, 0],
    [0, -1.2, 0],
    [0, 0, 1.2],
    [0, 0, -1.2],
  ];

  // Draw nodes (spheres)
  const nodeGeometry = new THREE.SphereGeometry(0.13, 16, 16);
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });
  const nodeMeshes = [];
  nodePositions.forEach((pos) => {
    const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
    mesh.position.set(pos[0], pos[1], pos[2]);
    scene.add(mesh);
    nodeMeshes.push(mesh);
  });

  // Draw edges (octahedron edges)
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const edges = [
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 5],
  ];
  edges.forEach(([a, b]) => {
    const points = [
      new THREE.Vector3(...nodePositions[a]),
      new THREE.Vector3(...nodePositions[b]),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, edgeMaterial);
    scene.add(line);
  });

  camera.position.z = 4;

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.012;
    scene.rotation.x += 0.009;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect =
      relationalStructureContainer.clientWidth /
      relationalStructureContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      relationalStructureContainer.clientWidth,
      relationalStructureContainer.clientHeight
    );
  });
}

function initGeospatialStructureObj() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    geospatialStructureContainer.clientWidth /
      geospatialStructureContainer.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    geospatialStructureContainer.clientWidth,
    geospatialStructureContainer.clientHeight
  );
  geospatialStructureContainer.insertBefore(
    renderer.domElement,
    geospatialStructureContainer.firstChild
  );

  const borderGeometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(2, 2));
  const border = new THREE.LineSegments(
    borderGeometry,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  scene.add(border);

  // Create a "blob" shape in the middle using a deformed circle
  const blobShape = new THREE.Shape();
  const points = [];
  const blobRadius = 0.45;
  const blobSegments = 32;
  for (let i = 0; i <= blobSegments; i++) {
    const angle = (i / blobSegments) * Math.PI * 2;
    // Add some noise to the radius for a blobby effect
    const noise = 0.13 * Math.sin(5 * angle + Math.cos(angle * 2));
    const r = blobRadius + noise;
    points.push(new THREE.Vector2(Math.cos(angle) * r, Math.sin(angle) * r));
  }
  blobShape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    blobShape.lineTo(points[i].x, points[i].y);
  }
  const blobGeometry = new THREE.ShapeGeometry(blobShape);
  const blobMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
  const blobMesh = new THREE.Mesh(blobGeometry, blobMaterial);
  blobMesh.position.set(0, 0, 0.01); // Slightly above the plane
  scene.add(blobMesh);

  camera.position.z = 3;

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.012;
    scene.rotation.x += 0.004;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect =
      geospatialStructureContainer.clientWidth /
      geospatialStructureContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      geospatialStructureContainer.clientWidth,
      geospatialStructureContainer.clientHeight
    );
  });
}

function initEngagementObj() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    engagementContainer.clientWidth / engagementContainer.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    engagementContainer.clientWidth,
    engagementContainer.clientHeight
  );
  engagementContainer.insertBefore(
    renderer.domElement,
    engagementContainer.firstChild
  );

  function addWireFlower(x, y, scale = 1, petalCount = 6) {
    const petalMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    const petalRadius = 0.19 * scale;
    const petalLength = 0.22 * scale;
    const petalWidth = 0.09 * scale;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalCurve = [];
      for (let j = 0; j <= 16; j++) {
        const t = (j / 16) * Math.PI;
        const px0 = Math.cos(t) * petalWidth;
        const py0 = Math.sin(t) * petalLength + petalRadius;
        const px = Math.cos(angle) * px0 - Math.sin(angle) * py0 + x;
        const py = Math.sin(angle) * px0 + Math.cos(angle) * py0 + y;
        petalCurve.push(new THREE.Vector3(px, py, 0));
      }
      for (let j = 16; j >= 0; j--) {
        const t = (j / 16) * Math.PI;
        const px0 = Math.cos(Math.PI - t) * petalWidth;
        const py0 = Math.sin(Math.PI - t) * petalLength + petalRadius;
        const px = Math.cos(angle) * px0 - Math.sin(angle) * py0 + x;
        const py = Math.sin(angle) * px0 + Math.cos(angle) * py0 + y;
        petalCurve.push(new THREE.Vector3(px, py, 0));
      }
      const petalGeometry = new THREE.BufferGeometry().setFromPoints(
        petalCurve
      );
      const petalLine = new THREE.Line(petalGeometry, petalMaterial);
      scene.add(petalLine);
    }

    const centerSteps = 32;
    const centerRadius = 0.07 * scale;
    const centerPoints = [];
    for (let i = 0; i <= centerSteps; i++) {
      const theta = (i / centerSteps) * Math.PI * 2;
      centerPoints.push(
        new THREE.Vector3(
          x + Math.cos(theta) * centerRadius,
          y + Math.sin(theta) * centerRadius,
          0
        )
      );
    }
    const centerGeometry = new THREE.BufferGeometry().setFromPoints(
      centerPoints
    );
    const centerCircle = new THREE.Line(centerGeometry, petalMaterial);
    scene.add(centerCircle);
  }

  addWireFlower(-0.4, -0.4, 1, 6);
  addWireFlower(-0.1, 0.2, 0.6, 6);
  addWireFlower(0.4, 0.1, 0.5, 6);

  camera.position.z = 2.5;

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.01;
    scene.rotation.x += 0.004;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect =
      engagementContainer.clientWidth / engagementContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      engagementContainer.clientWidth,
      engagementContainer.clientHeight
    );
  });
}
