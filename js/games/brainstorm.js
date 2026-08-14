// ==== BÀI 1 · TẬP KÍCH NÃO — Game "Vụ Nổ Ý Tưởng" ====
// Cơ chế game bám sát 4 nguyên tắc của Osborn:
//  1. Không phê phán  -> "Kiểm Duyệt" siết lại khi bạn chần chừ, gõ tiếp là đẩy lùi nó
//  2. Hoan nghênh ý điên rồ -> ý gắn cờ "điên rồ" thành sao vàng, điểm nhân đôi
//  3. Chạy theo số lượng -> chuỗi combo thưởng khi bung ý liên tục
//  4. Kết hợp & cải tiến -> ghép 2 quả cầu thành một siêu tân tinh
import { THREE, createOverlay, createStage, makeLabel, keepLabelScreenSize, glowTexture, burst, effectPool, blip } from "./engine.js";

const COLORS = { normal: 0x6ea8ff, wild: 0xffc857, fused: 0xff6ec7 };
const _v = new THREE.Vector3();

export function launch({ problem, onFinish } = {}) {
  const ui = createOverlay({ title: "Bài 1 · Vụ Nổ Ý Tưởng", onClose: () => cleanup() });
  const stage = createStage(ui.host, { cameraZ: 19 });
  const fx = effectPool();
  const state = {
    phase: "intro", ideas: [], orbs: [], selected: null,
    combo: 0, maxCombo: 0, score: 0, fuses: 0, wilds: 0,
    timeLeft: 180, duration: 180, idle: 0, censor: 0, running: false,
  };

  /* ---------- Lõi vấn đề ---------- */
  const core = new THREE.Group();
  stage.rig.add(core);
  const coreMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, 1),
    new THREE.MeshStandardMaterial({ color: 0x2b3f8f, emissive: 0x3d5bd6, emissiveIntensity: 0.7, roughness: 0.35, metalness: 0.4, flatShading: true })
  );
  core.add(coreMesh);
  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.55, 1),
    new THREE.MeshBasicMaterial({ color: 0x8fb2ff, wireframe: true, transparent: true, opacity: 0.35 })
  );
  core.add(coreWire);
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x6aa0ff, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }));
  coreGlow.scale.set(11, 11, 1);
  core.add(coreGlow);

  // Vòng "Kiểm Duyệt" — siết vào khi người chơi ngừng nghĩ
  const censorRing = new THREE.Mesh(
    new THREE.TorusGeometry(13, 0.28, 8, 90),
    new THREE.MeshBasicMaterial({ color: 0xff3b5c, transparent: true, opacity: 0 })
  );
  censorRing.rotation.x = Math.PI / 2;
  stage.rig.add(censorRing);

  /* ---------- Quả cầu ý tưởng ---------- */
  function addOrb(text, wild, fused) {
    const color = fused ? COLORS.fused : wild ? COLORS.wild : COLORS.normal;
    const g = new THREE.Group();
    const R = fused ? 0.85 : wild ? 0.62 : 0.5;
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(R, fused ? 2 : 1),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.85, roughness: 0.3, metalness: 0.3, flatShading: true })
    );
    mesh.userData.orbRef = g;
    g.add(mesh);
    // Vùng bấm rộng vô hình: quả cầu nhỏ và đang bay, rất khó bấm trúng nếu chỉ dựa vào mesh
    const hit = new THREE.Mesh(new THREE.SphereGeometry(R * 2.6, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData.orbRef = g;
    g.add(hit);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(R * 7, R * 7, 1);
    g.add(glow);
    // Nhãn gắn thẳng vào rig, KHÔNG vào nhóm quả cầu: nhóm bị scale khi chọn/khi
    // đang bung ra, sẽ kéo theo cỡ nhãn và phá vỡ việc giữ nhãn cố định trên màn hình.
    const label = makeLabel(text, { color: "#eaf0ff", size: 40, maxChars: 22 });
    stage.rig.add(label);

    const orb = {
      group: g, mesh, hit, glow, label, text, R, wild: !!wild, fused: !!fused,
      radius: (fused ? 5.5 : 6.5) + Math.random() * 4.5,
      incl: (Math.random() - 0.5) * 1.35,
      phase: Math.random() * Math.PI * 2,
      speed: (0.16 + Math.random() * 0.22) * (Math.random() < 0.5 ? 1 : -1),
      spawn: 0, // 0→1: bay từ lõi ra quỹ đạo
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.6),
    };
    stage.rig.add(g);
    state.orbs.push(orb);
    fx.add(burst(stage.rig, new THREE.Vector3(0, 0, 0), color, fused ? 90 : 34, fused ? 11 : 7));
    return orb;
  }

  function removeOrb(o) {
    stage.rig.remove(o.group);
    stage.rig.remove(o.label); // nhãn nằm ở rig nên phải gỡ riêng
    o.label.userData.dispose();
    const i = state.orbs.indexOf(o);
    if (i >= 0) state.orbs.splice(i, 1);
    if (state.selected === o) state.selected = null;
  }

  function orbPos(o, t) {
    const a = o.phase + t * o.speed;
    const r = o.radius * (0.25 + 0.75 * o.spawn); // bung ra từ lõi
    return new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 0.7 + o.incl * 3) * r * 0.42 * Math.sin(o.incl + 1), Math.sin(a) * r);
  }

  /* ---------- Vòng lặp ---------- */
  stage.onFrame((dt, t) => {
    fx.tick(dt);
    coreMesh.rotation.y += dt * 0.25;
    coreMesh.rotation.x += dt * 0.11;
    coreWire.rotation.y -= dt * 0.17;
    const pulse = 1 + Math.sin(t * 2.2) * 0.045 + Math.min(state.combo, 8) * 0.012;
    core.scale.setScalar(pulse);
    coreGlow.material.opacity = 0.6 + Math.sin(t * 2.2) * 0.12;

    for (const o of state.orbs) {
      o.spawn = Math.min(1, o.spawn + dt * 1.6);
      o.group.position.copy(orbPos(o, t));
      o.mesh.rotation.x += o.spin.x * dt;
      o.mesh.rotation.y += o.spin.y * dt;
      const sel = state.selected === o;
      const s = (sel ? 1.45 : 1) * (0.4 + 0.6 * o.spawn);
      o.group.scale.setScalar(s);
      o.mesh.material.emissiveIntensity = sel ? 1.8 : 0.85;
      // Nhãn bám theo quả cầu, giữ cỡ gần như cố định trên màn hình
      o.label.position.copy(o.group.position);
      const lh = keepLabelScreenSize(o.label, stage.camera, sel ? 0.040 : 0.030);
      o.label.position.y += o.R * s + lh * 0.9;
      // Nhãn ở xa mờ bớt cho đỡ rối mắt; quả đang chọn luôn rõ
      const dist = stage.camera.position.distanceTo(o.group.getWorldPosition(_v));
      o.label.material.opacity = sel ? 1 : Math.max(0.25, Math.min(1, 1.75 - dist / 22));
    }

    if (state.running) {
      state.timeLeft -= dt;
      state.idle += dt;
      // Kiểm duyệt siết lại
      const pressure = Math.max(0, Math.min(1, (state.idle - 4.5) / 8));
      state.censor = pressure;
      censorRing.material.opacity = pressure * 0.85;
      censorRing.scale.setScalar(1 - pressure * 0.72);
      censorRing.rotation.z += dt * (0.3 + pressure);
      ui.vignette.style.opacity = String(pressure * 0.82);
      if (state.idle > 12.5 && state.combo > 0) {
        state.combo = 0;
        toast("😶 Kiểm duyệt bóp nghẹt chuỗi ý — đừng dừng lại để phán xét!");
        blip(150, 0.22, "sawtooth", 0.05);
        state.idle = 6;
      }
      if (state.timeLeft <= 0) finish();
      hudTick();
      // Con trỏ báo hiệu quả cầu bấm được (chỉ dò mỗi 4 khung hình cho nhẹ)
      if ((hoverTick = (hoverTick + 1) % 4) === 0) {
        const over = state.orbs.length && stage.pick(state.orbs.map((o) => o.hit)).length > 0;
        stage.renderer.domElement.style.cursor = over ? "pointer" : "grab";
      }
    }
  });
  let hoverTick = 0;
  stage.start();

  /* ---------- Chọn & ghép quả cầu ---------- */
  let downX = 0, downY = 0;
  const el = stage.renderer.domElement;
  el.addEventListener("pointerdown", (e) => { downX = e.clientX; downY = e.clientY; });
  el.addEventListener("pointerup", (e) => {
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return; // đang kéo xoay
    if (state.phase !== "play") return;
    const hits = stage.pick(state.orbs.map((o) => o.hit));
    if (!hits.length) { state.selected = null; return; }
    const orb = hits[0].object.userData.orbRef;
    const target = state.orbs.find((o) => o.group === orb);
    if (!target) return;
    blip(660, 0.06, "triangle", 0.04);
    if (!state.selected) { state.selected = target; toast("Chọn thêm 1 quả cầu nữa để <b>kết hợp</b> hai ý."); }
    else if (state.selected === target) state.selected = null;
    else openFuse(state.selected, target);
  });

  /* ---------- Giao diện ---------- */
  const layer = ui.layer;
  function toast(html) {
    let t = layer.querySelector(".g-toast");
    if (!t) { t = document.createElement("div"); t.className = "g-toast"; layer.appendChild(t); }
    t.innerHTML = html;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function screenIntro() {
    state.phase = "intro";
    layer.innerHTML = `
      <div class="g-panel g-center">
        <h2>🧠 Vụ Nổ Ý Tưởng</h2>
        <p class="g-lead">Lõi giữa màn hình là <b>vấn đề</b> của bạn. Mỗi ý tưởng bạn gõ ra sẽ nổ tung khỏi lõi và bay vào quỹ đạo. Nhiệm vụ: <b>lấp đầy vũ trụ bằng ý tưởng</b> trước khi hết giờ.</p>
        <ul class="g-rules">
          <li><span>🚫</span><div><b>Không phê phán.</b> Ngừng gõ quá lâu, vòng <i>Kiểm Duyệt</i> đỏ sẽ siết vào và cắt chuỗi combo của bạn.</div></li>
          <li><span>🤪</span><div><b>Hoan nghênh ý điên rồ.</b> Gõ <kbd>Ctrl</kbd>+<kbd>Enter</kbd> để đánh dấu ý điên rồ — thành sao vàng, <b>điểm ×2</b>.</div></li>
          <li><span>⚡</span><div><b>Chạy theo số lượng.</b> Bung ý liên tiếp dưới 8 giây để giữ <i>combo</i> nhân điểm.</div></li>
          <li><span>🔗</span><div><b>Kết hợp & cải tiến.</b> Bấm chọn 2 quả cầu để ghép chúng thành một ý mới — siêu tân tinh, <b>+60 điểm</b>.</div></li>
        </ul>
        <div class="g-row">
          <span class="g-muted">Thời lượng:</span>
          <button class="g-chip" data-d="60">1 phút</button>
          <button class="g-chip active" data-d="180">3 phút</button>
          <button class="g-chip" data-d="300">5 phút</button>
        </div>
        <p class="g-problem">${problem ? `🎯 Vấn đề: <b>${escapeHtml(problem)}</b>` : `⚠️ Bạn chưa đặt vấn đề — game vẫn chơi được, nhưng hãy đặt một vấn đề thật để luyện có ích hơn.`}</p>
        <button class="g-btn primary big" id="goBtn">Bắt đầu bung ý →</button>
        <p class="g-hint">Mẹo: kéo chuột để xoay vũ trụ · <kbd>Esc</kbd> để thoát</p>
      </div>`;
    layer.querySelectorAll("[data-d]").forEach((b) =>
      b.addEventListener("click", () => {
        layer.querySelectorAll("[data-d]").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        state.duration = +b.dataset.d;
      })
    );
    layer.querySelector("#goBtn").addEventListener("click", screenPlay);
  }

  function screenPlay() {
    state.phase = "play";
    state.timeLeft = state.duration;
    state.idle = 0;
    state.running = true;
    layer.innerHTML = `
      <div class="g-stats">
        <div class="g-stat"><span class="g-k">Thời gian</span><b id="sTime">--:--</b></div>
        <div class="g-stat"><span class="g-k">Ý tưởng</span><b id="sCount">0</b></div>
        <div class="g-stat"><span class="g-k">Combo</span><b id="sCombo">×1</b></div>
        <div class="g-stat"><span class="g-k">Điểm</span><b id="sScore">0</b></div>
      </div>
      <div class="g-inputbar">
        <input id="gIn" type="text" autocomplete="off" placeholder="Gõ một ý rồi Enter · Ctrl+Enter = ý điên rồ 🤪" />
        <button class="g-btn primary" id="gAdd">Bung</button>
        <button class="g-btn" id="gEnd">Kết thúc</button>
      </div>
      <div class="g-combo-flash" id="flash"></div>`;
    const input = layer.querySelector("#gIn");
    input.focus();
    const submit = (wild) => {
      const v = input.value.trim();
      if (!v) return;
      input.value = "";
      pushIdea(v, wild);
      input.focus();
    };
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      submit(e.ctrlKey || e.metaKey);
    });
    layer.querySelector("#gAdd").addEventListener("click", () => submit(false));
    layer.querySelector("#gEnd").addEventListener("click", finish);
    hudTick();
  }

  function pushIdea(text, wild) {
    const fast = state.idle < 8;
    state.combo = fast ? state.combo + 1 : 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.idle = 0;
    const mult = Math.min(state.combo, 6);
    const pts = 10 * mult * (wild ? 2 : 1);
    state.score += pts;
    if (wild) state.wilds++;
    state.ideas.push({ text, wild, fused: false });
    addOrb(text, wild, false);
    blip(wild ? 880 : 520 + Math.min(state.combo, 8) * 28, 0.08, wild ? "triangle" : "sine", 0.045);
    flash(`+${pts}${mult > 1 ? ` (×${mult})` : ""}${wild ? " 🤪" : ""}`);
    if (state.combo === 5) toast("🔥 Đang vào dòng chảy! Đừng dừng để đánh giá.");
    hudTick();
  }

  function openFuse(a, b) {
    state.running = false;
    const box = document.createElement("div");
    box.className = "g-modal";
    box.innerHTML = `
      <div class="g-modal-card">
        <h3>🔗 Kết hợp & cải tiến</h3>
        <p class="g-muted">Nguyên tắc thứ 4 của Osborn: ý mới sinh ra từ việc ghép ý cũ.</p>
        <div class="g-fuse">
          <span class="g-pill">${escapeHtml(a.text)}</span>
          <span class="g-plus">＋</span>
          <span class="g-pill">${escapeHtml(b.text)}</span>
        </div>
        <input id="fuseIn" type="text" placeholder="Ghép hai ý này thành ý mới nào?" />
        <div class="g-modal-actions">
          <button class="g-btn" id="fuseCancel">Hủy</button>
          <button class="g-btn primary" id="fuseOk">Tạo siêu tân tinh ✦</button>
        </div>
      </div>`;
    layer.appendChild(box);
    const fin = layer.querySelector("#fuseIn");
    fin.focus();
    const done = (ok) => {
      const v = fin.value.trim();
      box.remove();
      state.selected = null;
      state.running = state.phase === "play";
      state.idle = 0;
      if (!ok || !v) return;
      // Hai quả cầu cũ tan vào quả mới
      [a, b].forEach((o) => {
        fx.add(burst(stage.rig, o.group.position.clone(), 0xff6ec7, 26, 5));
        removeOrb(o);
      });
      state.fuses++;
      state.score += 60;
      state.ideas.push({ text: v, wild: false, fused: true });
      addOrb(v, false, true);
      blip(300, 0.3, "sine", 0.06);
      setTimeout(() => blip(700, 0.25, "triangle", 0.05), 90);
      flash("+60 ✦ KẾT HỢP");
      hudTick();
    };
    fin.addEventListener("keydown", (e) => { if (e.key === "Enter") done(true); });
    layer.querySelector("#fuseOk").addEventListener("click", () => done(true));
    layer.querySelector("#fuseCancel").addEventListener("click", () => done(false));
  }

  function flash(txt) {
    const f = layer.querySelector("#flash");
    if (!f) return;
    const s = document.createElement("span");
    s.textContent = txt;
    f.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }

  function hudTick() {
    const q = (id) => layer.querySelector(id);
    const tEl = q("#sTime");
    if (!tEl) return;
    const s = Math.max(0, Math.ceil(state.timeLeft));
    tEl.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    tEl.classList.toggle("danger", s <= 15);
    q("#sCount").textContent = state.ideas.length;
    q("#sCombo").textContent = "×" + Math.max(1, Math.min(state.combo, 6));
    q("#sScore").textContent = state.score;
  }

  /* ---------- Kết thúc & chấm điểm ---------- */
  function finish() {
    if (state.phase === "result") return;
    state.phase = "result";
    state.running = false;
    ui.vignette.style.opacity = "0";
    censorRing.material.opacity = 0;

    const n = state.ideas.length;
    const fluency = n * 10;
    const originality = state.wilds * 20;
    const elaboration = state.fuses * 50;
    const flow = state.maxCombo * 15;
    const total = fluency + originality + elaboration + flow;
    const rank = total >= 900 ? ["🏆", "Bộ óc bùng nổ"] : total >= 550 ? ["🥇", "Dòng chảy tốt"] : total >= 280 ? ["🥈", "Đã khởi động"] : ["🌱", "Mới nhen nhóm"];

    // Lưu lại: ý tưởng chảy thẳng vào ô thực hành của Bài 1
    try {
      const key = "ctp:note:brainstorm:ideas";
      const old = JSON.parse(localStorage.getItem(key) || "[]");
      const add = state.ideas.map((i) => (i.fused ? "✦ " : i.wild ? "🤪 " : "") + i.text);
      localStorage.setItem(key, JSON.stringify(old.concat(add)));
      const bk = "ctp:game:brainstorm:best";
      const best = JSON.parse(localStorage.getItem(bk) || "0");
      if (total > best) localStorage.setItem(bk, JSON.stringify(total));
      const done = JSON.parse(localStorage.getItem("ctp:done") || "{}");
      done.brainstorm = true;
      localStorage.setItem("ctp:done", JSON.stringify(done));
    } catch {}

    layer.innerHTML = `
      <div class="g-panel g-center">
        <div class="g-rank">${rank[0]}</div>
        <h2>${rank[1]}</h2>
        <div class="g-score">${total} <span>điểm</span></div>
        <table class="g-table">
          <tr><td>Lưu loát <span class="g-muted">— số ý bung ra</span></td><td>${n}</td><td>+${fluency}</td></tr>
          <tr><td>Độc đáo <span class="g-muted">— ý điên rồ</span></td><td>${state.wilds}</td><td>+${originality}</td></tr>
          <tr><td>Cải tiến <span class="g-muted">— lần kết hợp</span></td><td>${state.fuses}</td><td>+${elaboration}</td></tr>
          <tr><td>Dòng chảy <span class="g-muted">— combo cao nhất</span></td><td>×${state.maxCombo}</td><td>+${flow}</td></tr>
        </table>
        <p class="g-note">${coach(n, state.wilds, state.fuses, state.maxCombo)}</p>
        <p class="g-saved">✓ ${n} ý tưởng đã được lưu vào phần Thực hành của Bài 1.</p>
        <div class="g-row center">
          <button class="g-btn primary" id="again">Chơi lại</button>
          <button class="g-btn" id="quit">Xong, xem ghi chú</button>
        </div>
      </div>`;
    layer.querySelector("#again").addEventListener("click", () => {
      state.ideas = []; state.combo = 0; state.maxCombo = 0; state.score = 0;
      state.fuses = 0; state.wilds = 0; state.selected = null;
      state.orbs.slice().forEach(removeOrb);
      screenIntro();
    });
    layer.querySelector("#quit").addEventListener("click", () => ui.close());
  }

  function coach(n, wilds, fuses, combo) {
    if (n < 8) return "Bạn mới bung được ít ý — thường vì não vừa nghĩ vừa tự chê. Lần sau hãy cho phép mình viết cả những ý dở; số lượng mới đẻ ra chất lượng.";
    if (wilds === 0) return "Bạn chưa có ý nào 'điên rồ'. Ý an toàn thường là ý ai cũng nghĩ ra. Thử vài ý phi lý — chúng hay là cầu nối tới giải pháp thật.";
    if (fuses === 0) return "Bạn chưa dùng nguyên tắc thứ 4: kết hợp và cải tiến. Ghép hai ý tầm thường lại, rất hay ra một ý không tầm thường.";
    if (combo < 5) return "Nhịp gõ của bạn còn ngắt quãng. Trong lúc tập kích não, hãy giữ tay chạy liên tục — phần đánh giá để dành cho sau khi hết giờ.";
    return "Rất tốt: bạn giữ được dòng chảy, dám nghĩ điên rồ và biết ghép ý. Giờ hãy quay lại sàng lọc — đó mới là lúc được phép phê phán.";
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function cleanup() {
    stage.dispose();
    onFinish && onFinish();
  }

  screenIntro();
  return { close: () => ui.close() };
}
