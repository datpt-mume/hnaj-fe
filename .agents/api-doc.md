# Tài Liệu API: Backend Hôm Nay Ăn Gì

Cập nhật lần cuối: 2026-05-18

Base URL khi chạy local:

```text
http://127.0.0.1:8000/api
```

Tất cả response đều là JSON.

## Chuẩn Response

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
    "message": "The given data was invalid."
  }
}
```

Các mã lỗi:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `INTERNAL_ERROR`

## Xác Thực

Các endpoint cần đăng nhập dùng header:

```http
Authorization: Bearer <jwt_token>
```

Token được trả về khi đăng ký hoặc đăng nhập. Thời gian hết hạn token được cấu hình bằng `JWT_TTL_MINUTES`.

### POST `/auth/register`

Public. Tạo user thường.

Body:

```json
{
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "password": "password123"
}
```

Validation:

- `name`: không bắt buộc, string, tối đa 255 ký tự
- `email`: bắt buộc, email, unique, tối đa 255 ký tự
- `password`: bắt buộc, string, tối thiểu 8 ký tự, tối đa 255 ký tự

Response `201`:

```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "expires_at": "2026-06-17T10:00:00+00:00",
    "user": {
      "id": 1,
      "name": "Nguyen Van A",
      "email": "a@example.com",
      "role": "user"
    }
  },
  "message": "OK"
}
```

### POST `/auth/login`

Public.

Body:

```json
{
  "email": "a@example.com",
  "password": "password123"
}
```

Response `200`: cùng format với đăng ký.

Sai email hoặc password trả `401 UNAUTHORIZED`.

### GET `/auth/me`

User đã đăng nhập.

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Nguyen Van A",
      "email": "a@example.com",
      "role": "user"
    }
  },
  "message": "OK"
}
```

## Danh Mục Địa Điểm

Các giá trị `primary_category` hợp lệ:

- `food`
- `coffee_tea`
- `bar_pub`
- `gaming`
- `culture_art`
- `shopping`
- `entertainment`

## Object Địa Điểm

Object địa điểm public thường có dạng:

```json
{
  "id": "ChIJ...",
  "displayName": "Ten quan",
  "formattedAddress": "Dia chi",
  "types": ["restaurant", "food"],
  "primary_category": "food",
  "rating": 4.5,
  "googleMapsUri": "https://maps.google.com/...",
  "nationalPhoneNumber": "0123456789",
  "regularOpeningHours": {},
  "is_open_now": true
}
```

`is_open_now` có thể là `true`, `false`, hoặc `null`.

## API Địa Điểm Public

### GET `/places/random`

Public, trừ trường hợp `favorite_only=true` thì cần đăng nhập.

Query params:

- `primary_category`: không bắt buộc, enum
- `district`: không bắt buộc, string, lọc theo cột `district` hoặc fallback qua địa chỉ
- `area`: không bắt buộc, string, tìm trong `formattedAddress`, `district`, `ward`
- `open_now`: không bắt buộc, boolean
- `favorite_only`: không bắt buộc, boolean, chỉ dùng khi đã đăng nhập
- `limit`: không bắt buộc, integer, mặc định `1`, tối đa `20`

Ví dụ:

```http
GET /api/places/random?primary_category=food&area=Cau%20Giay&open_now=1&limit=3
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ChIJ...",
        "displayName": "Ten quan",
        "formattedAddress": "Dia chi",
        "types": ["restaurant"],
        "primary_category": "food",
        "rating": 4.5,
        "googleMapsUri": "https://maps.google.com/...",
        "nationalPhoneNumber": "0123456789",
        "regularOpeningHours": {},
        "is_open_now": true
      }
    ],
    "filters": {
      "primary_category": "food",
      "district": null,
      "area": "Cau Giay",
      "open_now": true,
      "favorite_only": false,
      "limit": 3
    }
  },
  "message": "OK"
}
```

Không có kết quả thì trả `items: []`, không throw lỗi 500.

