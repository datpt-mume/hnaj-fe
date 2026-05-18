# HNAJ FE (React + Vite)

Frontend cho dự án **Hôm nay ăn gì**: random recommend quán ăn/đi chơi ở Hà Nội.

## Stack

- Vite + React + TypeScript
- React Router
- TanStack Query
- Tailwind CSS

## Chạy local

```bash
cp .env.example .env
npm install
npm run dev
```

Mặc định API backend:

```text
http://127.0.0.1:8000/api
```

Có thể đổi bằng biến môi trường:

```text
VITE_API_BASE_URL=...
```

## Scope v1

- Public: random/list/detail places
- Auth user: register/login/me
- Favorites: add/remove/list
- Reviews: list/create/update/delete
