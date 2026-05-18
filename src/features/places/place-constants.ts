import type { PlaceCategory } from '../../types/domain'

export const placeCategories: Array<{ value: PlaceCategory; label: string; emoji: string }> = [
  { value: 'food', label: 'Ăn no', emoji: '🍜' },
  { value: 'coffee_tea', label: 'Cafe/Trà', emoji: '🧋' },
  { value: 'bar_pub', label: 'Bar/Pub', emoji: '🍸' },
  { value: 'gaming', label: 'Gaming', emoji: '🎮' },
  { value: 'culture_art', label: 'Văn hóa', emoji: '🎭' },
  { value: 'shopping', label: 'Mua sắm', emoji: '🛍️' },
  { value: 'entertainment', label: 'Giải trí', emoji: '🎡' },
]

export const hanoiDistricts = [
  'Ba Đình',
  'Hoàn Kiếm',
  'Hai Bà Trưng',
  'Đống Đa',
  'Tây Hồ',
  'Cầu Giấy',
  'Thanh Xuân',
  'Hoàng Mai',
  'Long Biên',
  'Nam Từ Liêm',
  'Bắc Từ Liêm',
  'Hà Đông',
]
