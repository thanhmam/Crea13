// ==== Rèn Luyện Tư Duy Sáng Tạo — logic ứng dụng ====
(function () {
  "use strict";
  const M = window.METHODS;
  const app = document.getElementById("app");
  // Thư mục js/ — để nạp module game bằng đường dẫn tuyệt đối, không phụ thuộc trang hiện tại
  const JS_BASE = (document.currentScript && document.currentScript.src || "js/app.js").replace(/[^/]*$/, "");

  // Đăng ký game 3D cho từng phương pháp (sẽ bổ sung dần cho đủ 13 bài)
  const GAMES = {
    brainstorm: { file: "games/brainstorm.js", name: "Vụ Nổ Ý Tưởng", desc: "Bung ý tưởng vào vũ trụ 3D trước khi Kiểm Duyệt siết lại." },
  };

  // ---------- Lưu trữ ----------
  const store = {
    get(k, def) { try { const v = localStorage.getItem("ctp:" + k); return v === null ? def : JSON.parse(v); } catch { return def; } },
    set(k, v) { try { localStorage.setItem("ctp:" + k, JSON.stringify(v)); } catch {} },
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function getProblem() { return store.get("problem", ""); }
  function markDone(id) { const d = store.get("done", {}); d[id] = true; store.set("done", d); }
  function isDone(id) { return !!store.get("done", {})[id]; }

  // ---------- Đặt vấn đề (modal) ----------
  const modal = document.getElementById("problemModal");
  const problemInput = document.getElementById("problemInput");
  function openProblem() { problemInput.value = getProblem(); modal.classList.remove("hidden"); problemInput.focus(); }
  function closeProblem() { modal.classList.add("hidden"); }
  document.getElementById("problemBtn").addEventListener("click", openProblem);
  document.getElementById("problemClose").addEventListener("click", closeProblem);
  document.getElementById("problemSave").addEventListener("click", () => {
    store.set("problem", problemInput.value.trim());
    closeProblem(); refreshProblemLabel(); router();
  });
  modal.addEventListener("click", (e) => { if (e.target === modal) closeProblem(); });
  function refreshProblemLabel() {
    const p = getProblem();
    document.getElementById("problemLabel").textContent = p ? (p.length > 26 ? p.slice(0, 26) + "…" : p) : "Đặt vấn đề";
  }

  // ---------- Router ----------
  document.querySelectorAll("[data-nav]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); location.hash = el.dataset.nav === "home" ? "" : "#" + el.dataset.nav; })
  );
  window.addEventListener("hashchange", router);

  function router() {
    const h = location.hash.replace(/^#/, "");
    window.scrollTo(0, 0);
    if (h === "about") return renderAbout();
    const m = M.find((x) => x.id === h);
    if (m) return renderDetail(m);
    renderHome();
  }

  // ---------- Trang chính ----------
  function renderHome() {
    const p = getProblem();
    const doneCount = M.filter((m) => isDone(m.id)).length;
    const pct = Math.round((doneCount / M.length) * 100);
    app.innerHTML = `
      <section class="hero">
        <h1>Rèn luyện <span class="grad">tư duy sáng tạo</span><br/>với 13 phương pháp</h1>
        <p>Trong thời đại AI, phần nguy hiểm nhất không phải máy thông minh hơn, mà là con người <b>lười suy nghĩ</b> đi. Đây là sân tập: mỗi phương pháp một bài thực hành có hướng dẫn, đồng hồ và ô ghi ý — để bộ não của bạn luôn được vận động.</p>
        <div class="cta">
          <button class="btn primary" id="startBtn">${p ? "🎯 Đổi vấn đề đang luyện" : "🎯 Bắt đầu: đặt một vấn đề"}</button>
          <a class="btn ghost" href="#about">Vì sao cần luyện?</a>
        </div>
        ${p ? `<div class="progress-strip wrap" style="max-width:520px;margin:22px auto 0">
                 <span class="muted" style="font-size:.85rem">Đã luyện ${doneCount}/${M.length}</span>
                 <div class="progress-bar"><span style="width:${pct}%"></span></div>
               </div>` : ""}
      </section>
      <section class="grid">
        ${M.map((m) => `
          <div class="card" data-go="${m.id}">
            <span class="ic">${m.icon}</span>
            <span class="no">BÀI ${m.no}</span>
            <h3>${esc(m.title)}</h3>
            <span class="en">${esc(m.en)}</span>
            <span class="tag">${esc(m.tagline)}</span>
            ${isDone(m.id) ? `<span class="done-badge">✓ Đã luyện</span>` : ""}
          </div>`).join("")}
      </section>`;
    document.getElementById("startBtn").addEventListener("click", openProblem);
    app.querySelectorAll("[data-go]").forEach((c) => c.addEventListener("click", () => (location.hash = "#" + c.dataset.go)));
  }

  // ---------- Trang giới thiệu ----------
  function renderAbout() {
    app.innerHTML = `
      <section class="about">
        <a class="back" onclick="history.length>1?history.back():location.hash=''">← Quay lại</a>
        <h2>Vì sao phải rèn luyện tư duy?</h2>
        <p>Loạt bài <i>“Các Phương Pháp Suy Luận và Sáng Tạo”</i> trên Vietsciences đã giúp rất nhiều người hình thành cách nghĩ có hệ thống. Sáng tạo không phải năng khiếu trời cho của số ít — nó là <b>kỹ năng có thể rèn</b> bằng những phương pháp cụ thể, lặp đi lặp lại.</p>
        <div class="quote">“AI có thể trả lời thay bạn, nhưng nó không thể <b>đặt câu hỏi</b> thay bạn, không thể quyết định <b>vấn đề nào đáng giải</b> thay bạn. Đó là phần việc của tư duy con người — và nó teo đi nếu không dùng.”</div>
        <p>Website này biến 13 phương pháp thành 13 bài tập tương tác. Cách dùng gợi ý:</p>
        <ol>
          <li><b>Đặt một vấn đề thật</b> của bạn (nút 🎯 ở góc trên). Nó sẽ theo bạn qua mọi bài.</li>
          <li>Mỗi ngày chọn một phương pháp, làm bài tập của nó với chính vấn đề đó.</li>
          <li>Ghi chú được lưu ngay trên máy bạn (localStorage) — không gửi đi đâu cả.</li>
          <li>Đi hết 13 góc nhìn, bạn sẽ thấy vấn đề của mình sáng ra rất nhiều.</li>
        </ol>
        <p class="muted">Toàn bộ dữ liệu bạn nhập chỉ nằm trong trình duyệt của bạn. Xóa lịch sử trình duyệt sẽ xóa dữ liệu.</p>
        <a class="btn primary" href="#">Bắt đầu luyện →</a>
      </section>`;
  }

  // ---------- Trang chi tiết phương pháp ----------
  function renderDetail(m) {
    const p = getProblem();
    const banner = p
      ? `<div class="problem-banner">🎯 Vấn đề đang luyện: <b>${esc(p)}</b> · <a id="editProblem">đổi</a></div>`
      : `<div class="problem-banner">Bạn chưa đặt vấn đề. <a id="editProblem">Đặt một vấn đề</a> để bài tập bám sát chuyện thật của bạn.</div>`;
    app.innerHTML = `
      <section class="detail">
        <span class="back" id="backBtn">← Tất cả phương pháp</span>
        <div class="detail-head">
          <span class="ic">${m.icon}</span>
          <div>
            <div class="no">BÀI ${m.no} · ${esc(m.en)}</div>
            <h2>${esc(m.title)}</h2>
            <div class="tag muted">${esc(m.tagline)}</div>
          </div>
        </div>
        ${banner}
        <div class="two-col">
          <div class="panel"><h4>💡 Là gì?</h4><p class="intro">${m.intro}</p></div>
          <div class="panel">
            <h4>📐 Nguyên tắc</h4><ul>${m.principles.map((x) => `<li>${x}</li>`).join("")}</ul>
          </div>
        </div>
        <div class="panel"><h4>🪜 Các bước</h4><ol>${m.steps.map((x) => `<li>${x}</li>`).join("")}</ol></div>
        ${gameCta(m)}
        <div class="panel">
          <h4>✍️ Thực hành</h4>
          <div class="workshop" id="workshop"></div>
        </div>
      </section>`;
    document.getElementById("backBtn").addEventListener("click", () => (location.hash = ""));
    const ep = document.getElementById("editProblem");
    if (ep) ep.addEventListener("click", openProblem);
    const playBtn = document.getElementById("playBtn");
    if (playBtn) playBtn.addEventListener("click", () => launchGame(m));
    renderWorkshop(m, document.getElementById("workshop"));
  }

  // ---------- Game 3D ----------
  function gameCta(m) {
    const g = GAMES[m.id];
    if (!g) return "";
    const best = store.get("game:" + m.id + ":best", 0);
    return `
      <div class="play-cta">
        <span class="pc-ic">🎮</span>
        <span class="pc-txt">
          <b>Game 3D: ${esc(g.name)}</b>
          <span>${esc(g.desc)}</span>
        </span>
        ${best ? `<span class="pc-best">🏆 Kỷ lục ${best}</span>` : ""}
        <button class="btn" id="playBtn">Chơi ngay →</button>
      </div>`;
  }

  async function launchGame(m) {
    const g = GAMES[m.id];
    if (!g) return;
    const btn = document.getElementById("playBtn");
    if (btn) { btn.disabled = true; btn.textContent = "Đang tải…"; }
    try {
      const mod = await import(JS_BASE + g.file);
      mod.launch({ problem: getProblem(), onFinish: () => router() });
    } catch (err) {
      console.error(err);
      alert("Không tải được game. Trang cần chạy qua máy chủ web (ví dụ: python3 -m http.server) chứ không mở trực tiếp bằng file://");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "Chơi ngay →"; }
    }
  }

  // Ô ghi chú tự lưu dùng chung
  function autoNote(key, placeholder, rows) {
    const id = "n_" + Math.random().toString(36).slice(2);
    setTimeout(() => {
      const ta = document.getElementById(id);
      if (!ta) return;
      ta.value = store.get(key, "");
      ta.addEventListener("input", () => { store.set(key, ta.value); markDone(currentMethodId); flashSaved(ta); });
    });
    return `<textarea id="${id}" rows="${rows || 3}" placeholder="${esc(placeholder)}"></textarea>`;
  }
  let currentMethodId = null;
  let savedTimer = null;
  function flashSaved(el) {
    let hint = el.parentNode.querySelector(".saved-hint");
    if (!hint) { hint = document.createElement("div"); hint.className = "saved-hint"; el.parentNode.appendChild(hint); }
    hint.textContent = "✓ Đã lưu";
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => (hint.textContent = ""), 1200);
  }

  // ---------- Các loại workshop ----------
  function renderWorkshop(m, root) {
    currentMethodId = m.id;
    const t = m.practice.type;
    const K = (suffix) => `note:${m.id}:${suffix}`;
    if (t === "brainstorm") return wBrainstorm(m, root, K);
    if (t === "random-word") return wRandomWord(m, root, K);
    if (t === "provocation") return wProvocation(m, root, K);
    if (t === "hats") return wHats(m, root, K);
    if (t === "stages" || t === "ladder") return wStages(m, root, K);
    if (t === "mindmap") return wMindmap(m, root, K);
    if (t === "analogy") return wAnalogy(m, root, K);
    if (t === "reversal") return wReversal(m, root, K);
    root.innerHTML = autoNote(K("free"), "Ghi ý tưởng của bạn...", 5);
  }

  // Tập kích não: timer + danh sách ý
  function wBrainstorm(m, root, K) {
    root.innerHTML = `
      <div class="timer-row">
        <span class="timer" id="tmr">${String(m.practice.minutes).padStart(2, "0")}:00</span>
        <button class="btn primary small" id="tStart">Bắt đầu</button>
        <button class="btn small" id="tReset">Đặt lại</button>
        <span class="muted">Bung ý tối đa. <b>Không phê phán</b> trong lúc chạy giờ. Đã ghi: <span class="counter" id="cnt">0</span></span>
      </div>
      <div class="idea-add">
        <input type="text" id="ideaIn" placeholder="Gõ một ý rồi Enter — càng nhanh, càng nhiều càng tốt" />
        <button class="btn primary" id="ideaAdd">Thêm</button>
      </div>
      <ul class="idea-list" id="ideas"></ul>`;
    const key = K("ideas");
    let ideas = store.get(key, []);
    const listEl = root.querySelector("#ideas");
    const cnt = root.querySelector("#cnt");
    function draw() {
      listEl.innerHTML = ideas.map((x, i) => `<li><span>${esc(x)}</span><button data-i="${i}">✕</button></li>`).join("");
      cnt.textContent = ideas.length;
      listEl.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { ideas.splice(+b.dataset.i, 1); save(); }));
    }
    function save() { store.set(key, ideas); if (ideas.length) markDone(m.id); draw(); }
    const input = root.querySelector("#ideaIn");
    function add() { const v = input.value.trim(); if (!v) return; ideas.push(v); input.value = ""; save(); input.focus(); }
    root.querySelector("#ideaAdd").addEventListener("click", add);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") add(); });
    draw();
    // timer
    let total = m.practice.minutes * 60, left = total, iv = null;
    const tmr = root.querySelector("#tmr");
    function show() { tmr.textContent = String(Math.floor(left / 60)).padStart(2, "0") + ":" + String(left % 60).padStart(2, "0"); }
    root.querySelector("#tStart").addEventListener("click", (e) => {
      if (iv) { clearInterval(iv); iv = null; e.target.textContent = "Tiếp tục"; return; }
      e.target.textContent = "Tạm dừng";
      iv = setInterval(() => { left--; show(); if (left <= 0) { clearInterval(iv); iv = null; e.target.textContent = "Bắt đầu"; left = total; tmr.textContent = "HẾT GIỜ"; } }, 1000);
    });
    root.querySelector("#tReset").addEventListener("click", () => { clearInterval(iv); iv = null; left = total; show(); root.querySelector("#tStart").textContent = "Bắt đầu"; });
  }

  // Từ khóa ngẫu nhiên
  function wRandomWord(m, root, K) {
    root.innerHTML = `
      <div class="word-box"><div class="word" id="word">— bấm nút —</div></div>
      <div style="text-align:center;margin-bottom:16px"><button class="btn primary" id="roll">🎲 Lấy từ ngẫu nhiên</button></div>
      <div class="field"><label>Đặc điểm / liên tưởng của từ này <span class="hint">(5–7 gạch đầu dòng)</span></label>${autoNote(K("attrs"), "- ...\n- ...", 5)}</div>
      <div class="field"><label>Ép nối về vấn đề của bạn <span class="hint">— mỗi đặc điểm gợi ra giải pháp gì?</span></label>${autoNote(K("bridge"), "Từ đặc điểm ... mình nghĩ tới ...", 5)}</div>`;
    const wordEl = root.querySelector("#word");
    root.querySelector("#roll").addEventListener("click", () => {
      const w = window.RANDOM_WORDS[Math.floor(Math.random() * window.RANDOM_WORDS.length)];
      wordEl.textContent = w; store.set(K("word"), w);
    });
    const saved = store.get(K("word"), ""); if (saved) wordEl.textContent = saved;
  }

  // Kích hoạt PO
  function wProvocation(m, root, K) {
    root.innerHTML = `
      <div class="field"><label>1. Một giả định mặc nhiên về vấn đề</label>${autoNote(K("assume"), "Ai cũng cho rằng...", 2)}</div>
      <div class="field"><label>2. Chọn cách tạo câu kích hoạt (PO)</label>
        <div class="hat-tabs" id="ops">${m.practice.operators.map((o) => `<span class="hat-tab" data-op="${esc(o)}">${esc(o)}</span>`).join("")}</div>
      </div>
      <div class="field"><label>3. Câu kích hoạt (PO) — cố ý phi lý</label>${autoNote(K("po"), "PO: ...", 2)}</div>
      <div class="field"><label>4. Khai thác: nếu vậy thì sao? Gợi ra giải pháp thực tế nào?</label>${autoNote(K("harvest"), "Nếu điều đó đúng thì... → giải pháp thực tế là...", 5)}</div>`;
    root.querySelectorAll("#ops .hat-tab").forEach((t) =>
      t.addEventListener("click", () => { root.querySelectorAll("#ops .hat-tab").forEach((x) => x.classList.remove("active")); t.classList.add("active"); store.set(K("op"), t.dataset.op); })
    );
    const savedOp = store.get(K("op"), "");
    if (savedOp) { const el = root.querySelector(`[data-op="${CSS.escape(savedOp)}"]`); if (el) el.classList.add("active"); }
  }

  // Sáu chiếc mũ
  function wHats(m, root, K) {
    const hats = m.practice.hats;
    root.innerHTML = `
      <div class="hat-tabs" id="tabs">${hats.map((h, i) => `<span class="hat-tab ${i === 0 ? "active" : ""}" data-i="${i}" style="background:${h.color}">${h.name}</span>`).join("")}</div>
      <div class="hat-desc" id="hdesc"></div>
      <div id="hnote"></div>`;
    const descEl = root.querySelector("#hdesc");
    const noteEl = root.querySelector("#hnote");
    function pick(i) {
      const h = hats[i];
      root.querySelectorAll("#tabs .hat-tab").forEach((x) => x.classList.toggle("active", +x.dataset.i === i));
      descEl.style.background = h.color;
      descEl.innerHTML = `<b>Mũ ${h.name}:</b> ${esc(h.desc)}`;
      noteEl.innerHTML = autoNote(K("hat_" + h.key), "Suy nghĩ dưới mũ " + h.name + "...", 4);
    }
    root.querySelectorAll("#tabs .hat-tab").forEach((t) => t.addEventListener("click", () => pick(+t.dataset.i)));
    pick(0);
  }

  // Các giai đoạn / thang (stages & ladder)
  function wStages(m, root, K) {
    const stages = m.practice.stages || m.practice.levels.map((l, i) => ({ key: "L" + i, name: l, desc: "" }));
    root.innerHTML = stages.map((s) => `
      <div class="stage">
        <h5>${esc(s.name)}</h5>
        ${s.desc ? `<div class="desc">${esc(s.desc)}</div>` : ""}
        ${autoNote(K(s.key), "...", 3)}
      </div>`).join("");
  }

  // Mind map (dạng cây văn bản đơn giản)
  function wMindmap(m, root, K) {
    const p = getProblem();
    root.innerHTML = `
      <div class="field"><label>Chủ đề trung tâm</label><input type="text" id="center" placeholder="${esc(p || "Chủ đề chính")}" /></div>
      <p class="muted">Thêm các nhánh chính. Mỗi nhánh gõ các ý con, mỗi ý một dòng.</p>
      <div id="branches"></div>
      <button class="btn small" id="addBranch">＋ Thêm nhánh chính</button>`;
    const centerEl = root.querySelector("#center");
    centerEl.value = store.get(K("center"), p || "");
    centerEl.addEventListener("input", () => { store.set(K("center"), centerEl.value); markDone(m.id); });
    const branchesEl = root.querySelector("#branches");
    let branches = store.get(K("branches"), [{ name: "", items: "" }]);
    function save() { store.set(K("branches"), branches); markDone(m.id); }
    function draw() {
      branchesEl.innerHTML = branches.map((b, i) => `
        <div class="stage">
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
            <input type="text" data-n="${i}" placeholder="Nhánh chính ${i + 1}" value="${esc(b.name)}" style="font-weight:700" />
            <button class="btn small ghost" data-del="${i}">✕</button>
          </div>
          <textarea data-t="${i}" rows="3" placeholder="Ý con (mỗi dòng một ý)">${esc(b.items)}</textarea>
        </div>`).join("");
      branchesEl.querySelectorAll("[data-n]").forEach((el) => el.addEventListener("input", () => { branches[+el.dataset.n].name = el.value; save(); }));
      branchesEl.querySelectorAll("[data-t]").forEach((el) => el.addEventListener("input", () => { branches[+el.dataset.t].items = el.value; save(); }));
      branchesEl.querySelectorAll("[data-del]").forEach((el) => el.addEventListener("click", () => { branches.splice(+el.dataset.del, 1); if (!branches.length) branches = [{ name: "", items: "" }]; save(); draw(); }));
    }
    root.querySelector("#addBranch").addEventListener("click", () => { branches.push({ name: "", items: "" }); save(); draw(); });
    draw();
  }

  // Loại suy cưỡng bức
  function wAnalogy(m, root, K) {
    root.innerHTML = `
      <div class="word-box"><div class="word" id="obj">— bấm nút —</div></div>
      <div style="text-align:center;margin-bottom:16px"><button class="btn primary" id="roll">🎲 Lấy đối tượng ngẫu nhiên</button></div>
      <div class="field"><label>Đối tượng này hoạt động / có đặc tính gì?</label>${autoNote(K("attrs"), "- Nó...\n- Nó...", 4)}</div>
      <div class="field"><label>Ánh xạ sang vấn đề của bạn</label>${autoNote(K("map"), "Giống chỗ nó..., vấn đề mình có thể...", 5)}</div>`;
    const objEl = root.querySelector("#obj");
    root.querySelector("#roll").addEventListener("click", () => {
      const w = window.RANDOM_WORDS[Math.floor(Math.random() * window.RANDOM_WORDS.length)];
      objEl.textContent = w; store.set(K("obj"), w);
    });
    const saved = store.get(K("obj"), ""); if (saved) objEl.textContent = saved;
  }

  // Đảo lộn vấn đề
  function wReversal(m, root, K) {
    const p = getProblem();
    root.innerHTML = `
      <div class="field"><label>Mục tiêu gốc</label><input type="text" id="goal" placeholder="${esc(p || "Mục tiêu bạn muốn đạt")}" /></div>
      <div class="rev-cols">
        <div class="field"><label>😈 Phản mục tiêu <span class="hint">— làm sao để TỆ nhất / chắc chắn thất bại?</span></label>${autoNote(K("anti"), "Muốn hỏng bét thì cứ...", 6)}</div>
        <div class="field"><label>✅ Lật ngược thành giải pháp thật</label>${autoNote(K("flip"), "Vậy thì nên tránh... / nên làm ngược lại là...", 6)}</div>
      </div>`;
    const goalEl = root.querySelector("#goal");
    goalEl.value = store.get(K("goal"), p || "");
    goalEl.addEventListener("input", () => { store.set(K("goal"), goalEl.value); markDone(m.id); });
  }

  // ---------- Khởi động ----------
  refreshProblemLabel();
  router();
})();
