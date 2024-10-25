// select editing tools
const editTool = document.getElementById("edit");
const clearButton = document.getElementById("clear");
const heightBuildingEl = document.getElementById("height");
const pitchEl = document.getElementById("pitch");
const validationButton = document.getElementById("validate-btn");

// Init the scene, camera and renderer
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xd9f3ff );
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adjust the camera to make the plan horizontal
camera.position.set(0, -20, 20);
camera.lookAt(0, 0, 0);

// Add the control to allow user to rotate around the scene
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 1.2;
controls.enableZoom = true;
controls.enablePan = true;

// add the plane by requesting a satelite image through google maps api
const API_KEY = "AIzaSyBhhMqiFO7NZgdocTYxmxy68vWZ3u-rFrM";
const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=34.0626616,-118.403738&zoom=21&size=640x640&maptype=satellite&key=${API_KEY}`;

const textureLoader = new THREE.TextureLoader();
// load the image and add it as texture of the plan
const satelliteTexture = textureLoader.load(mapImageUrl);
const planeGeometry = new THREE.PlaneGeometry(50, 30);
const planeMaterial = new THREE.MeshBasicMaterial({
  map: satelliteTexture,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

/***
 * - points: list of the point done by the user by doing mouse click on the plan
 * - editModeEnabled: boolean to indicate if the edit mode is enable
 * - polygone: polygone created by using the points from the mouse click
 * - sphere: the impact of mouse click on the plan
 * - lines: lines between the spheres
 * - segments: segments of the polygone to make the 3d more visible
 */
let points = [];
let editModeEnable = false;
let polygone;
let spheres = [];
let lines = [];
let segments;

// Convert mouse position to normalize coordinates
function convertMousePosition(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  return mouse;
}

// Draw a point on the plane
function drawPoint(point) {
  const geometry = new THREE.SphereGeometry(0.3, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xe31b1b });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(point);
  spheres.push(sphere);

  scene.add(sphere);
}

// draw the polygone
function drawPolygone(points, height, pitch) {
  const shape = new THREE.Shape(points);

  const extrudeSettings = {
    depth: height,
    bevelEnabled: false,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const pitchAngle = THREE.Math.degToRad(pitch);
  geometry.rotateY(pitchAngle);

  const material = new THREE.MeshBasicMaterial({
    color: 0x909090,
    side: THREE.DoubleSide,
  });
  polygone = new THREE.Mesh(geometry, material);

  scene.add(polygone);

  const edges = new THREE.EdgesGeometry(geometry);
  segments = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );

  scene.add(segments);

  for (const sphere_ of spheres) {
    scene.remove(sphere_);
  }
  for (const line_ of lines) {
    scene.remove(line_);
  }
}

// Check if two points have the same intersection point
function pointsIntersect(pointA, pointB, threshold) {
  const distance = pointA.distanceTo(pointB);
  return distance <= threshold;
}

function onMouseClick(event) {
  // Only if we are in edit mode is enabled
  if (editModeEnable) {
    let line;
    const mousePosition = convertMousePosition(event);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, camera);

    const intersectsWithPlane = raycaster.intersectObject(plane);
    if (intersectsWithPlane.length > 0) {
      const point = intersectsWithPlane[0].point;
      drawPoint(point);
      points.push(new THREE.Vector3(point.x, point.y, 0));

      if (points.length > 1) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          linewidth: 5,
        });
        line = new THREE.Line(geometry, lineMaterial);
        lines.push(line);
        scene.add(line);
      }
    }

    /* 
      Draw polygone when the points are closed
      it happen when there is at least 3 points and the current point
      has the same coordinates as the first point
    */
    if (points.length > 0) {
      clearButton.style.display = "flex";
      const last = points[points.length - 1];
      const first = points[0];
      if (points.length >= 3 && pointsIntersect(last, first, 0.5)) {
        editModeEnable = false;
      }
    }
  }
}

window.addEventListener("click", onMouseClick, false);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// editing tools
editTool.addEventListener("click", () => {
  if (editTool.classList.contains("active")) {
    editTool.classList.remove("active");
    editModeEnable = false;
  } else {
    editTool.classList.add("active");
    editModeEnable = true;
  }
});

clearButton.addEventListener("click", () => {
  for (const sphere_ of spheres) {
    scene.remove(sphere_);
  }
  for (const line_ of lines) {
    scene.remove(line_);
  }
  scene.remove(polygone);
  scene.remove(segments);
  points = [];
  clearButton.style.display = "none";
  editModeEnable = true;
});

validationButton.addEventListener("click", () => {
  scene.remove(polygone);
  scene.remove(segments);

  const height = parseInt(heightBuildingEl.value);
  const pitch = parseInt(pitchEl.value);
  const last = points[points.length - 1];
  const first = points[0];
  if (
    !isNaN(height) &&
    !isNaN(pitch) &&
    points.length >= 3 &&
    pointsIntersect(last, first, 0.5)
  ) {
    drawPolygone(points, height, pitch);
    editModeEnable = false;
  }
});

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
