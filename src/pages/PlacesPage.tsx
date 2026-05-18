import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '../components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '../components/common/PageStates'
import { ListFilterBar } from '../features/places/ListFilterBar'
import { PlaceCard } from '../features/places/PlaceCard'
import { queryKeys } from '../lib/api/client'
import { fetchPlaces } from '../features/places/places-api'
import type { PlacesListFilters } from '../types/domain'

const defaultFilters: PlacesListFilters = {
  page: 1,
  limit: 12,
}

export default function PlacesPage() {
  const [draftFilters, setDraftFilters] = useState<PlacesListFilters>(defaultFilters)
  const [appliedFilters, setAppliedFilters] = useState<PlacesListFilters>(defaultFilters)

  const placesQuery = useQuery({
    queryKey: queryKeys.placesList(appliedFilters),
    queryFn: () => fetchPlaces(appliedFilters),
  })

  const pagination = placesQuery.data?.pagination

  return (
    <div className="space-y-4">
      <section className="glass-card p-5">
        <h1 className="font-display text-4xl text-ink">Khám phá toàn bộ quán</h1>
        <p className="mt-2 text-sm text-[#6f668d]">Lọc theo category, quận, khu vực và trạng thái mở cửa.</p>
      </section>

      <ListFilterBar value={draftFilters} onChange={setDraftFilters} onApply={() => setAppliedFilters({ ...draftFilters })} />

      {placesQuery.isLoading ? <LoadingState /> : null}

      {placesQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách quán"
          description={placesQuery.error instanceof Error ? placesQuery.error.message : 'Có lỗi xảy ra'}
          actionLabel="Thử lại"
          onAction={() => placesQuery.refetch()}
        />
      ) : null}

      {!placesQuery.isLoading && !placesQuery.isError && (placesQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="Không có kết quả phù hợp"
          description="Bạn thử bỏ bớt điều kiện lọc để tìm thêm quán nhé."
          actionLabel="Xóa filter"
          onAction={() => {
            setDraftFilters(defaultFilters)
            setAppliedFilters(defaultFilters)
          }}
        />
      ) : null}

      <section className="grid gap-3 md:grid-cols-2">
        {placesQuery.data?.items.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </section>

      {pagination ? (
        <div className="glass-card flex items-center justify-between p-4">
          <p className="text-sm text-[#6f668d]">
            Trang {pagination.page}/{pagination.total_pages} · {pagination.total} quán
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={pagination.page <= 1}
              onClick={() => {
                const page = Math.max(1, pagination.page - 1)
                setDraftFilters((prev) => ({ ...prev, page }))
                setAppliedFilters((prev) => ({ ...prev, page }))
              }}
            >
              Trang trước
            </Button>
            <Button
              variant="secondary"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => {
                const page = Math.min(pagination.total_pages, pagination.page + 1)
                setDraftFilters((prev) => ({ ...prev, page }))
                setAppliedFilters((prev) => ({ ...prev, page }))
              }}
            >
              Trang sau
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
