HÀNH TRÌNH CHỨNG NHÂN
MỘT WEB GAME GIẢI MẬT THƯ HTML/CSS/JAVASCRIPT VỀ CHỦ ĐỀ GIÁO LÝ CỦA HỘI THÁNH CÔNG GIÁO VIỆT NAM \
VỚI CHỦ ĐỀ:
**Em là CHỨNG NHÂN cho bạn Giêsu**  
**Chủ đề năm học giáo lý | 2025 - 2026**
## Cách chạy

Mở trực tiếp file `index.html` bằng trình duyệt.

## Cấu trúc file

- `index.html`: khung HTML và nội dung giao diện.
- `styles.css`: toàn bộ giao diện, responsive layout và hiệu ứng nền.
- `script.js`: dữ liệu 20 màn chơi và toàn bộ logic game.

## Nội dung chính

- 20 màn chơi lấy ngẫu nhiên từ pool 50 mật thư tọa độ Kinh Thánh.
- Timer giảm dần từ 30 phút ở màn 1 xuống 5 phút ở màn 20.
- Sai đáp án thường reset về màn 1 và mất toàn bộ điểm.
- Cửa hàng vật phẩm mở khóa sau màn 3, có thêm Hộp Quà May Mắn và Anh Huy - Chuyên Gia Mật Thư.
- Từ màn 10 có cạm bẫy ngẫu nhiên: khóa cửa hàng, giảm nửa thời gian, Mất Lòng Tin hoặc Lu Mờ.
- Màn kết thúc có thống kê thành tích và hiệu ứng pháo hoa.

## Tùy chỉnh màn chơi

Mở `script.js`, tìm mảng:

```js
const BASE_ANSWERS = [
  // ...
]
```

Mỗi mật thư gồm:

- `answer`: đáp án chuẩn.
- `difficulty`: nhóm độ khó (`easy`, `medium`, `hard`, `extreme`).
- `hint`: gợi ý chính.

Hệ thống tự sinh `keyCoords` và `cipherCoords` theo mẫu tọa độ Kinh Thánh để bạn dễ thay nội dung sau này.
