import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, camera, renderer;

// Pivot that sits at the camera position (we scale THIS)
let roomPivot = null;

// Room container (GLB lives inside this)
let roomContainer = null;

// Lights (static)
let hemiLight, ceilingLight, ambientLight, fillLight;

// Audio
let audioStarted = false;
let analyser, timeData, lowpass;

const GLB_PATH = "./assets/Room.glb";
const SOUND_PATH = "./assets/talking_sound.mp3";

// Look controls
let isDragging = false;
let lastX = 0;
let lastY = 0;
let yaw = 0;
let pitch = 0;
const DRAG_SENSITIVITY = 0.006;
const PITCH_LIMIT = Math.PI / 2 - 0.08;

// These values control how the room reacts to the audio.

const VOLUME_BOOST = 7.0;   // Amplifies the incoming sound signal.
const CURVE = 0.25;         // Controls sensitivity of the volume mapping.
const ATTACK = 0.55;        // How fast the room reacts to louder sound.
const RELEASE = 0.10;       // How fast it relaxes when sound drops.
const MIN_SCALE = 0.78;     // Smallest size the room can shrink to.
const MAX_SCALE = 1.42;     // Maximum size the room can expand to.
const WOBBLE = 0.04;        // Adds slight vibration for tension effect.

let env = 0;                // Smoothed audio envelope (0–1).
let roomBaseScale = 1;      // Default room scale before audio changes.

init();                     // Initializes scene setup.
loadRoom();                 // Loads the 3D room model.
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    200
  );
  camera.position.set(0, 1.6, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);

  // ---------- STATIC LIGHTS ----------
  hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.6);
  scene.add(hemiLight);

  ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  ceilingLight = new THREE.PointLight(0xffffff, 3.2, 80);
  ceilingLight.position.set(0, 2.4, 0);
  scene.add(ceilingLight);

  fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(2, 2, 2);
  scene.add(fillLight);

  window.addEventListener("resize", onResize);

  // Click starts audio
  window.addEventListener("click", async () => {
    if (!audioStarted) {
      try {
        await startAudio();
        audioStarted = true;
        const hint = document.getElementById("hint");
        if (hint) hint.remove();
      } catch (err) {
        console.error("Audio failed:", err);
      }
    }
  });

  // DEBUG: press T to force a visible squeeze (no audio needed)
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t" && roomPivot) {
      const s = roomPivot.scale.x < 0.9 ? 1.0 : 0.35;
      applyScaleAroundCamera(s);
      console.log("TEST scale:", s);
    }
  });

  // Drag to rotate
  renderer.domElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener("mouseup", () => (isDragging = false));

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    yaw -= dx * DRAG_SENSITIVITY;
    pitch -= dy * DRAG_SENSITIVITY;

    yaw = wrapPI(yaw);
    pitch = clamp(pitch, -PITCH_LIMIT, PITCH_LIMIT);

    camera.rotation.set(pitch, yaw, 0, "YXZ");
  });

  // Touch
  renderer.domElement.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener("touchend", () => (isDragging = false));

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - lastX;
      const dy = y - lastY;
      lastX = x;
      lastY = y;

      yaw -= dx * DRAG_SENSITIVITY;
      pitch -= dy * DRAG_SENSITIVITY;

      yaw = wrapPI(yaw);
      pitch = clamp(pitch, -PITCH_LIMIT, PITCH_LIMIT);

      camera.rotation.set(pitch, yaw, 0, "YXZ");
    },
    { passive: true }
  );
}

function loadRoom() {
  const loader = new GLTFLoader();
  loader.load(
    GLB_PATH,
    (gltf) => {
      // GLB container
      roomContainer = new THREE.Group();
      roomContainer.add(gltf.scene);

      // Ensure inside faces render (for room interiors)
      gltf.scene.traverse((child) => {
        if (!child.isMesh) return;
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
      });

      // --- PIVOT AT CAMERA (key fix) ---
      roomPivot = new THREE.Group();
      roomPivot.position.copy(camera.position); // pivot sits at camera
      scene.add(roomPivot);

      // shift the room so it is now relative to the pivot at the camera
      roomContainer.position.sub(camera.position);

      // parent room under pivot
      roomPivot.add(roomContainer);

      // base scale
      roomBaseScale = 1;

      console.log("GLB loaded ✅ Pivot squeeze ready.");
      console.log("Press 'T' to test squeezing even without audio.");
    },
    undefined,
    (err) => console.error("GLB load error:", err)
  );
}

async function startAudio() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const res = await fetch(SOUND_PATH);
  if (!res.ok) throw new Error("Sound not found: " + SOUND_PATH);

  const buf = await res.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(buf);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  timeData = new Uint8Array(analyser.fftSize);

  // Optional lowpass (AUDIO only)
  lowpass = audioCtx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 700;

  source.connect(analyser);
  analyser.connect(lowpass);
  lowpass.connect(audioCtx.destination);

  source.start(0);
}

// Loudness (RMS time-domain) -> 0..1
function getVolume01() {
  if (!analyser) return 0;

  analyser.getByteTimeDomainData(timeData);

  let sumSq = 0;
  for (let i = 0; i < timeData.length; i++) {
    const x = (timeData[i] - 128) / 128;
    sumSq += x * x;
  }
  const rms = Math.sqrt(sumSq / timeData.length);

  return clamp(rms * VOLUME_BOOST, 0, 1);
}

// Scale the room around the camera position
// only X/Z scale
function applyScaleAroundCamera(s) {
  if (!roomPivot) return;

  const sc = roomBaseScale * s;

  // Option A: “walls close in” (best feel)
  roomPivot.scale.set(sc, 1.0, sc);

}

function animate() {
  requestAnimationFrame(animate);

  const v = getVolume01();

  // Attack/Release envelope
  if (v > env) env += (v - env) * ATTACK;
  else env += (v - env) * RELEASE;

  // sensitive mapping
  const vv = Math.pow(env, CURVE);

  // Loud -> smaller
  let scale = MAX_SCALE - vv * (MAX_SCALE - MIN_SCALE);

  // Wobble
  if (audioStarted) {
    const t = performance.now() * 0.001;
    const wob =
      (Math.sin(t * 22) * 0.6 + Math.sin(t * 37) * 0.4) * WOBBLE * vv;
    scale = clamp(scale + wob, MIN_SCALE, MAX_SCALE);
  }

  applyScaleAroundCamera(scale);


  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

function wrapPI(angle) {
  const twoPI = Math.PI * 2;
  angle = (angle + Math.PI) % twoPI;
  if (angle < 0) angle += twoPI;
  return angle - Math.PI;
}
