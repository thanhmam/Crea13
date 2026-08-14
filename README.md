# Rèn Luyện Tư Duy Sáng Tạo — 13 Phương Pháp

Website thực hành **13 phương pháp suy nghĩ sáng tạo**, tham khảo loạt bài
*“Các Phương Pháp Suy Luận và Sáng Tạo”* trên [Vietsciences](http://vietsciences.free.fr/thuctap_khoahoc/renluyen_sangtao/).

> Trong thời đại AI, con người dễ trở nên lười suy nghĩ. Đây là một sân tập để
> rèn tư duy — biến kiến thức thành trải nghiệm.

## Ý tưởng

Bạn **đặt một vấn đề thật** của mình (một câu hỏi mở), rồi lần lượt soi nó qua
13 phương pháp. Mỗi phương pháp là một bài tập tương tác có hướng dẫn, đồng hồ,
từ khóa ngẫu nhiên và ô ghi ý. Toàn bộ ghi chú được **lưu ngay trong trình duyệt**
(localStorage) — không gửi đi đâu.

## 13 phương pháp

1. Tập Kích Não (Brainstorming)
2. Thâu Thập Ngẫu Nhiên (Random Input)
3. Nới Rộng Khái Niệm (Concept Fan)
4. Kích Hoạt – PO (Provocation)
5. Sáu Chiếc Mũ Tư Duy (Six Thinking Hats)
6. DOIT
7. Simplex
8. Khái Quát Hóa & Khái Niệm Hóa
9. Giản Đồ Ý (Mind Map)
10. Tương Tự & Cưỡng Bức Tương Tự (Forced Analogy)
11. Tư Duy Tổng Hợp (Synectics)
12. Đảo Lộn Vấn Đề (Reversal)
13. Cụ Thể Hóa & Tổng Quát Hóa

## Game 3D (Three.js)

Mỗi phương pháp sẽ có một game 3D để biến lý thuyết thành phản xạ. **Bài 1 đã xong**,
12 bài còn lại đang làm dần.

### Bài 1 · “Vụ Nổ Ý Tưởng”

Vấn đề của bạn là cái lõi phát sáng giữa vũ trụ. Mỗi ý gõ ra nổ tung khỏi lõi và
bay vào quỹ đạo. Bốn nguyên tắc của Osborn được cài thẳng vào luật chơi:

| Nguyên tắc | Cơ chế game |
|---|---|
| Không phê phán | Ngừng gõ quá lâu → vòng **Kiểm Duyệt** đỏ siết vào, cắt combo |
| Hoan nghênh ý điên rồ | `Ctrl`+`Enter` → sao vàng, điểm ×2 |
| Chạy theo số lượng | Bung ý liên tiếp dưới 8 giây → combo nhân điểm |
| Kết hợp & cải tiến | Bấm 2 quả cầu để ghép thành siêu tân tinh, +60 điểm |

Kết thúc, game chấm điểm theo 4 chiều của tư duy sáng tạo — **lưu loát, độc đáo,
cải tiến, dòng chảy** — kèm nhận xét, và mọi ý tưởng được đổ thẳng vào phần
Thực hành của Bài 1 để bạn sàng lọc tiếp.

Three.js được **vendor sẵn** trong `vendor/` nên site chạy được offline, không
phụ thuộc CDN.

## Chạy

Là website tĩnh, không cần build. Vì game dùng ES module, **phải chạy qua máy chủ
web** (mở thẳng `file://` sẽ bị trình duyệt chặn module):

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

### Deploy lên GitHub Pages

Vào **Settings → Pages**, chọn nhánh và thư mục gốc (`/`). Website chạy được ngay
vì chỉ gồm HTML/CSS/JS thuần.

## Cấu trúc

```
index.html            # khung trang + modal đặt vấn đề
css/style.css         # giao diện trang
css/game.css          # giao diện lớp phủ game 3D
js/data.js            # nội dung 13 phương pháp + ngân hàng từ khóa ngẫu nhiên
js/app.js             # router, lưu trữ, các bài tập tương tác, đăng ký game
js/games/engine.js    # engine 3D dùng chung (sân khấu, nhãn, hạt, âm thanh)
js/games/brainstorm.js# Bài 1 — game "Vụ Nổ Ý Tưởng"
vendor/               # Three.js (bản vendor, giấy phép MIT kèm theo)
```

### Thêm game cho bài mới

1. Viết `js/games/<ten>.js` export hàm `launch({ problem, onFinish })`, dùng
   `createOverlay` + `createStage` từ `engine.js`.
2. Đăng ký vào `GAMES` ở đầu `js/app.js` — nút “Chơi ngay” tự hiện ở trang đó.

## Ghi công

Nội dung được biên soạn lại cho mục đích thực hành, dựa trên loạt bài của
Vietsciences (vietsciences.org / vietsciences.free.fr).
