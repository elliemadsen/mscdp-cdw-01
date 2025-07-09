(function () {
  let scene, camera, renderer, controls;
  const sprites = [];
  const NUM_SPRITES = 100;
  const BOUNDS = 300;
  const CANVAS_SIZE = 400;
  VELOCITY_MAGNITUDE = 0.2;

  init();
  animate();

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);
    camera.position.z = 200;

    const container = document.getElementById("canvas-container-balls-3d");
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
    container.appendChild(renderer.domElement);

    const texture = createRadialGlowTexture();

    for (let i = 0; i < NUM_SPRITES; i++) {
      const material = new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const sprite = new THREE.Sprite(material);
      const scale = THREE.MathUtils.randFloat(20, 60);
      sprite.scale.set(scale, scale, 1);

      sprite.position.set(
        THREE.MathUtils.randFloatSpread(BOUNDS),
        THREE.MathUtils.randFloatSpread(BOUNDS),
        THREE.MathUtils.randFloatSpread(BOUNDS)
      );

      sprite.userData.velocity = new THREE.Vector3(
        THREE.MathUtils.randFloat(-VELOCITY_MAGNITUDE, VELOCITY_MAGNITUDE),
        THREE.MathUtils.randFloat(-VELOCITY_MAGNITUDE, VELOCITY_MAGNITUDE),
        THREE.MathUtils.randFloat(-VELOCITY_MAGNITUDE, VELOCITY_MAGNITUDE)
      );

      scene.add(sprite);
      sprites.push(sprite);
    }

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 1000;
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    sprites.forEach((sprite) => {
      sprite.position.add(sprite.userData.velocity);

      ["x", "y", "z"].forEach((axis) => {
        if (Math.abs(sprite.position[axis]) > BOUNDS) {
          sprite.userData.velocity[axis] *= -1;
        }
      });

      const dist = sprite.position.distanceTo(camera.position);
      if (dist < 100) {
        const dir = sprite.position.clone().sub(camera.position).normalize();
        sprite.userData.velocity.add(dir.multiplyScalar(0.05));
      }
    });

    renderer.render(scene, camera);
  }

  // radial gradient with alpha from center to edge
  function createRadialGlowTexture() {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }
})();
