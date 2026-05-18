# React FE Agent Guide

**Version 2.0.0**  
Project: Hom Nay An Gi FE  
Last updated: 2026-05-18

## Mục tiêu

Tài liệu này định nghĩa cách một bot FE ReactJS nên làm việc khi xây dựng và bảo trì giao diện cho cùng chủ đề `Hom nay an gi`.

Ưu tiên:
1. Đúng nghiệp vụ và API contract.
2. Trải nghiệm người dùng mượt trên mobile trước.
3. Hiệu năng thực tế (TTI, re-render, bundle, network).
4. Code dễ bảo trì, dễ review.

## Phạm vi áp dụng

Áp dụng cho:
- React components, hooks, state management.
- Màn hình tìm quán, lọc, random gợi ý, yêu thích, đánh giá.
- Tích hợp API backend và xử lý trạng thái loading/error/empty.
- Refactor để giảm waterfall, giảm bundle, giảm re-render.

Không áp dụng cho:
- Thay đổi logic nghiệp vụ backend.
- Tự ý đổi API contract khi chưa có thống nhất.

## Nguyên tắc cốt lõi cho bot

1. API-first UI
- Dựa trên response thực tế, không đoán field.
- Tạo layer `services` hoặc `api client` tập trung, không fetch rải rác.
- Chuẩn hóa xử lý lỗi theo mã lỗi backend (`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, ...).

2. Mobile-first
- Thiết kế và kiểm tra từ viewport nhỏ trước.
- Tránh layout shift, giữ skeleton/loading ổn định.
- Nút bấm đủ lớn, trạng thái tương tác rõ ràng.

3. Không waterfall không cần thiết
- Song song hóa request độc lập bằng `Promise.all` hoặc thư viện fetch cache.
- Chỉ `await` khi thật sự cần dữ liệu cho nhánh hiện tại.
- Tách dữ liệu critical và non-critical.

4. Render tối ưu
- Tránh lưu derived state dư thừa.
- Tách component nặng, memo hóa đúng chỗ.
- Không tạo object/function mới trong props nếu không cần.

5. Bundle gọn
- Ưu tiên import trực tiếp, tránh barrel file lớn.
- Dynamic import cho modal/feature nặng.
- Trì hoãn thư viện không critical (analytics, maps nâng cao).

6. UX nhất quán
- Luôn có đủ 4 trạng thái: `loading`, `success`, `empty`, `error`.
- Error message rõ, có hướng hành động (`thử lại`, `đăng nhập lại`).
- Không block toàn trang nếu chỉ lỗi một widget.

7. Accessibility cơ bản bắt buộc
- Input có label.
- Ảnh có alt phù hợp.
- Có focus-visible và tương phản đủ đọc.

## Cấu trúc đề xuất

- `src/features/*`: theo domain (`places`, `favorites`, `reviews`, `auth`).
- `src/components/*`: UI tái sử dụng.
- `src/services/*` hoặc `src/lib/api/*`: gọi API + mapping dữ liệu.
- `src/hooks/*`: custom hooks cho logic chia sẻ.
- `src/types/*`: định nghĩa type cho API payload/DTO.

## Checklist trước khi bot kết thúc task

1. Đúng yêu cầu UI/flow nghiệp vụ.
2. Không phá API contract hiện có.
3. Có xử lý loading/error/empty rõ ràng.
4. Không tạo fetch waterfall mới.
5. Không thêm re-render thừa (kiểm tra deps hooks).
6. Responsive tốt trên mobile và desktop.
7. Không có warning console nghiêm trọng.
8. Nếu đổi hành vi người dùng thấy được, cập nhật tài liệu liên quan trong `.agents/`.

## Quy tắc review nhanh

Ưu tiên phát hiện theo mức độ:
1. Sai nghiệp vụ hoặc sai contract API.
2. Lỗi UX gây kẹt tác vụ người dùng.
3. Regression hiệu năng lớn (waterfall, bundle phình, giật render).
4. Vấn đề maintainability (logic trùng, coupling cao, type yếu).

## Chính sách thay đổi

- Bot chỉ sửa phần cần thiết cho task.
- Không tự ý refactor lớn ngoài phạm vi.
- Với thay đổi rộng, tách thành các commit logic nhỏ và dễ rollback.

## Tham chiếu performance

Khi cần tối ưu sâu, bot có thể tham chiếu rule chi tiết trong `rules/` của skill này (waterfall, bundle, rerender, rendering), nhưng phải ưu tiên bối cảnh sản phẩm `Hom nay an gi` thay vì áp dụng máy móc.
