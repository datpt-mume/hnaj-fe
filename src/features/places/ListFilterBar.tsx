import type { PlaceCategory, PlacesListFilters } from '../../types/domain'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { hanoiDistricts, placeCategories } from './place-constants'

function parseCategory(value: string): PlaceCategory | undefined {
  if (value === '') return undefined
  return value as PlaceCategory
}

type ListFilterBarProps = {
  value: PlacesListFilters
  onChange: (value: PlacesListFilters) => void
  onApply: () => void
}

export function ListFilterBar({ value, onChange, onApply }: ListFilterBarProps) {
  return (
    <div className="glass-card space-y-3 p-4">
      <h2 className="font-display text-xl text-ink">Tìm quán theo gu của bạn</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <Input
          placeholder="Tìm tên quán, địa chỉ, số điện thoại..."
          value={value.q ?? ''}
          onChange={(event) => onChange({ ...value, q: event.target.value, page: 1 })}
        />

        <Select
          value={value.primary_category ?? ''}
          onChange={(event) => onChange({ ...value, primary_category: parseCategory(event.target.value), page: 1 })}
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
          onChange={(event) => onChange({ ...value, district: event.target.value || undefined, page: 1 })}
        >
          <option value="">Tất cả quận</option>
          {hanoiDistricts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </Select>

      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(value.open_now)}
            onChange={(event) => onChange({ ...value, open_now: event.target.checked || undefined, page: 1 })}
          />
          Chỉ quán đang mở cửa
        </label>

        <Button variant="secondary" onClick={onApply}>
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  )
}
