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

## Game thực hành

Mỗi phương pháp sẽ có một game để biến lý thuyết thành phản xạ. **Bài 1 đã xong**,
12 bài còn lại đang làm dần. Game vẽ trên canvas 2D thuần, không thư viện ngoài.

### Bài 1 · “Nở Hoa Ý Tưởng”

Người ta hay bí khi tập kích não vì phải nghĩ từ con số không. Game này không bắt
nghĩ vu vơ — nó **đưa từng ống kính để soi vấn đề**, mỗi ống kính một góc nhìn.

**Chặng 1 · Khai mở.** Từ một hạt giống duy nhất (chính là vấn đề bạn đặt),
15 ống kính lần lượt xuất hiện — *tính chất, bộ phận, nguyên nhân, kết quả,
con người, thời gian, nơi chốn, công cụ, cảm xúc, màu sắc & hình ảnh, ngược lại,
phóng đại, thu nhỏ, thay thế, so sánh*. Mỗi ống kính có câu hỏi riêng và nút
gợi ý. Cứ 3 ý là tự đổi góc nhìn để không sa đà một hướng. Mục tiêu **20–50 ý**,
có thanh tiến độ với các mốc. Bấm vào một ý bất kỳ để **đào sâu** — ý mới sẽ mọc
ra từ đó thành tầng thứ hai.

**Chặng 2 · Nhóm ý.** Tạo nhóm, đặt tên, rồi kéo các ý vào. Chính việc đặt tên
nhóm là **khái quát hóa**: biến nhiều ý lẻ thành một khái niệm.

**Chặng 3 · Xâu chuỗi.** Nối các nhóm bằng quan hệ *dẫn tới / cần có / cản trở /
thuộc về / giải quyết*. Một đống ý rời rạc thành một **sơ đồ hệ thống**.

**Kết quả** chấm theo số ý, số góc nhìn đã dùng, số nhóm, số liên kết và độ sâu —
rồi **xuất thẳng sang các phương pháp liên quan**:

| Bạn vừa làm | Chính là phương pháp | Được lưu vào |
|---|---|---|
| Cây ý toả từ hạt giống | Giản đồ ý (Mind Map) | Bài 9 |
| Đặt tên cho các nhóm | Khái quát hóa | Bài 8 |
| Lùi lên hỏi mục đích chung | Nới rộng khái niệm | Bài 3 |
| Nối nhân quả giữa các nhóm | Hệ thống hóa | Bài 1 |

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
css/game.css          # giao diện lớp phủ game
js/data.js            # nội dung 13 phương pháp + ngân hàng từ khóa ngẫu nhiên
js/app.js             # router, lưu trữ, các bài tập tương tác, đăng ký game
js/games/canvas2d.js  # engine 2D dùng chung (mặt phẳng kéo/thu phóng, nút, âm thanh)
js/games/brainstorm.js# Bài 1 — game "Nở Hoa Ý Tưởng"
```

### Thêm game cho bài mới

1. Viết `js/games/<ten>.js` export hàm `launch({ problem, onFinish })`, dùng
   `createOverlay` + `createStage` từ `canvas2d.js`.
2. Đăng ký vào `GAMES` ở đầu `js/app.js` — nút “Chơi ngay” tự hiện ở trang đó.

## Ghi công

Nội dung được biên soạn lại cho mục đích thực hành, dựa trên loạt bài của
Vietsciences (vietsciences.org / vietsciences.free.fr).