Nếu request có bearer token hợp lệ, mọi địa điểm được trả về sẽ được lưu vào lịch sử đề xuất của user. Request public không có token sẽ không được lưu history.

### GET `/places`

Public. Chỉ trả địa điểm active.

Query params:

- `q`: không bắt buộc, string, tìm trong `displayName`, `formattedAddress`, `nationalPhoneNumber`
- `primary_category`: không bắt buộc, enum
- `district`: không bắt buộc, string
- `area`: không bắt buộc, string
- `open_now`: không bắt buộc, boolean
- `page`: không bắt buộc, integer
- `limit`: không bắt buộc, integer, mặc định `20`, tối đa `50`

Response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 6028,
      "total_pages": 302
    }
  },
  "message": "OK"
}
```

Lưu ý: với `open_now=true`, hiện tại backend lọc sau khi query theo page, nên số item trả về trong một page có thể nhỏ hơn `limit`.

### GET `/places/{id}`

Public. Trả chi tiết địa điểm active.

Nếu request có bearer token hợp lệ, `is_favorited` phản ánh trạng thái yêu thích của user hiện tại. Nếu không đăng nhập, `is_favorited=false`.

Response:

```json
{
  "success": true,
  "data": {
    "id": "ChIJ...",
    "displayName": "Ten quan",
    "formattedAddress": "Dia chi",
    "types": ["restaurant"],
    "primary_category": "food",
    "rating": 4.5,
    "googleMapsUri": "https://maps.google.com/...",
    "nationalPhoneNumber": "0123456789",
    "regularOpeningHours": {},
    "is_open_now": true,
    "internal_rating_avg": 4.8,
    "internal_review_count": 12,
    "is_favorited": true
  },
  "message": "OK"
}
```

Không tìm thấy trả `404 NOT_FOUND`.

## Yêu Thích

### POST `/places/{id}/favorite`

User đã đăng nhập.

Thêm địa điểm vào danh sách yêu thích của user hiện tại. Nếu đã yêu thích trước đó, endpoint vẫn trả thành công và không tạo duplicate.

Response `201`:

```json
{
  "success": true,
  "data": {
    "place": {}
  },
  "message": "OK"
}
```

### DELETE `/places/{id}/favorite`

User đã đăng nhập.

Xóa địa điểm khỏi danh sách yêu thích. Nếu địa điểm tồn tại nhưng user chưa yêu thích, vẫn trả thành công.

Response:

```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```

### GET `/users/me/favorites`

User đã đăng nhập.

Response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "total_pages": 1
    }
  },
  "message": "OK"
}
```

## Lịch Sử Đề Xuất

### GET `/users/me/recommendations`

User đã đăng nhập.

Trả danh sách địa điểm từng được trả về cho user hiện tại từ endpoint `GET /places/random`.

Query params:

- `page`: không bắt buộc, integer
- `limit`: không bắt buộc, integer, mặc định `20`, tối đa `100`

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "place": {
          "id": "ChIJ...",
          "displayName": "Ten quan",
          "formattedAddress": "Dia chi",
          "types": ["restaurant"],
          "primary_category": "food",
          "rating": 4.5,
          "googleMapsUri": "https://maps.google.com/...",
          "nationalPhoneNumber": "0123456789",
          "regularOpeningHours": {},
          "is_open_now": true
        },
        "recommended_count": 2,
        "last_filters": {
          "primary_category": "food",
          "district": null,
          "area": "Cau Giay",
          "open_now": true,
          "favorite_only": false,
          "limit": 1
        },
        "last_is_open_now": true,
        "first_recommended_at": "2026-05-18T10:00:00+00:00",
        "last_recommended_at": "2026-05-18T11:00:00+00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "total_pages": 1
    }
  },
  "message": "OK"
}
```

## Đánh Giá

### GET `/places/{id}/reviews`

Public. Trả review của một địa điểm active.

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Quan on, do an ngon",
        "user": {
          "id": 1,
          "name": "Nguyen Van A"
        },
        "created_at": "2026-05-18T10:00:00+00:00",
        "updated_at": "2026-05-18T10:00:00+00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "total_pages": 1
    }
  },
  "message": "OK"
}
```

