// ==== Engine 2D dùng chung cho các game rèn luyện tư duy ====
// Mặt phẳng canvas có kéo/thu phóng, vẽ nút dạng viên thuốc, dò trúng đối tượng.

/* ---------- Lớp phủ toàn màn hình ---------- */
export function createOverlay({ title, onClose }) {
  const root = document.createElement("div");
  root.className = "game-overlay";
  root.innerHTML = `
    <canvas class="game-canvas"></canvas>
    <div class="game-hud">
      <div class="game-topbar">
        <span class="game-title">${title}</span>
        <div class="game-steps" id="gSteps"></div>
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
    canvas: root.querySelector(".game-canvas"),
    layer: root.querySelector(".game-layer"),
    steps: root.querySelector("#gSteps"),
    close,
  };
}

/* ---------- Sân khấu 2D ---------- */
export function createStage(canvas) {
  const ctx = canvas.getContext("2d");
  const cam = { x: 0, y: 0, zoom: 1 };
  let dpr = 1, W = 0, H = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }
  window.addEventListener("resize", resize);
  resize();

  // Đổi toạ độ màn hình <-> toạ độ thế giới
  const toWorld = (sx, sy) => ({ x: (sx - W / 2) / cam.zoom + cam.x, y: (sy - H / 2) / cam.zoom + cam.y });
  const toScreen = (wx, wy) => ({ x: (wx - cam.x) * cam.zoom + W / 2, y: (wy - cam.y) * cam.zoom + H / 2 });

  // Kéo nền để di chuyển, lăn chuột để thu phóng
  const handlers = { down: null, move: null, up: null };
  let panning = false, lastX = 0, lastY = 0;
  const pointer = { x: 0, y: 0, wx: 0, wy: 0, down: false };

  function localXY(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  const onDown = (e) => {
    const p = localXY(e);
    pointer.x = p.x; pointer.y = p.y; pointer.down = true;
    const w = toWorld(p.x, p.y);
    pointer.wx = w.x; pointer.wy = w.y;
    lastX = p.x; lastY = p.y;
    canvas.setPointerCapture(e.pointerId);
    // Game được quyền xử lý trước; trả về true nghĩa là "tôi nhận, đừng kéo nền"
    const claimed = handlers.down && handlers.down(w, e);
    panning = !claimed;
  };
  const onMove = (e) => {
    const p = localXY(e);
    pointer.x = p.x; pointer.y = p.y;
    const w = toWorld(p.x, p.y);
    pointer.wx = w.x; pointer.wy = w.y;
    if (panning && pointer.down) {
      camTarget = null; // người dùng tự kéo thì thôi tự canh khung
      cam.x -= (p.x - lastX) / cam.zoom;
      cam.y -= (p.y - lastY) / cam.zoom;
    }
    lastX = p.x; lastY = p.y;
    handlers.move && handlers.move(w, e);
  };
  const onUp = (e) => {
    const w = toWorld(pointer.x, pointer.y);
    pointer.down = false; panning = false;
    handlers.up && handlers.up(w, e);
  };
  const onWheel = (e) => {
    e.preventDefault();
    const p = localXY(e);
    const before = toWorld(p.x, p.y);
    camTarget = null;
    cam.zoom = Math.max(0.35, Math.min(2.2, cam.zoom * (e.deltaY > 0 ? 0.9 : 1.1)));
    const after = toWorld(p.x, p.y);
    cam.x += before.x - after.x;
    cam.y += before.y - after.y;
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  const frameCbs = [];
  let raf = null, last = performance.now();
  let camTarget = null; // {x,y,zoom} — camera tự trôi tới, người dùng kéo là hủy
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (camTarget) {
      const k = Math.min(1, dt * 3.2);
      cam.x += (camTarget.x - cam.x) * k;
      cam.y += (camTarget.y - cam.y) * k;
      cam.zoom += (camTarget.zoom - cam.zoom) * k;
      if (Math.abs(camTarget.x - cam.x) < 0.5 && Math.abs(camTarget.y - cam.y) < 0.5 && Math.abs(camTarget.zoom - cam.zoom) < 0.002) camTarget = null;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.x, -cam.y);
    for (const cb of frameCbs) cb(ctx, dt, now / 1000);
    ctx.restore();
  }
  function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
  function dispose() {
    stop();
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    canvas.removeEventListener("wheel", onWheel);
  }

  // Khung nhìn ôm trọn nội dung. padTop/padBottom chừa chỗ cho thanh HUD nổi bên trên canvas.
  function viewOf(items, { pad = 70, padTop = 0, padBottom = 0 } = {}) {
    if (!items.length) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const it of items) {
      minX = Math.min(minX, it.x - (it.w || 40) / 2); maxX = Math.max(maxX, it.x + (it.w || 40) / 2);
      minY = Math.min(minY, it.y - (it.h || 24) / 2); maxY = Math.max(maxY, it.y + (it.h || 24) / 2);
    }
    const zx = (W - pad * 2) / Math.max(1, maxX - minX);
    const zy = (H - padTop - padBottom - pad) / Math.max(1, maxY - minY);
    const zoom = Math.max(0.32, Math.min(1.15, Math.min(zx, zy)));
    // Dời tâm xuống một nửa phần chênh lệch giữa hai lề, để nội dung nằm giữa vùng trống thật
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 + (padTop - padBottom) / 2 / zoom, zoom };
  }
  function fit(items, opts) { const v = viewOf(items, opts); if (v) Object.assign(cam, v); }
  function flyTo(items, opts) { const v = viewOf(items, opts); if (v) camTarget = v; }

  return {
    ctx, cam, pointer, toWorld, toScreen, fit, flyTo,
    get width() { return W; }, get height() { return H; },
    on: (name, fn) => { handlers[name] = fn; },
    onFrame: (cb) => frameCbs.push(cb),
    start, stop, dispose,
  };
}

/* ---------- Vẽ ---------- */
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Cắt chữ thành nhiều dòng vừa bề rộng cho trước
const _meas = document.createElement("canvas").getContext("2d");
export function wrapText(text, font, maxWidth, maxLines = 3) {
  _meas.font = font;
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (_meas.measureText(test).width <= maxWidth || !cur) cur = test;
    else { lines.push(cur); cur = w; if (lines.length === maxLines - 1) break; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) lines.length = maxLines;
  // Dòng cuối bị cắt thì thêm dấu …
  const joined = lines.join(" ");
  if (joined.length < String(text).length) {
    let l = lines[lines.length - 1];
    while (l.length > 1 && _meas.measureText(l + "…").width > maxWidth) l = l.slice(0, -1);
    lines[lines.length - 1] = l + "…";
  }
  const width = Math.max(...lines.map((l) => _meas.measureText(l).width));
  return { lines, width };
}

export function measurePill(text, { font = "600 15px system-ui, sans-serif", maxWidth = 150, padX = 13, padY = 9, lineH = 19 } = {}) {
  const { lines, width } = wrapText(text, font, maxWidth);
  return { lines, w: Math.ceil(width) + padX * 2, h: lines.length * lineH + padY * 2, font, padX, padY, lineH };
}

export function drawPill(ctx, node, { fill, stroke, text = "#fff", glow = 0, alpha = 1 }) {
  const { x, y, w, h } = node;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (glow) { ctx.shadowColor = stroke || fill; ctx.shadowBlur = glow; }
  ctx.fillStyle = fill;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, Math.min(14, h / 2));
  ctx.fill();
  ctx.shadowBlur = 0;
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.fillStyle = text;
  ctx.font = node.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const n = node.lines.length;
  node.lines.forEach((l, i) => ctx.fillText(l, x, y + (i - (n - 1) / 2) * node.lineH));
  ctx.restore();
}

export function hitPill(node, wx, wy, pad = 0) {
  return Math.abs(wx - node.x) <= node.w / 2 + pad && Math.abs(wy - node.y) <= node.h / 2 + pad;
}

/* ---------- Âm thanh nhẹ ---------- */
export function blip(freq = 440, dur = 0.08, type = "sine", gain = 0.045) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    blip._ctx = blip._ctx || new AC();
    const c = blip._ctx;
    if (c.state === "suspended") c.resume();
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  } catch {}
}

export const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
