(function () {
  let camera, scene, renderer, controls;
  let objects = [];
  let container;

  const NUM_SPHERES = 400;
  const MIN_RADIUS = 5;
  const MAX_RADIUS = 25;
  const SCENE_BOUNDS = 300;
  const MIN_ROTATION_SPEED = 0.005;
  const MAX_ROTATION_SPEED = 0.02;
  const CANVAS_SIZE = 400;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  container = document.getElementById("canvas-container-mesh-3d");

  camera = new THREE.PerspectiveCamera(
    75, // Field of view
    1, // Aspect ratio (500 / 500 = 1)
    0.1, // Near clipping plane
    3000 // Far clipping plane (increased to see more distant spheres)
  );
  camera.position.set(0, 0, SCENE_BOUNDS * 1.2);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialiasing for smoother edges
  renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
  renderer.setPixelRatio(window.devicePixelRatio); // Handle high-DPI screens
  renderer.setClearColor(0x000000);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white ambient light
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Stronger directional light
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // --- Sphere Generation ---
  for (let i = 0; i < NUM_SPHERES; i++) {
    const radius = THREE.MathUtils.randFloat(MIN_RADIUS, MAX_RADIUS);
    const geometry = new THREE.SphereGeometry(radius, 16, 16); // Sphere geometry
    const material = new THREE.LineBasicMaterial({ color: 0xffffff }); // White lines
    const edges = new THREE.EdgesGeometry(geometry);
    const sphere = new THREE.LineSegments(edges, material);

    // Set random position within scene bounds
    sphere.position.set(
      THREE.MathUtils.randFloatSpread(SCENE_BOUNDS * 2), // -SCENE_BOUNDS to +SCENE_BOUNDS
      THREE.MathUtils.randFloatSpread(SCENE_BOUNDS * 2),
      THREE.MathUtils.randFloatSpread(SCENE_BOUNDS * 2)
    );

    // Store random rotation speeds for each sphere
    sphere.userData.rotationSpeed = {
      x:
        THREE.MathUtils.randFloat(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED) *
        (Math.random() > 0.5 ? 1 : -1),
      y:
        THREE.MathUtils.randFloat(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED) *
        (Math.random() > 0.5 ? 1 : -1),
      z:
        THREE.MathUtils.randFloat(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED) *
        (Math.random() > 0.5 ? 1 : -1),
    };

    scene.add(sphere);
    objects.push(sphere);
  }

  // --- Camera Controls ---
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enable smooth camera movement
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false; // Prevents panning beyond scene limits
  controls.minDistance = 50; // Minimum zoom distance
  controls.maxDistance = SCENE_BOUNDS * 3; // Maximum zoom distance
  controls.target.set(0, 0, 0); // Ensure controls target the center of the scene
  controls.update(); // Update controls immediately after setting target

  function animate() {
    requestAnimationFrame(animate);

    controls.update();

    objects.forEach((sphere) => {
      if (sphere.userData.rotationSpeed) {
        sphere.rotation.x += sphere.userData.rotationSpeed.x;
        sphere.rotation.y += sphere.userData.rotationSpeed.y;
        sphere.rotation.z += sphere.userData.rotationSpeed.z;
      }
    });

    renderer.render(scene, camera);
  }

  animate();
})();
