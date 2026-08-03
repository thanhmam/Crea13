// Dữ liệu 13 phương pháp suy nghĩ sáng tạo
// Tham khảo loạt bài "Các Phương Pháp Suy Luận và Sáng Tạo" - Vietsciences
// Nội dung được biên soạn lại cho mục đích thực hành, rèn luyện tư duy.

window.METHODS = [
  {
    id: "brainstorm",
    no: 1,
    title: "Tập Kích Não",
    en: "Brainstorming",
    icon: "🧠",
    tagline: "Bung thật nhiều ý tưởng trước, phán xét sau.",
    intro:
      "Tập kích não do Alex Osborn đề xướng: tách rời hoàn toàn giai đoạn <b>sản sinh ý tưởng</b> khỏi giai đoạn <b>đánh giá</b>. Khi não vừa nghĩ vừa chê, nó tự bóp nghẹt những ý non trẻ nhưng có thể rất giá trị. Mục tiêu là số lượng: càng nhiều ý càng dễ có ý hay.",
    principles: [
      "Không phê phán, không chê bai bất kỳ ý tưởng nào trong lúc đang nghĩ.",
      "Hoan nghênh ý tưởng điên rồ, kỳ quặc — càng thoáng càng tốt.",
      "Chạy theo số lượng: nhiều ý tưởng làm tăng xác suất có ý tưởng tốt.",
      "Kết hợp và cải tiến: dựa trên ý người khác (hoặc ý cũ) để bật ý mới.",
    ],
    steps: [
      "Viết rõ vấn đề dưới dạng một câu hỏi mở.",
      "Đặt giới hạn thời gian (ví dụ 5–10 phút) và bung tối đa ý tưởng.",
      "Ghi lại tất cả, không dừng lại để đánh giá.",
      "Sau khi hết giờ mới quay lại sàng lọc, nhóm và chọn lọc.",
    ],
    practice: { type: "brainstorm", minutes: 5 },
  },
  {
    id: "random-input",
    no: 2,
    title: "Thâu Thập Ngẫu Nhiên",
    en: "Random Input",
    icon: "🎲",
    tagline: "Một từ lạ có thể mở ra một hướng đi mới.",
    intro:
      "Kỹ thuật của Edward de Bono: khi bí, hãy cố tình đưa vào một <b>kích thích ngẫu nhiên</b> (một từ, một hình ảnh không liên quan) rồi ép não bắc cầu giữa nó và vấn đề. Vì ngẫu nhiên nên nó phá vỡ lối mòn tư duy, buộc ta rời khỏi những liên tưởng quen thuộc.",
    principles: [
      "Từ khóa phải thực sự ngẫu nhiên, KHÔNG chọn từ liên quan sẵn tới vấn đề.",
      "Không gạt bỏ từ vì thấy 'vô lý' — chính sự vô lý tạo ra góc nhìn mới.",
      "Liệt kê thuộc tính, chức năng, liên tưởng của từ đó rồi nối về vấn đề.",
    ],
    steps: [
      "Xác định vấn đề cần ý tưởng.",
      "Lấy một từ ngẫu nhiên (bấm nút bên dưới).",
      "Viết ra 5–7 đặc điểm/liên tưởng của từ đó.",
      "Với mỗi đặc điểm, ép nối về vấn đề: 'Điều này gợi cho mình giải pháp gì?'",
    ],
    practice: { type: "random-word" },
  },
  {
    id: "concept-fan",
    no: 3,
    title: "Nới Rộng Khái Niệm",
    en: "Concept Fan",
    icon: "🪭",
    tagline: "Lùi một bước để thấy nhiều con đường hơn.",
    intro:
      "Khi mọi giải pháp trước mắt đều bế tắc, hãy <b>lùi lên mức khái niệm cao hơn</b>. Từ vấn đề cụ thể → hỏi 'mục đích thật sự là gì?' → từ mục đích đó bung ra nhiều khái niệm giải pháp khác nhau → từ mỗi khái niệm lại bung ra ý tưởng cụ thể. Giống một chiếc quạt xòe dần.",
    principles: [
      "Luôn hỏi 'Vậy rốt cuộc mình muốn đạt điều gì?' để lên mức trừu tượng.",
      "Một mục đích có thể đạt bằng nhiều khái niệm khác nhau.",
      "Mỗi khái niệm lại sinh ra nhiều ý tưởng cụ thể.",
    ],
    steps: [
      "Viết vấn đề cụ thể.",
      "Lùi lên: mục đích/hướng đi tổng quát là gì?",
      "Liệt kê các khái niệm (cách tiếp cận) khác nhau để đạt mục đích đó.",
      "Với mỗi khái niệm, đề xuất ý tưởng cụ thể.",
    ],
    practice: {
      type: "ladder",
      levels: ["Vấn đề cụ thể", "Mục đích tổng quát", "Các khái niệm giải pháp", "Ý tưởng cụ thể"],
    },
  },
  {
    id: "provocation",
    no: 4,
    title: "Kích Hoạt (PO)",
    en: "Provocation",
    icon: "⚡",
    tagline: "Tuyên bố một điều vô lý, rồi tìm cái hợp lý bên trong.",
    intro:
      "De Bono dùng từ 'PO' để đánh dấu một <b>phát biểu khiêu khích, phi lý một cách cố ý</b> (ví dụ: 'Ô tô có bánh xe vuông'). Ta không tin nó, mà dùng nó làm bàn đạp: 'Nếu điều này đúng thì hệ quả là gì?' — để nhảy ra khỏi khuôn mẫu logic thường ngày.",
    principles: [
      "Câu kích hoạt phải phá vỡ một giả định đang mặc nhiên đúng.",
      "Không đánh giá đúng/sai câu kích hoạt — chỉ khai thác hệ quả của nó.",
      "Vài cách tạo PO: đảo ngược, phóng đại, loại bỏ, mơ ước viển vông.",
    ],
    steps: [
      "Nêu một giả định mặc nhiên về vấn đề.",
      "Tạo câu kích hoạt bằng cách đảo/phóng đại/loại bỏ giả định đó.",
      "Khai thác: 'Nếu vậy thì sao? Điều đó gợi ra giải pháp thực tế nào?'",
    ],
    practice: {
      type: "provocation",
      operators: ["Đảo ngược", "Phóng đại", "Loại bỏ", "Mơ ước viển vông"],
    },
  },
  {
    id: "six-hats",
    no: 5,
    title: "Sáu Chiếc Mũ Tư Duy",
    en: "Six Thinking Hats",
    icon: "🎩",
    tagline: "Mỗi lúc chỉ tư duy theo một kiểu.",
    intro:
      "De Bono chia tư duy thành 6 vai trò, tượng trưng bằng 6 chiếc mũ màu. Cả nhóm (hoặc một mình) cùng 'đội' một mũ tại một thời điểm để tránh cãi nhau chồng chéo. Nó tách cảm xúc khỏi dữ kiện, phê phán khỏi sáng tạo.",
    principles: [
      "Trắng: dữ kiện, số liệu khách quan.",
      "Đỏ: cảm xúc, trực giác — được phép nói mà không cần lý do.",
      "Đen: thận trọng, rủi ro, điểm yếu.",
      "Vàng: lạc quan, lợi ích, giá trị.",
      "Xanh lá: sáng tạo, ý tưởng mới, phương án khác.",
      "Xanh dương: điều phối, tổng kết, quyết định bước tiếp theo.",
    ],
    steps: [
      "Đội lần lượt từng mũ, mỗi mũ dành riêng cho một kiểu suy nghĩ.",
      "Ghi lại điều nghĩ được dưới mỗi mũ.",
      "Kết thúc bằng mũ xanh dương để tổng kết và ra quyết định.",
    ],
    practice: {
      type: "hats",
      hats: [
        { key: "white", name: "Trắng", color: "#e8eef5", desc: "Dữ kiện, số liệu, thông tin khách quan. Ta đang biết gì? Còn thiếu gì?" },
        { key: "red", name: "Đỏ", color: "#f8d7da", desc: "Cảm xúc, trực giác. Mình cảm thấy thế nào về vấn đề này?" },
        { key: "black", name: "Đen", color: "#d6d8db", desc: "Rủi ro, khó khăn, điểm yếu. Điều gì có thể sai?" },
        { key: "yellow", name: "Vàng", color: "#fff3cd", desc: "Lợi ích, giá trị, mặt tích cực. Vì sao điều này đáng làm?" },
        { key: "green", name: "Xanh lá", color: "#d4edda", desc: "Sáng tạo, phương án mới, khả năng khác." },
        { key: "blue", name: "Xanh dương", color: "#cfe2f3", desc: "Tổng kết, điều phối. Kết luận và bước tiếp theo là gì?" },
      ],
    },
  },
  {
    id: "doit",
    no: 6,
    title: "DOIT",
    en: "DOIT",
    icon: "🎯",
    tagline: "Quy trình gọn: Xác định → Mở → Chọn → Thực thi.",
    intro:
      "DOIT của Robert Olson là khung tổng quát cho cả quá trình sáng tạo: <b>D</b>efine (xác định vấn đề), <b>O</b>pen (mở ra ý tưởng), <b>I</b>dentify (chọn giải pháp tốt nhất), <b>T</b>ransform (biến thành hành động).",
    principles: [
      "Define: phát biểu vấn đề đúng và đủ hẹp để giải được.",
      "Open: dùng các kỹ thuật khác (tập kích não, ngẫu nhiên...) để bung ý.",
      "Identify: đánh giá và chọn giải pháp theo tiêu chí rõ ràng.",
      "Transform: lập kế hoạch cụ thể để hiện thực hóa.",
    ],
    steps: [
      "D — Viết lại vấn đề cho thật rõ.",
      "O — Liệt kê nhiều ý tưởng.",
      "I — Chấm điểm và chọn ý tốt nhất.",
      "T — Ghi các bước hành động cụ thể.",
    ],
    practice: {
      type: "stages",
      stages: [
        { key: "D", name: "Define — Xác định", desc: "Vấn đề thực sự là gì? Viết một câu hỏi rõ ràng." },
        { key: "O", name: "Open — Mở rộng", desc: "Bung ra càng nhiều ý tưởng càng tốt." },
        { key: "I", name: "Identify — Chọn lọc", desc: "Chọn (các) ý tưởng tốt nhất và giải thích vì sao." },
        { key: "T", name: "Transform — Hành động", desc: "Kế hoạch cụ thể: làm gì, khi nào, bước đầu tiên?" },
      ],
    },
  },
  {
    id: "simplex",
    no: 7,
    title: "Simplex",
    en: "Simplex",
    icon: "🔄",
    tagline: "Vòng lặp 8 bước không có điểm kết thúc.",
    intro:
      "Simplex của Min Basadur xem sáng tạo là một <b>chu trình liên tục</b>: giải xong vấn đề này lại dẫn tới vấn đề mới. Gồm 8 bước, đi hết vòng rồi lại bắt đầu — phù hợp cho cải tiến không ngừng.",
    principles: [
      "Sáng tạo không phải sự kiện một lần mà là dòng chảy liên tục.",
      "Mỗi bước xen kẽ giữa tư duy phân kỳ (bung ra) và hội tụ (chọn lọc).",
    ],
    steps: [
      "Tìm vấn đề (Problem finding).",
      "Thu thập dữ kiện (Fact finding).",
      "Định nghĩa vấn đề (Problem definition).",
      "Tìm ý tưởng (Idea finding).",
      "Chọn và đánh giá (Selection).",
      "Lập kế hoạch (Planning).",
      "Thuyết phục, tạo đồng thuận (Sell idea).",
      "Hành động (Action) → quay lại bước 1.",
    ],
    practice: {
      type: "stages",
      stages: [
        { key: "1", name: "Tìm vấn đề", desc: "Điều gì đang chưa ổn hoặc có thể tốt hơn?" },
        { key: "2", name: "Thu thập dữ kiện", desc: "Ta biết gì? Ai liên quan? Dữ liệu nào cần?" },
        { key: "3", name: "Định nghĩa vấn đề", desc: "Phát biểu lại: 'Làm thế nào để...?'" },
        { key: "4", name: "Tìm ý tưởng", desc: "Bung ra nhiều giải pháp." },
        { key: "5", name: "Chọn & đánh giá", desc: "Ý nào khả thi và giá trị nhất?" },
        { key: "6", name: "Lập kế hoạch", desc: "Các bước, nguồn lực, thời gian." },
        { key: "7", name: "Tạo đồng thuận", desc: "Ai cần ủng hộ? Thuyết phục thế nào?" },
        { key: "8", name: "Hành động", desc: "Bước đầu tiên làm ngay là gì?" },
      ],
    },
  },
  {
    id: "generalize",
    no: 8,
    title: "Khái Quát Hóa & Khái Niệm Hóa",
    en: "Generalization",
    icon: "🔺",
    tagline: "Từ cái riêng lẻ rút ra quy luật chung.",
    intro:
      "Từ nhiều trường hợp cụ thể, ta <b>trừu tượng hóa</b> để tìm ra điểm chung, quy luật, khái niệm bao trùm. Khi nắm được khái niệm, ta áp dụng được cho vô số tình huống mới thay vì xử lý từng ca một.",
    principles: [
      "Gom các ví dụ cụ thể lại, tìm điểm chung cốt lõi.",
      "Đặt tên cho quy luật/khái niệm vừa rút ra.",
      "Kiểm tra: khái niệm đó áp dụng được cho trường hợp mới nào?",
    ],
    steps: [
      "Liệt kê vài trường hợp/ví dụ cụ thể liên quan.",
      "Tìm mẫu số chung giữa chúng.",
      "Phát biểu thành một nguyên lý/khái niệm tổng quát.",
      "Thử áp dụng nguyên lý đó vào một tình huống mới.",
    ],
    practice: {
      type: "stages",
      stages: [
        { key: "1", name: "Các ví dụ cụ thể", desc: "Liệt kê 3–5 trường hợp riêng lẻ." },
        { key: "2", name: "Điểm chung", desc: "Chúng giống nhau ở điều gì cốt lõi?" },
        { key: "3", name: "Nguyên lý tổng quát", desc: "Phát biểu quy luật/khái niệm chung." },
        { key: "4", name: "Áp dụng mới", desc: "Dùng nguyên lý đó cho một tình huống khác." },
      ],
    },
  },
  {
    id: "mindmap",
    no: 9,
    title: "Giản Đồ Ý (Mind Map)",
    en: "Mind Map",
    icon: "🕸️",
    tagline: "Vẽ ý tưởng theo cách bộ não thực sự liên tưởng.",
    intro:
      "Tony Buzan phát triển Mind Map: đặt chủ đề ở trung tâm, tỏa ra các nhánh chính, mỗi nhánh lại tỏa nhánh phụ. Cấu trúc tỏa tia này khớp với cách não liên tưởng, giúp nhìn tổng thể và phát hiện mối liên hệ mới.",
    principles: [
      "Chủ đề chính ở trung tâm.",
      "Mỗi nhánh một ý/từ khóa, không viết câu dài.",
      "Dùng màu, hình ảnh, từ khóa ngắn để kích thích trí nhớ.",
      "Để các nhánh tự do phân nhánh tiếp.",
    ],
    steps: [
      "Viết chủ đề trung tâm.",
      "Thêm các nhánh chính (khía cạnh lớn).",
      "Với mỗi nhánh chính, thêm nhánh phụ chi tiết.",
      "Nhìn tổng thể để phát hiện liên hệ và ý mới.",
    ],
    practice: { type: "mindmap" },
  },
  {
    id: "forced-analogy",
    no: 10,
    title: "Tương Tự & Cưỡng Bức Tương Tự",
    en: "Forced Analogy",
    icon: "🔗",
    tagline: "Ép vấn đề của bạn giống một thứ chẳng liên quan.",
    intro:
      "Ta lấy một <b>đối tượng ngẫu nhiên</b> (ví dụ: cây cầu, con ong, chiếc đồng hồ) và <b>ép so sánh</b> vấn đề với nó: 'Vấn đề của mình giống đối tượng này ở chỗ nào? Đối tượng này giải quyết chuyện tương tự ra sao?' Sự cưỡng bức tạo ra liên tưởng bất ngờ.",
    principles: [
      "Chọn đối tượng càng xa vấn đề càng tốt.",
      "Liệt kê đặc điểm/cách vận hành của đối tượng.",
      "Ép mỗi đặc điểm ánh xạ sang vấn đề để bật ý tưởng.",
    ],
    steps: [
      "Lấy một đối tượng ngẫu nhiên.",
      "Mô tả cách nó hoạt động / các đặc tính của nó.",
      "Ánh xạ từng đặc tính sang vấn đề của bạn.",
    ],
    practice: { type: "analogy" },
  },
  {
    id: "synectics",
    no: 11,
    title: "Tư Duy Tổng Hợp (Synectics)",
    en: "Synectics",
    icon: "🌉",
    tagline: "Biến cái lạ thành quen, cái quen thành lạ.",
    intro:
      "William Gordon phát triển Synectics dựa trên phép <b>loại suy (analogy)</b>. Bốn kiểu loại suy: trực tiếp (so với vật khác), cá nhân (tưởng tượng mình LÀ vấn đề), tượng trưng (nén thành một cụm từ nghịch lý), và tưởng tượng (thế giới lý tưởng, viễn tưởng).",
    principles: [
      "Loại suy trực tiếp: tự nhiên/kỹ thuật giải bài toán tương tự thế nào?",
      "Loại suy cá nhân: nếu TÔI là vật thể/vấn đề, tôi sẽ cảm thấy và muốn gì?",
      "Loại suy tượng trưng: nén vấn đề thành một cụm từ nghịch lý súc tích.",
      "Loại suy tưởng tượng: trong thế giới không giới hạn, điều lý tưởng là gì?",
    ],
    steps: [
      "Chọn một kiểu loại suy.",
      "Khai triển loại suy đó thật sâu.",
      "Kéo các liên tưởng quay lại vấn đề gốc.",
    ],
    practice: {
      type: "stages",
      stages: [
        { key: "1", name: "Loại suy trực tiếp", desc: "Trong tự nhiên/ngành khác, có gì giải quyết vấn đề tương tự?" },
        { key: "2", name: "Loại suy cá nhân", desc: "Nếu TÔI chính là vấn đề đó, tôi cảm thấy gì, muốn gì?" },
        { key: "3", name: "Loại suy tượng trưng", desc: "Nén vấn đề thành một cụm từ nghịch lý (2–3 chữ)." },
        { key: "4", name: "Loại suy tưởng tượng", desc: "Trong thế giới lý tưởng không giới hạn, giải pháp là gì?" },
      ],
    },
  },
  {
    id: "reversal",
    no: 12,
    title: "Đảo Lộn Vấn Đề",
    en: "Reversal",
    icon: "🔃",
    tagline: "Hỏi ngược: làm sao để mọi thứ TỆ nhất có thể?",
    intro:
      "Thay vì hỏi 'làm sao để tốt hơn', hãy <b>đảo ngược</b>: 'làm sao để nó tệ hết mức?', 'làm sao để chắc chắn thất bại?'. Danh sách phá hoại đó, khi lật ngược lại, thường chỉ thẳng ra những việc cần làm mà ta hay bỏ sót.",
    principles: [
      "Đảo mục tiêu thành phản mục tiêu.",
      "Bung ý tưởng cho phản mục tiêu (dễ và vui hơn nhiều).",
      "Lật ngược từng ý phá hoại thành hành động tích cực.",
    ],
    steps: [
      "Viết mục tiêu gốc.",
      "Đảo thành: 'Làm sao để đạt điều ngược lại / tệ nhất?'",
      "Liệt kê cách gây ra kết quả tệ đó.",
      "Lật ngược mỗi ý thành giải pháp thực sự.",
    ],
    practice: { type: "reversal" },
  },
  {
    id: "concretize",
    no: 13,
    title: "Cụ Thể Hóa & Tổng Quát Hóa",
    en: "Concretization & Generalization",
    icon: "🔼",
    tagline: "Trượt lên–xuống thang trừu tượng để nhìn rõ hơn.",
    intro:
      "Hai thao tác bổ sung nhau: <b>tổng quát hóa</b> (lên mức trừu tượng để thấy bản chất, quy luật) và <b>cụ thể hóa</b> (xuống mức chi tiết, ví dụ, hành động khả thi). Nhiều bế tắc được gỡ chỉ bằng cách di chuyển đúng hướng trên 'thang trừu tượng'.",
    principles: [
      "Lên cao: hỏi 'vì sao / mục đích là gì?' để thấy bản chất.",
      "Xuống thấp: hỏi 'cụ thể là gì / ví dụ nào / bước nào?' để hành động được.",
      "Đi cả hai chiều để không mắc kẹt ở một tầng.",
    ],
    steps: [
      "Viết phát biểu vấn đề ở mức hiện tại.",
      "Tổng quát hóa lên 1–2 tầng (bản chất, mục đích).",
      "Cụ thể hóa xuống 1–2 tầng (ví dụ, hành động cụ thể).",
      "Chọn tầng nào cho bạn góc nhìn hữu ích nhất.",
    ],
    practice: {
      type: "stages",
      stages: [
        { key: "up2", name: "▲▲ Bản chất sâu nhất", desc: "Mục đích tối hậu / vì sao điều này quan trọng?" },
        { key: "up1", name: "▲ Tổng quát hơn", desc: "Phát biểu rộng hơn một chút." },
        { key: "mid", name: "● Vấn đề hiện tại", desc: "Phát biểu ban đầu của bạn." },
        { key: "down1", name: "▼ Cụ thể hơn", desc: "Một ví dụ / khía cạnh cụ thể." },
        { key: "down2", name: "▼▼ Hành động ngay", desc: "Việc cụ thể có thể làm hôm nay." },
      ],
    },
  },
];

// Ngân hàng từ khóa ngẫu nhiên (danh từ cụ thể, dễ liên tưởng)
window.RANDOM_WORDS = [
  "ngọn hải đăng","con ong","chiếc dù","cây cầu","đám mây","tổ kiến","kính lúp","dòng sông",
  "chiếc la bàn","hạt giống","ngọn núi","bong bóng xà phòng","đồng hồ cát","mạng nhện","chiếc chìa khóa",
  "ngọn nến","con tàu","tấm gương","chiếc lá","viên đá cuội","cái ô","đàn cá","chiếc thang",
  "hộp diêm","cánh diều","giọt nước","chiếc kim","con dốc","mặt trăng","ống nhòm","chiếc rễ cây",
  "cơn mưa","chiếc bánh răng","ngã tư","tổ chim","chiếc phao","đường ray","cái cân","ngọn lửa",
];
