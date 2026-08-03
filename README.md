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

## Chạy

Là website tĩnh, không cần build. Chỉ cần mở `index.html`, hoặc chạy máy chủ tĩnh:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

### Deploy lên GitHub Pages

Vào **Settings → Pages**, chọn nhánh và thư mục gốc (`/`). Website chạy được ngay
vì chỉ gồm HTML/CSS/JS thuần.

## Cấu trúc

```
index.html      # khung trang + modal đặt vấn đề
css/style.css   # giao diện
js/data.js      # nội dung 13 phương pháp + ngân hàng từ khóa ngẫu nhiên
js/app.js       # router, lưu trữ, và các bài tập tương tác
```

## Ghi công

Nội dung được biên soạn lại cho mục đích thực hành, dựa trên loạt bài của
Vietsciences (vietsciences.org / vietsciences.free.fr).
