import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { hanoiDistricts, placeCategories } from './place-constants'
import type { PlaceCategory, PlacesRandomFilters } from '../../types/domain'

function parseCategory(value: string): PlaceCategory | undefined {
  if (value === '') return undefined
  return value as PlaceCategory
}

type RandomFilterBarProps = {
  value: PlacesRandomFilters
  onChange: (value: PlacesRandomFilters) => void
  onSubmit: () => void
  loading?: boolean
  showFavoriteOnlyOption?: boolean
  favoriteCount?: number
}

export function RandomFilterBar({
  value,
  onChange,
  onSubmit,
  loading,
  showFavoriteOnlyOption,
  favoriteCount = 0,
}: RandomFilterBarProps) {
  return (
    <div className="glass-card space-y-3 p-4">
      <h2 className="font-display text-xl text-ink">Mix bộ lọc random</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <Select
          value={value.primary_category ?? ''}
          onChange={(event) => onChange({ ...value, primary_category: parseCategory(event.target.value) })}
        >
          <option value="">Tất cả chủ đề</option>
          {placeCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.emoji} {category.label}
            </option>
          ))}
        </Select>

        <Select
          value={value.district ?? ''}
          onChange={(event) => onChange({ ...value, district: event.target.value || undefined })}
        >
          <option value="">Tất cả quận</option>
          {hanoiDistricts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </Select>

        <Select
          value={String(value.limit ?? 1)}
          onChange={(event) => onChange({ ...value, limit: Number(event.target.value) })}
        >
          <option value="1">1 gợi ý</option>
          <option value="3">3 gợi ý</option>
          <option value="5">5 gợi ý</option>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(value.open_now)}
            onChange={(event) => onChange({ ...value, open_now: event.target.checked || undefined })}
          />
          Đang mở cửa
        </label>
        {showFavoriteOnlyOption ? (
          <label
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
              favoriteCount > 0 ? 'bg-white text-ink' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <input
              type="checkbox"
              checked={Boolean(value.favorite_only)}
              disabled={favoriteCount <= 0}
              onChange={(event) => onChange({ ...value, favorite_only: event.target.checked || undefined })}
            />
            Random trong quán đã lưu
          </label>
        ) : null}
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? 'Đang random...' : 'Random lại'}
        </Button>
      </div>

      {showFavoriteOnlyOption && favoriteCount <= 0 ? (
        <p className="text-xs text-[#9289ae]">
          Bạn chưa có quán đã lưu, hãy bấm “Lưu quán” ở thẻ quán để mở chế độ random trong danh sách yêu thích.
        </p>
      ) : null}
    </div>
  )
}
