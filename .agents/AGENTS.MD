# Quy Tắc Agent

Repository này là backend Laravel cho `Hôm Nay Ăn Gì`.

## Bắt Buộc Cập Nhật Tài Liệu

Mỗi khi thay đổi code, migration, route, service, validation, response payload, auth behavior, database behavior, import, configuration hoặc test, phải kiểm tra xem các file sau có cần cập nhật không:

- `.agents/context.md`
- `.agents/api-doc.md`

Nếu thay đổi ảnh hưởng đến behavior sản phẩm, kiến trúc backend, schema database, runtime setup, endpoint behavior, request validation, response shape, error handling, auth/authorization hoặc tích hợp frontend, phải cập nhật file liên quan trong cùng task.

Không kết thúc task có thay đổi code nếu chưa:

- cập nhật `.agents/context.md` và/hoặc `.agents/api-doc.md`, hoặc
- xác nhận rõ thay đổi không ảnh hưởng đến hai file tài liệu đó.

## Quy Tắc Ngôn Ngữ

- `.agents/context.md` phải viết bằng tiếng Việt.
- `.agents/api-doc.md` phải viết bằng tiếng Việt để FE dev đọc trực tiếp.
- Khi xây dựng hoặc chỉnh sửa giao diện web/app, mặc định dùng tiếng Việt cho copy, label, empty state, validation text và nội dung hiển thị cho người dùng.
- Chỉ giữ tiếng Anh cho tên class, function, route, field API, enum, command, code snippet hoặc thuật ngữ kỹ thuật cần giữ nguyên.

## Ràng Buộc Riêng Của Project

- Domain model là `Place`, không phải `Meal`.
- Category đã được mapping trước khi import; backend không được remap Google types sang `primary_category`.
- Dùng `App\Constants\PlaceCategory::PRIMARY_CATEGORIES` để validate category.
- API public của place chỉ trả địa điểm active.
- API admin được bảo vệ bằng middleware `auth.jwt` và `admin`.
- API response phải dùng `App\Http\Resources\ApiResponse`.
- Không đưa secret vào file commit. `.env` chỉ dùng local.

## Kiểm Tra

Với thay đổi backend, chạy kiểm tra hẹp trước, sau đó chạy full suite khi khả thi:

```bash
php artisan test
php artisan route:list --path=api
```
