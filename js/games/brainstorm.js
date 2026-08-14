// ==== BÀI 1 · TẬP KÍCH NÃO — Game "Nở Hoa Ý Tưởng" ====
// Ba chặng, đi từ dễ tới khó:
//   1. KHAI MỞ  — 15 "ống kính" (tính chất, nguyên nhân, kết quả, màu sắc...) dẫn
//                 người chơi bung 20–50 ý từ một hạt giống duy nhất.
//   2. NHÓM Ý   — kéo các ý vào nhóm và tự đặt tên nhóm (chính là khái quát hóa).
//   3. XÂU CHUỖI— nối các nhóm bằng quan hệ nhân quả (chính là hệ thống hóa).
// Kết quả xuất thẳng sang Mind Map (Bài 9), Khái quát hóa (Bài 8), Nới rộng khái niệm (Bài 3).
import { createOverlay, createStage, measurePill, drawPill, hitPill, blip, escapeHtml } from "./canvas2d.js";

/* ---------- 15 ống kính khai mở ---------- */
const LENSES = [
  { key: "chatluong", name: "Tính chất", icon: "🔍", color: "#4f8ef7", q: "Nó có những tính chất, đặc điểm gì?", hints: ["To hay nhỏ?", "Nhanh hay chậm?", "Dễ hay khó?", "Bền hay mong manh?"] },
  { key: "bophan", name: "Bộ phận", icon: "🧩", color: "#6c5ce7", q: "Nó gồm những phần nào? Tháo rời ra thì thấy gì?", hints: ["Phần nào quan trọng nhất?", "Phần nào thừa?", "Thiếu phần nào?"] },
  { key: "nguyennhan", name: "Nguyên nhân", icon: "⬅️", color: "#e17055", q: "Điều gì gây ra nó? Gốc rễ nằm ở đâu?", hints: ["Vì sao lại thế?", "Rồi vì sao nữa?", "Ai/cái gì tạo ra nó?"] },
  { key: "ketqua", name: "Kết quả", icon: "➡️", color: "#00b894", q: "Nó dẫn tới hệ quả gì? Sau đó thì sao?", hints: ["Ngắn hạn thì sao?", "Dài hạn thì sao?", "Ai chịu ảnh hưởng?"] },
  { key: "conguoi", name: "Con người", icon: "👥", color: "#fd79a8", q: "Ai liên quan? Ai được lợi, ai cản trở?", hints: ["Ai làm việc này?", "Ai phản đối?", "Ai đã giải quyết rồi?"] },
  { key: "thoigian", name: "Thời gian", icon: "⏳", color: "#fdcb6e", q: "Lúc nào? Trước, trong và sau ra sao?", hints: ["10 năm trước thì sao?", "10 năm nữa thì sao?", "Khi nào nó tệ nhất?"] },
  { key: "noichon", name: "Nơi chốn", icon: "📍", color: "#00cec9", q: "Ở đâu? Trong bối cảnh nào?", hints: ["Chỗ nào thuận lợi?", "Ở nước khác thì sao?", "Chỗ nào chưa ai thử?"] },
  { key: "congcu", name: "Công cụ", icon: "🛠️", color: "#a29bfe", q: "Cần công cụ, tài nguyên, kỹ năng gì?", hints: ["Đã có sẵn cái gì?", "Cần học gì?", "Tốn bao nhiêu?"] },
  { key: "camxuc", name: "Cảm xúc", icon: "❤️", color: "#ff7675", q: "Cảm giác nào đi kèm? Sợ gì, mong gì?", hints: ["Điều gì làm bạn ngại?", "Điều gì làm bạn hứng?", "Người khác cảm thấy sao?"] },
  { key: "hinhanh", name: "Màu sắc & hình ảnh", icon: "🎨", color: "#e84393", q: "Nếu nó là một màu, một con vật, một đồ vật — thì là gì?", hints: ["Màu gì? Vì sao?", "Giống con gì?", "Nghe như âm thanh gì?"] },
  { key: "nguoclai", name: "Ngược lại", icon: "🔃", color: "#636e72", q: "Điều ngược lại thì sao? Làm sao để nó tệ nhất?", hints: ["Nếu bỏ hẳn thì sao?", "Làm ngược lại thế nào?", "Ai muốn nó thất bại?"] },
  { key: "phongdai", name: "Phóng đại", icon: "🔺", color: "#d63031", q: "Nếu gấp 100 lần thì sao?", hints: ["Nếu có vô hạn tiền?", "Nếu cả nước cùng làm?", "Nếu làm mỗi ngày?"] },
  { key: "thunho", name: "Thu nhỏ", icon: "🔻", color: "#0984e3", q: "Nếu chỉ còn một phần trăm? Bản nhỏ nhất là gì?", hints: ["Làm trong 5 phút thì sao?", "Bản đơn giản nhất?", "Bỏ bớt được gì?"] },
  { key: "thaythe", name: "Thay thế", icon: "🔁", color: "#00a8a8", q: "Có thể thay bằng gì khác?", hints: ["Ai khác làm thay?", "Cách khác là gì?", "Dùng thứ rẻ hơn?"] },
  { key: "sosanh", name: "So sánh", icon: "🪞", color: "#b2bec3", q: "Nó giống cái gì khác? Ngành khác giải quyết ra sao?", hints: ["Giống trong tự nhiên?", "Nhà hàng làm thế nào?", "Game làm thế nào?"] },
];

