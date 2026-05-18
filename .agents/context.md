# Bối Cảnh Backend: Hôm Nay Ăn Gì

Cập nhật lần cuối: 2026-05-18

## Sản Phẩm

`Hôm Nay Ăn Gì` là backend cho web/app giúp người dùng ở Hà Nội khám phá địa điểm ăn uống, cà phê, vui chơi và giải trí. Trải nghiệm lõi hiện tại là random đề xuất địa điểm dựa trên bộ lọc như danh mục, khu vực, quận, trạng thái đang mở cửa và danh sách yêu thích của người dùng.

Dữ liệu địa điểm ban đầu được crawl từ Google Places API, đã được mapping `primary_category` trước khi import, sau đó import vào MySQL bảng `places`. Backend không tự mapping lại category; backend chỉ tin tưởng và validate trường `primary_category`.

## Công Nghệ

- Framework: Laravel 13
- Ngôn ngữ/runtime: PHP 8.3
- Database: MySQL 8
- ORM: Eloquent
- API routes: `routes/api.php`
- Auth: JWT tự triển khai bằng HS256 HMAC (`App\Services\Auth\JwtService`)
- Test: PHPUnit qua `php artisan test`

## Môi Trường Local

Project hiện đang chạy trong WSL. MySQL được cài bên trong WSL và đang chứa dữ liệu đã import.

Trạng thái DB hiện tại:

- Database: `hnaj`
- Số địa điểm đã import: `6028`
- MySQL đang chạy trong WSL. Nếu kết nối từ công cụ Windows như Navicat, cần dùng IP của WSL hoặc cấu hình bind/port forwarding.
- Cấu hình DB của app nằm trong `.env`; không commit secret.

Lệnh thường dùng:

```bash
php artisan migrate
php artisan test
php artisan route:list --path=api
php artisan serve
```

## Mô Hình Dữ Liệu

### `places`

Bảng địa điểm chính. `id` là chuỗi Google Place ID hoặc ID nội bộ dạng manual.

Các field quan trọng:

- `id`
- `displayName`
- `formattedAddress`
- `types` JSON
- `rating`
- `googleMapsUri`
- `nationalPhoneNumber`
- `regularOpeningHours` JSON
- `primary_category`
- `is_active`
- `is_verified`
- `source`
- `district`
- `ward`
- `city`
- timestamps
- soft deletes

Các giá trị `primary_category` hợp lệ được định nghĩa tập trung ở `App\Constants\PlaceCategory::PRIMARY_CATEGORIES`:

- `food`
- `coffee_tea`
- `bar_pub`
- `gaming`
- `culture_art`
- `shopping`
- `entertainment`

Dữ liệu đã import hiện có:

- `food`: 3337
- `coffee_tea`: 2082
- `bar_pub`: 602
- `culture_art`: 3
- `entertainment`: 4
- `gaming`: 0
- `shopping`: 0

### `users`

Bảng user của Laravel, có bổ sung:

- `role`: `user` hoặc `admin`
- soft deletes

Mật khẩu được lưu trong cột `password` của Laravel và được hash bằng Eloquent cast / `Hash::make`. API không bao giờ trả password.

### `place_favorites`

Lưu địa điểm yêu thích của người dùng.

- `user_id`
- `place_id`
- unique `(user_id, place_id)`

### `place_reviews`

Lưu đánh giá nội bộ của người dùng.

- `user_id`
- `place_id`
- `rating` từ 1 đến 5
- `comment`
- unique `(user_id, place_id)`
- soft deletes

Nếu người dùng xóa review rồi tạo lại, backend restore review đã soft-delete và cập nhật nội dung để tránh lỗi unique constraint.

### `place_recommendation_histories`

Lưu các địa điểm đã được trả về cho người dùng đã đăng nhập từ endpoint `GET /api/places/random`.

- `user_id`
- `place_id`
- `recommended_count`
- `last_filters` JSON
- `last_is_open_now`
- `first_recommended_at`
- `last_recommended_at`
- unique `(user_id, place_id)`

Request random public không tạo lịch sử. Request random có JWT hợp lệ sẽ lưu từng địa điểm được trả về, giúp người dùng xem lại các địa điểm đã từng được đề xuất và tiện đánh giá sau này.

