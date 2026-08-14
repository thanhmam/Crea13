// ==== Engine 3D dùng chung cho các game rèn luyện tư duy ====
// Bọc Three.js: overlay toàn màn hình, sân khấu 3D, vòng lặp render, dọn dẹp.
import * as THREE from "../../vendor/three.module.min.js";
export { THREE };

/* ---------- Tiện ích texture ---------- */

// Vầng sáng tròn (dùng làm quầng glow quanh quả cầu ý tưởng)
let _glowTex = null;
export function glowTexture() {
  if (_glowTex) return _glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d").createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  const ctx = c.getContext("2d");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  _glowTex = new THREE.CanvasTexture(c);
  return _glowTex;
}

// Nhãn chữ (tiếng Việt có dấu) vẽ lên canvas rồi làm sprite
export function makeLabel(text, opts = {}) {
  const { color = "#ffffff", size = 44, maxChars = 26, bg = "rgba(10,12,26,0.72)" } = opts;
  let t = String(text);
  if (t.length > maxChars) t = t.slice(0, maxChars - 1) + "…";
  const pad = 18;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  const font = `600 ${size}px system-ui, "Segoe UI", Roboto, Arial, sans-serif`;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(t).width) + pad * 2;
  const h = size + pad * 2;
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  x.font = font;
  x.fillStyle = bg;
  roundRect(x, 0, 0, w, h, 14);
  x.fill();
  x.fillStyle = color;
  x.textBaseline = "middle";
  x.fillText(t, pad, h / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  spr.userData.aspect = w / h;
  spr.scale.set((w / h) * 0.9, 0.9, 1);
  spr.userData.dispose = () => { tex.dispose(); spr.material.dispose(); };
  return spr;
}

// Giữ nhãn có kích thước gần như cố định trên màn hình.
// Không có bước này, phối cảnh phóng to nhãn của vật ở gần camera thành khổng lồ.
const _wp = new THREE.Vector3();
export function keepLabelScreenSize(label, camera, screenHeight = 0.03) {
  label.getWorldPosition(_wp);
  const h = camera.position.distanceTo(_wp) * screenHeight;
  label.scale.set((label.userData.aspect || 4) * h, h, 1);
  return h;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------- Overlay game ---------- */

// Tạo lớp phủ toàn màn hình chứa canvas + HUD.
// Trả về { root, host, hud, close } — game tự đổ nội dung vào hud.
export function createOverlay({ title, onClose }) {
  const root = document.createElement("div");
  root.className = "game-overlay";
  root.innerHTML = `
    <div class="game-canvas-host"></div>
    <div class="game-vignette"></div>
    <div class="game-hud">
      <div class="game-topbar">
        <span class="game-title">${title}</span>
        <button class="game-exit" title="Thoát (Esc)">✕ Thoát</button>
      </div>
      <div class="game-layer"></div>
    </div>`;
  document.body.appendChild(root);
  document.body.classList.add("game-open");

  const close = () => {
    if (!root.isConnected) return;
    document.body.classList.remove("game-open");
    document.removeEventListener("keydown", onKey);
    root.remove();
    onClose && onClose();
  };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  root.querySelector(".game-exit").addEventListener("click", close);

  return {
    root,
    host: root.querySelector(".game-canvas-host"),
    layer: root.querySelector(".game-layer"),
    vignette: root.querySelector(".game-vignette"),
    close,
  };
}

/* ---------- Sân khấu 3D ---------- */

export function createStage(host, opts = {}) {
  const { cameraZ = 16, fog = 0x05060f } = opts;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth || window.innerWidth, host.clientHeight || window.innerHeight);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(fog);
  scene.fog = new THREE.FogExp2(fog, 0.022);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  camera.position.set(0, 2.2, cameraZ);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0x8899ff, 0.55));
  const key = new THREE.PointLight(0xffffff, 120, 90);
  key.position.set(6, 10, 12);
  scene.add(key);

  // Nền sao
  const starGeo = new THREE.BufferGeometry();
  const N = 1400, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 60 + Math.random() * 90;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x9fb0ff, size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.8 }));
  scene.add(stars);

  // Xoay cảnh bằng chuột / chạm
  const rig = new THREE.Group();
  scene.add(rig);
  let dragging = false, px = 0, py = 0;
  const target = { yaw: 0, pitch: 0 };
  const cur = { yaw: 0, pitch: 0 };
  const el = renderer.domElement;
  const down = (e) => { dragging = true; px = e.clientX ?? e.touches[0].clientX; py = e.clientY ?? e.touches[0].clientY; };
  const move = (e) => {
    const cx = e.clientX ?? (e.touches && e.touches[0].clientX);
    const cy = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (cx == null) return;
    pointer.x = (cx / el.clientWidth) * 2 - 1;
    pointer.y = -(cy / el.clientHeight) * 2 + 1;
    if (!dragging) return;
    target.yaw += (cx - px) * 0.005;
    target.pitch = Math.max(-0.6, Math.min(0.6, target.pitch + (cy - py) * 0.003));
    px = cx; py = cy;
  };
  const up = () => (dragging = false);
  el.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);

  const pointer = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();

  function resize() {
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // Vòng lặp
  const frameCbs = [];
  let raf = null, last = performance.now(), running = false;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    cur.yaw += (target.yaw - cur.yaw) * 0.08;
    cur.pitch += (target.pitch - cur.pitch) * 0.08;
    rig.rotation.y = cur.yaw;
    rig.rotation.x = cur.pitch;
    stars.rotation.y += dt * 0.006;
    for (const cb of frameCbs) cb(dt, now / 1000);
    renderer.render(scene, camera);
  }
  function start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  function pick(objects) {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(objects, true);
  }

  function dispose() {
    stop();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    el.removeEventListener("pointerdown", down);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      }
    });
    renderer.dispose();
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  return { THREE, scene, camera, renderer, rig, pointer, raycaster, pick, onFrame: (cb) => frameCbs.push(cb), start, stop, dispose, autoRotate: target };
}

/* ---------- Hiệu ứng dùng chung ---------- */

// Vụ nổ hạt tại một điểm
export function burst(parent, position, color, count = 40, speed = 6) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const vel = [];
  for (let i = 0; i < count; i++) {
    pos[i * 3] = position.x; pos[i * 3 + 1] = position.y; pos[i * 3 + 2] = position.z;
    const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(speed * (0.4 + Math.random()));
    vel.push(v);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color, size: 0.34, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(geo, mat);
  parent.add(pts);
  let life = 0;
  pts.userData.tick = (dt) => {
    life += dt;
    const arr = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      vel[i].multiplyScalar(0.94);
      arr[i * 3] += vel[i].x * dt;
      arr[i * 3 + 1] += vel[i].y * dt;
      arr[i * 3 + 2] += vel[i].z * dt;
    }
    geo.attributes.position.needsUpdate = true;
    mat.opacity = Math.max(0, 1 - life / 1.1);
    if (life > 1.1) {
      parent.remove(pts); geo.dispose(); mat.dispose();
      return true; // xong
    }
    return false;
  };
  return pts;
}

// Bộ quản lý hiệu ứng tạm thời
export function effectPool() {
  const items = [];
  return {
    add: (o) => items.push(o),
    tick: (dt) => {
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].userData.tick && items[i].userData.tick(dt)) items.splice(i, 1);
      }
    },
  };
}

// Âm thanh nhẹ bằng WebAudio (không cần file)
export function blip(freq = 440, dur = 0.09, type = "sine", gain = 0.05) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    blip._ctx = blip._ctx || new AC();
    const ctx = blip._ctx;
    if (ctx.state === "suspended") ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
  } catch {}
}
