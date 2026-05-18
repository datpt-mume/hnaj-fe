import { describe, expect, it } from 'vitest'
import { formatDate, formatRating, statusOpenNowText } from './format'

describe('format utils', () => {
  it('formats rating with one decimal', () => {
    expect(formatRating(4.56)).toBe('4.6')
    expect(formatRating('4.2')).toBe('4.2')
    expect(formatRating(null)).toBe('Chưa có')
    expect(formatRating('abc')).toBe('Chưa có')
  })

  it('maps open status text correctly', () => {
    expect(statusOpenNowText(true)).toBe('Đang mở cửa')
    expect(statusOpenNowText(false)).toBe('Đang đóng cửa')
    expect(statusOpenNowText(null)).toBe('Chưa rõ giờ mở')
  })

  it('formats date in vi-VN locale', () => {
    const value = formatDate('2026-05-18T10:00:00+00:00')
    expect(value.length).toBeGreaterThan(0)
  })
})