### `place_submissions`

Lưu đề xuất thêm địa điểm từ người dùng để admin duyệt. Bảng này không ghi thẳng vào `places`; chỉ khi admin approve mới tạo record trong `places`.

Các trạng thái:

- `pending`
- `approved`
- `rejected`

## Service Chính

### `PlaceRandomService`

Vị trí: `app/Services/Places/PlaceRandomService.php`

Trách nhiệm:

- Xây query random địa điểm.
- Filter theo `is_active`, `primary_category`, `district`, `area`, và `favorite_only`.
- Hiện dùng `inRandomOrder()`.
- Có TODO để thay `ORDER BY RAND()` khi dữ liệu lớn hơn.

### `PlaceRecommendationHistoryService`

Vị trí: `app/Services/Places/PlaceRecommendationHistoryService.php`

Trách nhiệm:

- Ghi lại các địa điểm được random trả về cho user đã đăng nhập.
- Duy trì một dòng cho mỗi cặp `(user_id, place_id)`.
- Tăng `recommended_count`.
- Lưu filter lần gần nhất và trạng thái `is_open_now` gần nhất.

### `PlaceOpenHoursService`

Vị trí: `app/Services/Places/PlaceOpenHoursService.php`

Trách nhiệm:

- Tính `is_open_now`.
- Dùng timezone `Asia/Bangkok`.
- Hỗ trợ `regularOpeningHours.openNow` của Google Places.
- Hỗ trợ `periods.open/close` với cả format `time: "HHMM"` và `hour` / `minute`.
- Trả về:
  - `true`: đang mở
  - `false`: đang đóng
  - `null`: không xác định hoặc không parse được

Khi request có `open_now=true`, địa điểm không xác định giờ mở cửa sẽ bị loại.

### `JwtService`

Vị trí: `app/Services/Auth/JwtService.php`

Trách nhiệm:

- Tạo JWT HS256.
- Đọc secret từ `JWT_SECRET`, fallback sang `APP_KEY`.
- Resolve user hiện tại từ header `Authorization: Bearer <token>`.

## Chuẩn Response API

Thành công:

```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```

Lỗi:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "..."
  }
}
```

Các mã lỗi chuẩn:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `INTERNAL_ERROR`

## Phân Quyền

Public:

- Danh sách địa điểm
- Chi tiết địa điểm
- Random địa điểm
- Danh sách review của địa điểm
- Đăng ký / đăng nhập

User đã đăng nhập:

- Thông tin user hiện tại
- Thêm / xóa yêu thích
- Danh sách yêu thích
- Lịch sử địa điểm đã được đề xuất
- Random trong danh sách yêu thích
- Tạo / sửa / xóa review của chính mình
- Tạo và xem đề xuất địa điểm của chính mình

Admin:

- CRUD địa điểm
- Bật / tắt active địa điểm
- Danh sách / chi tiết đề xuất địa điểm
- Duyệt / từ chối đề xuất địa điểm

## Lịch Sử Import

File CSV:

- `data_to_import_places_table.csv`

Import một lần đã chạy thành công vào MySQL `hnaj.places`.

Kết quả:

- Import `6028` dòng.
- Script tạm `scripts/import_places_once.php` đã tự xóa sau khi import thành công.

Nếu cần import lại, phải tạo script one-time mới với tên rõ ràng và đảm bảo bảng `places` đang trống trước khi import.

## Ghi Chú Kỹ Thuật Hiện Tại

- Không dùng lại `Meal`; domain của sản phẩm là `Place`.
- Không mapping category trong backend. Mapping đã được thực hiện trước khi import CSV.
- Validate category bằng `PlaceCategory`.
- Không hard-code secret. Dùng `.env`.
- API public của place chỉ trả địa điểm active.
- API admin có thể truy cập địa điểm inactive.
- Khi thay đổi API behavior, schema, auth, validation, response field hoặc workflow, phải cập nhật `.agents/context.md` và `.agents/api-doc.md`.
- Hai file `.agents/context.md` và `.agents/api-doc.md` phải được viết bằng tiếng Việt.
