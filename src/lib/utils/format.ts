import type { PlaceCategory } from '../../types/domain'

export const categoryLabelMap: Record<PlaceCategory, string> = {
  food: 'Ăn no',
  coffee_tea: 'Cafe/Trà',
  bar_pub: 'Bar/Pub',
  gaming: 'Gaming',
  culture_art: 'Văn hóa',
  shopping: 'Mua sắm',
  entertainment: 'Giải trí',
}

export function formatRating(rating: number | string | null | undefined) {
  if (rating === null || rating === undefined) {
    return 'Chưa có'
  }

  const numeric = typeof rating === 'number' ? rating : Number(rating)
  if (Number.isNaN(numeric)) {
    return 'Chưa có'
  }

  return numeric.toFixed(1)
}

export function formatDate(iso: string) {
  const value = new Date(iso)
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value)
}

export function statusOpenNowText(openNow: boolean | null) {
  if (openNow === true) return 'Đang mở cửa'
  if (openNow === false) return 'Đang đóng cửa'
  return 'Chưa rõ giờ mở'
}