### POST `/places/{id}/reviews`

User đã đăng nhập.

Body:

```json
{
  "rating": 5,
  "comment": "Quan on, do an ngon"
}
```

Validation:

- `rating`: bắt buộc, integer, từ 1 đến 5
- `comment`: không bắt buộc, string, tối đa 2000 ký tự

Mỗi user chỉ có một review active cho một địa điểm. Nếu review đã bị xóa mềm tồn tại, backend sẽ restore và cập nhật review đó.

Response `201`:

```json
{
  "success": true,
  "data": {
    "review": {}
  },
  "message": "OK"
}
```

Nếu đã có review active, trả `409 CONFLICT`.

### PUT `/places/{id}/reviews/me`

User đã đăng nhập. Cập nhật review của chính user hiện tại cho địa điểm.

Body giống tạo review.

### DELETE `/places/{id}/reviews/me`

User đã đăng nhập. Xóa mềm review của chính user hiện tại.

## Đề Xuất Địa Điểm Từ User

### POST `/place-submissions`

User đã đăng nhập.

Tạo một submission ở trạng thái pending. Không ghi trực tiếp vào bảng `places`.

Body:

```json
{
  "displayName": "Ten quan",
  "formattedAddress": "Dia chi",
  "primary_category": "food",
  "types": ["restaurant"],
  "rating": 4.5,
  "googleMapsUri": "https://maps.google.com/...",
  "nationalPhoneNumber": "0123456789",
  "regularOpeningHours": {},
  "note": "Nen them quan nay"
}
```

Validation:

- `displayName`: bắt buộc, string, tối đa 255 ký tự
- `formattedAddress`: bắt buộc, string
- `primary_category`: bắt buộc, enum
- `types`: không bắt buộc, array
- `rating`: không bắt buộc, numeric, từ 0 đến 5
- `googleMapsUri`: không bắt buộc, URL, tối đa 2048 ký tự
- `nationalPhoneNumber`: không bắt buộc, string, tối đa 255 ký tự
- `regularOpeningHours`: không bắt buộc, array
- `note`: không bắt buộc, string, tối đa 2000 ký tự

Response `201`:

```json
{
  "success": true,
  "data": {
    "submission": {
      "id": 1,
      "status": "pending"
    }
  },
  "message": "OK"
}
```

### GET `/users/me/place-submissions`

User đã đăng nhập. Trả danh sách submission của chính user.

### GET `/users/me/place-submissions/{id}`

User đã đăng nhập. Chỉ trả submission thuộc về user hiện tại.

## Admin Quản Lý Địa Điểm

Tất cả endpoint admin cần `Authorization: Bearer <admin_jwt>` và user có `role=admin`.

### GET `/admin/places`

Admin.

Query params:

- `q`: không bắt buộc, string, tìm trong `displayName`, `formattedAddress`, `nationalPhoneNumber`
- `primary_category`: không bắt buộc, enum
- `is_active`: không bắt buộc, boolean
- `is_verified`: không bắt buộc, boolean
- `source`: không bắt buộc, string
- `page`: không bắt buộc, integer
- `limit`: không bắt buộc, integer, mặc định `20`, tối đa `100`