const TARGETS = { min: 20, good: 35, great: 50 };
const GROUP_COLORS = ["#4f8ef7", "#00b894", "#fdcb6e", "#e84393", "#a29bfe", "#e17055", "#00cec9", "#ff7675"];
const RELATIONS = ["dẫn tới", "cần có", "cản trở", "thuộc về", "giải quyết"];

export function launch({ problem, onFinish } = {}) {
  const seedText = (problem || "").trim() || "Vấn đề của tôi";
  const ui = createOverlay({ title: "Bài 1 · Nở Hoa Ý Tưởng", onClose: () => cleanup() });
  const stage = createStage(ui.canvas);
  const layer = ui.layer;

  const S = {
    phase: "intro",
    ideas: [],        // { id, text, lensKey, parent, x, y, tx, ty, group, ... }
    groups: [],       // { id, name, color, x, y, r }
    links: [],        // { from, to, label }
    focus: null,      // ý đang được đào sâu (null = hạt giống)
    lensIdx: 0,
    lensCount: 0,     // số ý đã cho ống kính hiện tại
    lensesUsed: new Set(),
    selected: null,
    dragging: null,
    linkFrom: null,
    startedAt: 0,
  };
  let nid = 1;

  /* ---------- Hạt giống ở tâm ---------- */
  const seed = Object.assign({ id: 0, x: 0, y: 0, tx: 0, ty: 0, isSeed: true, text: seedText },
    measurePill(seedText, { font: "700 19px system-ui, sans-serif", maxWidth: 230, padX: 20, padY: 14, lineH: 24 }));

  const lens = () => LENSES[S.lensIdx];
  const nodeOf = (id) => (id === 0 ? seed : S.ideas.find((i) => i.id === id));

  /* ---------- Thêm ý ---------- */
  function addIdea(text) {
    const parent = S.focus == null ? 0 : S.focus;
    const p = nodeOf(parent) || seed;
    const L = lens();
    const siblings = S.ideas.filter((i) => i.parent === parent);
    const k = siblings.length;
    let ang, dist;
    if (p.isSeed) {
      // Xoắn ốc góc vàng: mỗi ý mới lệch 137.5°, bán kính tăng theo căn bậc hai
      // -> rải đều khắp mặt phẳng, vòng ngoài tự nới rộng khi ý nhiều lên.
      ang = k * 2.39996;
      dist = 235 + 46 * Math.sqrt(k);
    } else {
      const base = Math.atan2(p.y - (nodeOf(p.parent) || seed).y, p.x - (nodeOf(p.parent) || seed).x);
      ang = base + (k - 1.5) * 0.42 + (Math.random() - 0.5) * 0.15;
      dist = 175;
    }

    const n = Object.assign(
      { id: nid++, text, lensKey: L.key, color: L.color, parent, group: null, born: performance.now(), pop: 0 },
      measurePill(text, { maxWidth: 150 })
    );
    // ax/ay là chỗ "lý tưởng"; tx/ty có thể bị lực đẩy xê dịch để không chồng nút khác
    n.ax = n.tx = p.x + Math.cos(ang) * dist;
    n.ay = n.ty = p.y + Math.sin(ang) * dist;
    n.x = p.x; n.y = p.y; // bay ra từ nút cha
    S.ideas.push(n);
    S.lensCount++;
    S.lensesUsed.add(L.key);
    blip(480 + Math.min(S.ideas.length, 20) * 12, 0.07, "sine", 0.04);
    for (let i = 0; i < 24; i++) relax(); // gỡ chồng lấn ngay, khỏi thấy nút nhảy
    frameView();
    hud();
    return n;
  }

  // Đẩy các nút chồng nhau ra, đồng thời kéo nhẹ chúng về vị trí lý tưởng
  function relax() {
    const all = S.ideas.filter((n) => n !== S.dragging);
    for (const n of all) {
      n.tx += (n.ax - n.tx) * 0.06;
      n.ty += (n.ay - n.ty) * 0.06;
    }
    const items = S.phase === "expand" ? all.concat([seed]) : all;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        const ax = a.isSeed ? a.x : a.tx, ay = a.isSeed ? a.y : a.ty;
        const bx = b.isSeed ? b.x : b.tx, by = b.isSeed ? b.y : b.ty;
        const dx = bx - ax, dy = by - ay;
        const ox = (a.w + b.w) / 2 + 16 - Math.abs(dx);
        const oy = (a.h + b.h) / 2 + 12 - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        // Tách theo trục chồng ít hơn -> dịch chuyển nhỏ nhất
        let px = 0, py = 0;
        if (ox < oy) px = (dx < 0 ? -1 : 1) * ox * 0.5;
        else py = (dy < 0 ? -1 : 1) * oy * 0.5;
        if (!a.isSeed) { a.tx -= px; a.ty -= py; }
        if (!b.isSeed) { b.tx += px; b.ty += py; }
      }
    }
  }

  // Canh khung nhìn, chừa chỗ cho thanh ống kính trên và ô nhập dưới
  function frameView() {
    if (S.phase !== "expand") return;
    stage.flyTo(S.ideas.concat([seed]), { pad: 60, padTop: 190, padBottom: 165 });
  }

  /* ---------- Bố cục theo chặng ---------- */
  function layoutClusters() {
    const gs = S.groups;
    const showTray = S.phase === "cluster"; // chặng xâu chuỗi chỉ bàn tới các nhóm

    // Khay ý chưa nhóm nằm giữa, xếp lưới gọn
    const rest = S.ideas.filter((n) => !n.group);
    let trayHalf = 0;
    if (showTray && rest.length) {
      const cols = Math.max(1, Math.min(4, Math.ceil(Math.sqrt(rest.length))));
      const rows = Math.ceil(rest.length / cols);
      const colW = 185, rowH = 60;
      rest.forEach((n, k) => {
        n.ax = ((k % cols) - (cols - 1) / 2) * colW;
        n.ay = (Math.floor(k / cols) - (rows - 1) / 2) * rowH;
      });
      trayHalf = Math.max(cols * colW, rows * rowH) / 2;
    }

    gs.forEach((g) => { g.r = 72 + 32 * Math.sqrt(S.ideas.filter((n) => n.group === g.id).length); });
    const maxR = gs.reduce((m, g) => Math.max(m, g.r), 0);
    const n = Math.max(1, gs.length);
    // Bán kính vòng: đủ để hai nhóm kề nhau không chạm, và không đè khay ý ở giữa
    const chord = n > 1 ? 2 * Math.sin(Math.PI / n) : 2;
    const ring = Math.max(trayHalf + maxR + 80, (maxR * 2 + 70) / chord, 240);

    gs.forEach((g, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      // Kéo giãn theo chiều ngang: màn hình rộng hơn cao, và giãn ngang thì
      // khoảng cách giữa các nhóm chỉ tăng chứ không bao giờ giảm.
      g.x = Math.cos(a) * ring * 1.3;
      g.y = Math.sin(a) * ring;
      // Rải thành viên đều trong đĩa tròn bằng xoắn ốc góc vàng
      const members = S.ideas.filter((n) => n.group === g.id);
      members.forEach((n, k) => {
        const rr = (g.r - 42) * Math.sqrt((k + 0.35) / members.length);
        const aa = k * 2.39996 + i;
        n.ax = g.x + Math.cos(aa) * rr;
        n.ay = g.y + Math.sin(aa) * rr;
      });
    });
  }

  /* ---------- Vòng lặp vẽ ---------- */
  stage.onFrame((ctx, dt, t) => {
    if (S.phase === "cluster" || S.phase === "connect") layoutClusters();
    if (S.phase !== "intro" && S.phase !== "result") relax();

    // Nút trôi mượt về vị trí đích
    for (const n of S.ideas) {
      if (n === S.dragging) continue;
      n.x += (n.tx - n.x) * Math.min(1, dt * 7);
      n.y += (n.ty - n.y) * Math.min(1, dt * 7);
      n.pop = Math.min(1, n.pop + dt * 3.5);
    }

    if (S.phase === "intro") { drawSeed(ctx, t); return; }

    // Vòng nhóm
    if (S.phase === "cluster" || S.phase === "connect" || S.phase === "result") {
      for (const g of S.groups) {
        ctx.save();
        ctx.globalAlpha = 0.13;
        ctx.fillStyle = g.color;
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = S.phase === "connect" && S.linkFrom === g ? 1 : 0.75;
        ctx.strokeStyle = g.color;
        ctx.lineWidth = S.phase === "connect" && S.linkFrom === g ? 4 : 2.5;
        ctx.setLineDash([9, 7]);
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.fillStyle = g.color;
        ctx.font = "700 17px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(g.name, g.x, g.y - g.r - 12);
        ctx.restore();
      }
    }

    // Liên kết giữa các nhóm
    for (const lk of S.links) {
      const a = S.groups.find((g) => g.id === lk.from), b = S.groups.find((g) => g.id === lk.to);
      if (a && b) drawArrow(ctx, a, b, lk.label);
    }
    if (S.phase === "connect" && S.linkFrom) {
      ctx.save();
      ctx.strokeStyle = "#9db4ff"; ctx.lineWidth = 2.5; ctx.setLineDash([7, 6]);
      ctx.beginPath(); ctx.moveTo(S.linkFrom.x, S.linkFrom.y);
      ctx.lineTo(stage.pointer.wx, stage.pointer.wy); ctx.stroke();
      ctx.restore();
    }

    // Cành nối cha–con (chỉ ở chặng khai mở, để thấy cây ý lớn dần)
    if (S.phase === "expand") {
      ctx.save();
      ctx.lineWidth = 2;
      for (const n of S.ideas) {
        const p = nodeOf(n.parent) || seed;
        ctx.strokeStyle = n.color;
        ctx.globalAlpha = 0.32 * n.pop;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo((p.x + n.x) / 2, (p.y + n.y) / 2 + 16, n.x, n.y);
        ctx.stroke();
      }
      ctx.restore();
      drawSeed(ctx, t);
    }

    // Các ý (chặng xâu chuỗi chỉ hiện ý đã thuộc nhóm — ý lẻ không nằm trong hệ thống)
    const visible = S.phase === "connect" || S.phase === "result" ? S.ideas.filter((n) => n.group) : S.ideas;
    for (const n of visible) {
      const g = n.group ? S.groups.find((x) => x.id === n.group) : null;
      const col = g ? g.color : n.color;
      const sel = S.selected === n || S.dragging === n;
      const isFocus = S.focus === n.id;
      ctx.save();
      ctx.globalAlpha = n.pop;
      const sc = 0.85 + 0.15 * n.pop;
      ctx.translate(n.x, n.y); ctx.scale(sc, sc); ctx.translate(-n.x, -n.y);
      drawPill(ctx, n, {
        fill: sel ? col : hexA(col, 0.9),
        stroke: isFocus ? "#ffffff" : sel ? "#ffffff" : hexA(col, 0.45),
        text: "#ffffff",
        glow: sel || isFocus ? 18 : 0,
      });
      ctx.restore();
      if (isFocus && S.phase === "expand") {
        ctx.save();
        ctx.strokeStyle = "#fff"; ctx.globalAlpha = 0.5; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(n.x - n.w / 2 - 7, n.y - n.h / 2 - 7, n.w + 14, n.h + 14, 14) : null;
        ctx.stroke();
        ctx.restore();
      }
    }
  });
  stage.start();

  function drawSeed(ctx, t) {
    const pulse = 1 + Math.sin(t * 2) * 0.02;
    ctx.save();
    ctx.translate(seed.x, seed.y); ctx.scale(pulse, pulse); ctx.translate(-seed.x, -seed.y);
    ctx.shadowColor = "#6ea8ff"; ctx.shadowBlur = 34;
    drawPill(ctx, seed, { fill: "#2b3f8f", stroke: "#8fb2ff", text: "#ffffff" });
    ctx.restore();
    if (S.focus == null && S.phase === "expand") {
      ctx.save();
      ctx.strokeStyle = "#fff"; ctx.globalAlpha = 0.45; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
      ctx.strokeRect(seed.x - seed.w / 2 - 8, seed.y - seed.h / 2 - 8, seed.w + 16, seed.h + 16);
      ctx.restore();
    }
  }

  function drawArrow(ctx, a, b, label) {
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const ux = dx / d, uy = dy / d;
    const x1 = a.x + ux * a.r, y1 = a.y + uy * a.r;
    const x2 = b.x - ux * b.r, y2 = b.y - uy * b.r;
    ctx.save();
    ctx.strokeStyle = "#9db4ff"; ctx.fillStyle = "#9db4ff"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const ah = 11, ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ah * Math.cos(ang - 0.42), y2 - ah * Math.sin(ang - 0.42));
    ctx.lineTo(x2 - ah * Math.cos(ang + 0.42), y2 - ah * Math.sin(ang + 0.42));
    ctx.closePath(); ctx.fill();
    if (label) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      ctx.font = "600 13px system-ui, sans-serif";
      const w = ctx.measureText(label).width + 14;
      ctx.fillStyle = "#0b0e1e";
      ctx.fillRect(mx - w / 2, my - 11, w, 22);
      ctx.fillStyle = "#c9d6ff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, mx, my);
    }
    ctx.restore();
  }

  const hexA = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };

  /* ---------- Tương tác trên mặt phẳng ---------- */
  stage.on("down", (w) => {
    if (S.phase === "expand") {
      const n = pickIdea(w);
      if (n) { S.focus = n.id; S.selected = n; blip(700, 0.05, "triangle", 0.035); hud(); return true; }
      if (hitPill(seed, w.x, w.y, 6)) { S.focus = null; S.selected = null; hud(); return true; }
      return false;
    }
    if (S.phase === "cluster") {
      const n = pickIdea(w);
      if (n) { S.dragging = n; S.selected = n; return true; }
      return false;
    }
    if (S.phase === "connect") {
      const g = groupAt(w);
      // Đang chọn sẵn một nhóm và bấm sang nhóm khác -> nối luôn (kiểu bấm 2 lần)
      if (S.linkFrom && g && g !== S.linkFrom) { askRelation(S.linkFrom, g); S.linkFrom = null; return true; }
      if (g) { S.linkFrom = g; S.linkDrag = true; hud(); return true; }
      S.linkFrom = null; hud();
      return false;
    }
    return false;
  });

  const groupAt = (w) => S.groups.find((g) => Math.hypot(w.x - g.x, w.y - g.y) <= g.r);

  stage.on("move", (w) => {
    if (S.dragging) { S.dragging.x = w.x; S.dragging.y = w.y; S.dragging.tx = w.x; S.dragging.ty = w.y; }
  });

  stage.on("up", (w) => {
    if (S.phase === "cluster" && S.dragging) {
      const g = S.groups.find((g) => Math.hypot(w.x - g.x, w.y - g.y) <= g.r);
      const before = S.dragging.group;
      S.dragging.group = g ? g.id : null;
      if (g && before !== g.id) blip(620, 0.07, "sine", 0.04);
      S.dragging = null;
      hud();
    }
    if (S.phase === "connect" && S.linkFrom && S.linkDrag) {
      const g = groupAt(w);
      if (g && g !== S.linkFrom) { askRelation(S.linkFrom, g); S.linkFrom = null; }
      // Thả ở chỗ khác thì vẫn giữ nhóm đang chọn, để người chơi bấm tiếp nhóm đích
      S.linkDrag = false;
      hud();
    }
  });

  function pickIdea(w) {
    for (let i = S.ideas.length - 1; i >= 0; i--) if (hitPill(S.ideas[i], w.x, w.y, 4)) return S.ideas[i];
    return null;
  }

  /* ---------- Thanh chặng ---------- */
  function steps(active) {
    const names = [["expand", "1 · Khai mở"], ["cluster", "2 · Nhóm ý"], ["connect", "3 · Xâu chuỗi"], ["result", "4 · Kết quả"]];
    ui.steps.innerHTML = names.map(([k, n]) => `<span class="g-step ${k === active ? "on" : ""}">${n}</span>`).join("");
  }

  /* ---------- Chặng 0: giới thiệu ---------- */
  function screenIntro() {
    S.phase = "intro";
    ui.steps.innerHTML = "";
    stage.cam.x = 0; stage.cam.y = 0; stage.cam.zoom = 1;
    layer.innerHTML = `
      <div class="g-panel g-center">
        <h2>🌸 Nở Hoa Ý Tưởng</h2>
        <p class="g-lead">Người ta hay bí khi tập kích não vì phải nghĩ từ con số không. Game này <b>không bắt bạn nghĩ vu vơ</b> — nó đưa cho bạn từng <b>ống kính</b> để soi vấn đề, mỗi ống kính một góc nhìn khác nhau. Cứ soi hết vòng, ý tưởng tự nở ra.</p>
        <ol class="g-rules">
          <li><span>🔭</span><div><b>Khai mở.</b> Mỗi lượt bạn nhận một ống kính: <i>tính chất, nguyên nhân, kết quả, màu sắc, ngược lại…</i> Chỉ cần trả lời câu hỏi của nó. Mục tiêu: <b>${TARGETS.min}–${TARGETS.great} ý</b>.</div></li>
          <li><span>🫧</span><div><b>Nhóm ý.</b> Kéo các ý gần nghĩa vào cùng một nhóm và đặt tên nhóm — đây chính là <i>khái quát hóa</i>.</div></li>
          <li><span>🔗</span><div><b>Xâu chuỗi.</b> Nối các nhóm theo quan hệ <i>dẫn tới / cần có / cản trở</i> — bạn vừa dựng nên một sơ đồ hệ thống.</div></li>
        </ol>
        <p class="g-problem">${problem ? `🎯 Hạt giống: <b>${escapeHtml(problem)}</b>` : `⚠️ Bạn chưa đặt vấn đề. Hãy thoát ra, bấm 🎯 ở góc trên để đặt một vấn đề thật — game sẽ có ích hơn nhiều.`}</p>
        <button class="g-btn primary big" id="goBtn">Bắt đầu khai mở →</button>
        <p class="g-hint">Không có đồng hồ đếm ngược. Cứ thong thả nghĩ.</p>
      </div>`;
    layer.querySelector("#goBtn").addEventListener("click", screenExpand);
  }

  /* ---------- Chặng 1: khai mở ---------- */
  function screenExpand() {
    S.phase = "expand";
    S.startedAt = S.startedAt || performance.now();
    steps("expand");
    layer.innerHTML = `
      <div class="g-lensbar">
        <div class="g-lens-main">
          <span class="g-lens-ic" id="lIc"></span>
          <div>
            <div class="g-lens-name" id="lName"></div>
            <div class="g-lens-q" id="lQ"></div>
          </div>
        </div>
        <div class="g-lens-side">
          <button class="g-btn small" id="lHint">💡 Gợi ý</button>
          <button class="g-btn small" id="lNext">Ống kính khác ↻</button>
        </div>
      </div>
      <div class="g-hints" id="hints"></div>
      <div class="g-progress-wrap">
        <div class="g-progress"><span id="pBar"></span><i id="pMin" class="g-mark"></i><i id="pGood" class="g-mark"></i></div>
        <div class="g-progress-txt"><b id="pNum">0</b> ý · <span id="pMsg"></span></div>
      </div>
      <div class="g-focusbar" id="focusBar"></div>
      <div class="g-inputbar">
        <input id="gIn" type="text" autocomplete="off" placeholder="Trả lời câu hỏi trên rồi Enter…" />
        <button class="g-btn primary" id="gAdd">Thêm ý</button>
        <button class="g-btn" id="gNextPhase" disabled>Sang nhóm ý →</button>
      </div>`;
    const input = layer.querySelector("#gIn");
    input.focus();
    const add = () => {
      const v = input.value.trim();
      if (!v) return;
      input.value = "";
      addIdea(v);
      // Sau 3 ý cho một ống kính thì tự đổi góc nhìn, tránh sa đà một hướng
      if (S.lensCount >= 3) nextLens(true);
      input.focus();
    };
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); add(); } });
    layer.querySelector("#gAdd").addEventListener("click", add);
    layer.querySelector("#lNext").addEventListener("click", () => { nextLens(false); input.focus(); });
    layer.querySelector("#lHint").addEventListener("click", toggleHints);
    layer.querySelector("#gNextPhase").addEventListener("click", screenCluster);
    showLens();
    hud();
  }

  function nextLens(auto) {
    const prev = S.lensIdx;
    // Ưu tiên ống kính chưa dùng
    const unused = LENSES.map((l, i) => i).filter((i) => !S.lensesUsed.has(LENSES[i].key) && i !== prev);
    S.lensIdx = unused.length ? unused[Math.floor(Math.random() * unused.length)] : (prev + 1) % LENSES.length;
    S.lensCount = 0;
    showLens(auto);
  }

  function showLens(auto) {
    const L = lens();
    const q = (s) => layer.querySelector(s);
    if (!q("#lName")) return;
    q("#lIc").textContent = L.icon;
    q("#lName").textContent = L.name;
    q("#lName").style.color = L.color;
    q("#lQ").textContent = L.q;
    const bar = layer.querySelector(".g-lensbar");
    bar.style.borderColor = L.color;
    bar.classList.remove("flash"); void bar.offsetWidth; bar.classList.add("flash");
    const h = q("#hints");
    if (h && h.classList.contains("open")) renderHints();
    if (auto) blip(760, 0.06, "triangle", 0.03);
  }

  function toggleHints() {
    const h = layer.querySelector("#hints");
    h.classList.toggle("open");
    if (h.classList.contains("open")) renderHints(); else h.innerHTML = "";
  }
  function renderHints() {
    const h = layer.querySelector("#hints");
    h.innerHTML = lens().hints.map((x) => `<span>${escapeHtml(x)}</span>`).join("");
  }

  /* ---------- Chặng 2: nhóm ý ---------- */
  function screenCluster() {
    S.phase = "cluster";
    S.focus = null;
    steps("cluster");
    if (!S.groups.length) {
      ["", "", ""].forEach((_, i) => {}); // nhóm do người chơi tự tạo
    }
    layer.innerHTML = `
      <div class="g-banner">
        🫧 <b>Nhóm ý.</b> Tạo nhóm rồi <b>kéo các ý</b> vào. Đặt tên nhóm chính là <i>khái quát hóa</i> — biến nhiều ý lẻ thành một khái niệm.
      </div>
      <div class="g-inputbar">
        <button class="g-btn primary" id="newGroup">＋ Tạo nhóm mới</button>
        <span class="g-inline" id="clusterInfo"></span>
        <button class="g-btn" id="toConnect" disabled>Sang xâu chuỗi →</button>
      </div>`;
    layer.querySelector("#newGroup").addEventListener("click", askGroupName);
    layer.querySelector("#toConnect").addEventListener("click", screenConnect);
    layoutClusters();
    for (let i = 0; i < 60; i++) relax();
    fitBoard();
    hud();
  }

  // Khung nhìn cho chặng nhóm/xâu chuỗi. Canh theo vị trí đích (tx/ty) chứ không
  // theo vị trí đang trôi, nếu không khung sẽ canh vào bố cục của chặng trước.
  function fitBoard(smooth) {
    const pills = S.phase === "cluster" ? S.ideas : [];
    const items = pills.map((n) => ({ x: n.tx, y: n.ty, w: n.w, h: n.h }))
      .concat(S.groups.map((g) => ({ x: g.x, y: g.y - 22, w: g.r * 2, h: g.r * 2 + 44 })));
    (smooth ? stage.flyTo : stage.fit)(items, { pad: 70, padTop: 175, padBottom: 120 });
  }

  function askGroupName() {
    prompt2({
      title: "🫧 Nhóm ý mới",
      desc: "Nhìn các ý đang có, chúng chia thành mấy loại? Đặt cho loại này một cái tên khái quát.",
      placeholder: "Ví dụ: Môi trường học · Thói quen · Công cụ hỗ trợ…",
      ok: "Tạo nhóm",
      onOk: (name) => {
        if (!name) return;
        S.groups.push({ id: "g" + (S.groups.length + 1), name, color: GROUP_COLORS[S.groups.length % GROUP_COLORS.length], x: 0, y: 0, r: 90 });
        blip(540, 0.1, "sine", 0.05);
        layoutClusters();
        for (let i = 0; i < 40; i++) relax();
        fitBoard(true);
        hud();
      },
    });
  }

  /* ---------- Chặng 3: xâu chuỗi ---------- */
  function screenConnect() {
    S.phase = "connect";
    steps("connect");
    layer.innerHTML = `
      <div class="g-banner">
        🔗 <b>Xâu chuỗi.</b> Bấm một nhóm rồi bấm nhóm thứ hai (hoặc kéo từ nhóm này sang nhóm kia) để nối: cái gì <i>dẫn tới</i>, cái gì <i>cản trở</i> cái gì.
      </div>
      <div class="g-inputbar">
        <span class="g-inline" id="linkInfo"></span>
        <button class="g-btn primary" id="toResult">Xem kết quả →</button>
      </div>`;
    layer.querySelector("#toResult").addEventListener("click", screenResult);
    layoutClusters();
    for (let i = 0; i < 60; i++) relax();
    fitBoard();
    hud();
  }

  function askRelation(a, b) {
    prompt2({
      title: "🔗 Quan hệ giữa hai nhóm",
      desc: `<b style="color:${a.color}">${escapeHtml(a.name)}</b> → <b style="color:${b.color}">${escapeHtml(b.name)}</b> — quan hệ là gì?`,
      placeholder: "dẫn tới / cần có / cản trở…",
      chips: RELATIONS,
      ok: "Nối",
      onOk: (label) => {
        S.links.push({ from: a.id, to: b.id, label: label || "dẫn tới" });
        blip(660, 0.09, "sine", 0.045);
        hud();
      },
    });
  }

  /* ---------- Chặng 4: kết quả ---------- */
  function screenResult() {
    S.phase = "result";
    steps("result");
    const n = S.ideas.length;
    const grouped = S.ideas.filter((i) => i.group).length;
    const lensN = S.lensesUsed.size;
    const depth = maxDepth();
    const score = n * 10 + lensN * 25 + S.groups.length * 40 + S.links.length * 35 + depth * 30;
    const rank = n >= TARGETS.great ? ["🌳", "Rừng ý tưởng"] : n >= TARGETS.good ? ["🌸", "Nở rộ"] : n >= TARGETS.min ? ["🌿", "Đã bung"] : ["🌱", "Mới nhú"];
    save(score);

    layer.innerHTML = `
      <div class="g-panel g-center">
        <div class="g-rank">${rank[0]}</div>
        <h2>${rank[1]}</h2>
        <div class="g-score">${score} <span>điểm</span></div>
        <table class="g-table">
          <tr><td>Ý tưởng bung ra</td><td>${n}</td><td>+${n * 10}</td></tr>
          <tr><td>Góc nhìn đã dùng <span class="g-muted">— ống kính</span></td><td>${lensN}/${LENSES.length}</td><td>+${lensN * 25}</td></tr>
          <tr><td>Nhóm đã khái quát</td><td>${S.groups.length}</td><td>+${S.groups.length * 40}</td></tr>
          <tr><td>Liên kết hệ thống</td><td>${S.links.length}</td><td>+${S.links.length * 35}</td></tr>
          <tr><td>Độ sâu đào ý <span class="g-muted">— tầng ý con</span></td><td>${depth}</td><td>+${depth * 30}</td></tr>
        </table>
        <p class="g-note">${coach(n, lensN, grouped)}</p>
        <div class="g-unlock">
          <h4>🔓 Bạn vừa tự làm ra mấy phương pháp khác:</h4>
          <ul>
            <li><b>Giản đồ ý (Bài 9)</b> — cây ý bạn vừa dựng chính là một mind map. Đã lưu sẵn vào Bài 9.</li>
            <li><b>Khái quát hóa (Bài 8)</b> — việc đặt tên cho ${S.groups.length} nhóm chính là rút ra khái niệm từ các ví dụ lẻ. Đã lưu vào Bài 8.</li>
            <li><b>Nới rộng khái niệm (Bài 3)</b> — thử lùi thêm một bậc: các nhóm này cùng phục vụ <i>mục đích</i> gì? Đã gợi sẵn ở Bài 3.</li>
            ${S.links.length ? `<li><b>Hệ thống hóa</b> — ${S.links.length} mũi tên nhân quả bạn vừa nối cho thấy nên tác động vào đâu trước.</li>` : ""}
          </ul>
        </div>
        <p class="g-saved">✓ Đã lưu toàn bộ vào phần Thực hành của Bài 1, 3, 8 và 9.</p>
        <div class="g-row center">
          <button class="g-btn" id="back3">← Sửa tiếp</button>
          <button class="g-btn primary" id="quit">Xong, xem ghi chú</button>
        </div>
      </div>`;
    layer.querySelector("#quit").addEventListener("click", () => ui.close());
    layer.querySelector("#back3").addEventListener("click", screenConnect);
  }

  function maxDepth() {
    let best = 0;
    for (const n of S.ideas) {
      let d = 0, cur = n;
      while (cur && cur.parent !== 0 && d < 12) { cur = nodeOf(cur.parent); d++; }
      best = Math.max(best, d + 1);
    }
    return best;
  }

  function coach(n, lensN, grouped) {
    if (n < TARGETS.min) return `Bạn mới có ${n} ý. Đừng dừng ở đây — hãy quay lại và xoay thêm vài ống kính nữa; ${TARGETS.min} ý là ngưỡng mà những ý thú vị mới bắt đầu xuất hiện.`;
    if (lensN < 6) return `Bạn bung được ${n} ý nhưng chỉ dùng ${lensN} góc nhìn. Ý sẽ đa dạng hơn nhiều nếu bạn soi qua cả những ống kính lạ như <i>màu sắc</i>, <i>ngược lại</i>, <i>thu nhỏ</i>.`;
    if (!S.groups.length) return "Bạn có nhiều ý nhưng chưa nhóm lại. Một đống ý rời rạc rất khó dùng — chính bước đặt tên nhóm mới biến chúng thành hiểu biết.";
    if (grouped < n * 0.6) return "Còn khá nhiều ý chưa vào nhóm nào. Những ý 'không xếp được' thường là ý độc đáo nhất — thử tạo riêng một nhóm cho chúng.";
    if (!S.links.length) return "Các nhóm của bạn còn đứng rời nhau. Thử nối chúng bằng quan hệ nhân quả — bạn sẽ thấy nên tác động vào đâu trước.";
    return "Rất tốt: bạn đã đi trọn vòng từ một hạt giống → nhiều ý → nhóm khái quát → hệ thống có quan hệ. Đây đúng là quy trình mà người làm sáng tạo chuyên nghiệp dùng.";
  }

  /* ---------- Lưu, nối sang các bài khác ---------- */
  function save(score) {
    try {
      const put = (k, v) => localStorage.setItem("ctp:" + k, JSON.stringify(v));
      const get = (k, d) => { try { return JSON.parse(localStorage.getItem("ctp:" + k)) ?? d; } catch { return d; } };

      // Bài 1 — danh sách ý, có phân nhóm
      const lines = [];
      for (const g of S.groups) {
        const mem = S.ideas.filter((i) => i.group === g.id);
        if (!mem.length) continue;
        lines.push(`【${g.name}】`);
        mem.forEach((m) => lines.push("• " + m.text));
      }
      const rest = S.ideas.filter((i) => !i.group);
      if (rest.length) { lines.push("【Chưa nhóm】"); rest.forEach((m) => lines.push("• " + m.text)); }
      for (const lk of S.links) {
        const a = S.groups.find((g) => g.id === lk.from), b = S.groups.find((g) => g.id === lk.to);
        if (a && b) lines.push(`→ ${a.name} ${lk.label} ${b.name}`);
      }
      put("note:brainstorm:ideas", get("note:brainstorm:ideas", []).concat(lines));

      // Bài 9 — Mind Map: tâm + nhánh đúng định dạng của bài đó
      if (S.groups.length) {
        put("note:mindmap:center", seedText);
        put("note:mindmap:branches", S.groups.map((g) => ({
          name: g.name,
          items: S.ideas.filter((i) => i.group === g.id).map((i) => i.text).join("\n"),
        })));
      }

      // Bài 8 — Khái quát hóa: ví dụ cụ thể -> điểm chung
      if (S.groups.length) {
        put("note:generalize:1", S.ideas.slice(0, 12).map((i) => "- " + i.text).join("\n"));
        put("note:generalize:2", S.groups.map((g) => "- " + g.name).join("\n"));
      }

      // Bài 3 — Nới rộng khái niệm: vấn đề -> các khái niệm giải pháp
      put("note:concept-fan:L0", seedText);
      if (S.groups.length) put("note:concept-fan:L2", S.groups.map((g) => "- " + g.name).join("\n"));

      const best = get("game:brainstorm:best", 0);
      if (score > best) put("game:brainstorm:best", score);
      const done = get("done", {});
      done.brainstorm = true;
      if (S.groups.length) { done.mindmap = true; done.generalize = true; }
      put("done", done);
    } catch {}
  }

  /* ---------- HUD phụ ---------- */
  function hud() {
    const q = (s) => layer.querySelector(s);
    if (S.phase === "expand") {
      const n = S.ideas.length;
      const bar = q("#pBar");
      if (bar) {
        bar.style.width = Math.min(100, (n / TARGETS.great) * 100) + "%";
        q("#pMin").style.left = (TARGETS.min / TARGETS.great) * 100 + "%";
        q("#pGood").style.left = (TARGETS.good / TARGETS.great) * 100 + "%";
        q("#pNum").textContent = n;
        q("#pMsg").innerHTML =
          n < TARGETS.min ? `còn <b>${TARGETS.min - n}</b> ý nữa là đủ ngưỡng` :
          n < TARGETS.good ? `đã qua ngưỡng ${TARGETS.min} · tới ${TARGETS.good} sẽ rất phong phú` :
          n < TARGETS.great ? `phong phú rồi · ráng tới ${TARGETS.great}!` : `xuất sắc — ${n} ý!`;
        const nb = q("#gNextPhase");
        nb.disabled = n < 8;
        nb.textContent = n < TARGETS.min ? `Sang nhóm ý → (nên có ${TARGETS.min})` : "Sang nhóm ý →";
      }
      const fb = q("#focusBar");
      if (fb) {
        const f = S.focus == null ? null : nodeOf(S.focus);
        fb.innerHTML = f
          ? `🎯 Đang đào sâu: <b>${escapeHtml(f.text)}</b> — ý mới sẽ mọc ra từ đây. <a id="unfocus">quay về hạt giống</a>`
          : `🎯 Đang mọc từ <b>hạt giống</b>. Mẹo: bấm vào một ý bất kỳ để đào sâu thêm từ ý đó.`;
        const u = q("#unfocus");
        if (u) u.addEventListener("click", () => { S.focus = null; hud(); });
      }
    }
    if (S.phase === "cluster") {
      const info = q("#clusterInfo");
      const grouped = S.ideas.filter((i) => i.group).length;
      if (info) info.innerHTML = `<b>${S.groups.length}</b> nhóm · đã xếp <b>${grouped}</b>/${S.ideas.length} ý`;
      const b = q("#toConnect");
      if (b) b.disabled = S.groups.length < 2;
    }
    if (S.phase === "connect") {
      const info = q("#linkInfo");
      if (info) info.innerHTML = S.linkFrom
        ? `Đang nối từ <b style="color:${S.linkFrom.color}">${escapeHtml(S.linkFrom.name)}</b> — bấm nhóm đích`
        : `<b>${S.links.length}</b> liên kết giữa <b>${S.groups.length}</b> nhóm`;
    }
  }

  /* ---------- Hộp nhập chung ---------- */
  function prompt2({ title, desc, placeholder, ok, chips, onOk }) {
    const box = document.createElement("div");
    box.className = "g-modal";
    box.innerHTML = `
      <div class="g-modal-card">
        <h3>${title}</h3>
        <p class="g-muted">${desc}</p>
        ${chips ? `<div class="g-chiprow">${chips.map((c) => `<button class="g-chip" data-c="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("")}</div>` : ""}
        <input id="p2in" type="text" placeholder="${escapeHtml(placeholder || "")}" />
        <div class="g-modal-actions">
          <button class="g-btn" id="p2cancel">Hủy</button>
          <button class="g-btn primary" id="p2ok">${ok}</button>
        </div>
      </div>`;
    layer.appendChild(box);
    const inp = box.querySelector("#p2in");
    inp.focus();
    const done = (accept) => { const v = inp.value.trim(); box.remove(); if (accept) onOk(v); };
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") done(true); if (e.key === "Escape") done(false); });
    box.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => { inp.value = b.dataset.c; done(true); }));
    box.querySelector("#p2ok").addEventListener("click", () => done(true));
    box.querySelector("#p2cancel").addEventListener("click", () => done(false));
  }

  function cleanup() { stage.dispose(); onFinish && onFinish(); }

  // Móc cho kiểm thử tự động: gắn trên chính phần tử game, không đổ ra biến toàn cục
  ui.root.__game = { state: S, stage, seed };

  screenIntro();
  return { close: () => ui.close() };
}