Response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 6028,
      "total_pages": 302
    }
  },
  "message": "OK"
}
```

### GET `/admin/places/{id}`

Admin. Trả địa điểm kèm các field dành cho admin.

### POST `/admin/places`

Admin. Tạo địa điểm.

Body:

```json
{
  "id": "manual_xxx_or_google_place_id",
  "displayName": "Ten quan",
  "formattedAddress": "Dia chi",
  "primary_category": "food",
  "types": ["restaurant"],
  "rating": 4.5,
  "googleMapsUri": "https://maps.google.com/...",
  "nationalPhoneNumber": "0123456789",
  "regularOpeningHours": {},
  "district": "Cau Giay",
  "ward": "Dich Vong",
  "city": "Ha Noi",
  "is_active": true,
  "is_verified": true,
  "source": "admin"
}
```

Bắt buộc:

- `displayName`
- `formattedAddress`
- `primary_category`

Nếu không truyền `id`, backend tự tạo `manual_<uuid>`.

Trùng id trả `409 CONFLICT`.

### PUT `/admin/places/{id}`

Admin. Cập nhật các field được phép của địa điểm, không cho đổi `id`.

### DELETE `/admin/places/{id}`

Admin. Xóa mềm địa điểm.

### PATCH `/admin/places/{id}/active`

Admin.

Body:

```json
{
  "is_active": false
}
```

## Admin Duyệt Đề Xuất Địa Điểm

### GET `/admin/place-submissions`

Admin.

Query params:

- `status`: không bắt buộc, một trong `pending`, `approved`, `rejected`
- `limit`: không bắt buộc, integer, mặc định `20`, tối đa `100`

### GET `/admin/place-submissions/{id}`

Admin. Trả submission kèm thông tin người gửi và người duyệt.

### POST `/admin/place-submissions/{id}/approve`

Admin. Duyệt submission pending và tạo record mới trong `places`.

Body:

```json
{
  "admin_note": "OK",
  "override": {
    "id": "ChIJ_or_manual_id",
    "displayName": "Ten chuan hoa",
    "formattedAddress": "Dia chi chuan hoa",
    "primary_category": "food",
    "googleMapsUri": "https://maps.google.com/..."
  }
}
```

Behavior:

- Chỉ submission `pending` mới được duyệt.
- Tạo place với `source=user_submission`, `is_verified=true`, `is_active=true`.
- Nếu không truyền `override.id`, backend tự tạo `manual_<uuid>`.
- Trùng id, trùng Google Maps URL hoặc trùng tên + địa chỉ trả `409 CONFLICT`.
- Cập nhật submission sang `approved`, lưu admin duyệt, ghi chú admin và thời gian duyệt.

### POST `/admin/place-submissions/{id}/reject`

Admin.

Body:

```json
{
  "admin_note": "Thieu thong tin / trung dia diem"
}
```

Behavior:

- Chỉ submission `pending` mới được từ chối.
- Không tạo place.
- Cập nhật trạng thái sang `rejected`.

## Ví Dụ Curl

Đăng nhập:

```bash
curl -X POST "http://127.0.0.1:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"a@example.com","password":"password123"}'
```

Random quán ăn theo khu vực:

```bash
curl "http://127.0.0.1:8000/api/places/random?primary_category=food&area=Cau%20Giay&limit=1"
```

Yêu thích địa điểm:

```bash
curl -X POST "http://127.0.0.1:8000/api/places/ChIJxxx/favorite" \
  -H "Authorization: Bearer $TOKEN"
```

Tạo review:

```bash
curl -X POST "http://127.0.0.1:8000/api/places/ChIJxxx/reviews" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Quan on"}'
```

Tạo đề xuất địa điểm:

```bash
curl -X POST "http://127.0.0.1:8000/api/place-submissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Quan moi","formattedAddress":"Cau Giay, Ha Noi","primary_category":"food","types":["restaurant"]}'
```

## Ghi Chú Cho Frontend

- `id` của place là string, không phải number.
- Các field từ Google Places vẫn giữ camelCase gốc (`displayName`, `formattedAddress`, `googleMapsUri`, v.v.).
- `types` và `regularOpeningHours` là JSON object/array.
- `is_open_now` có thể là `null`; frontend nên hiển thị trạng thái không xác định thay vì mặc định là đang đóng.
- API public list/detail chỉ trả địa điểm active.
- API admin có thể thấy địa điểm inactive.
- Tất cả pagination dùng `{page, limit, total, total_pages}`.
- Giao diện web/app nên dùng tiếng Việt làm ngôn ngữ mặc định.
