import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '../components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '../components/common/PageStates'
import { queryClient } from '../app/query-client'
import { queryKeys } from '../lib/api/client'
import { PlaceCard } from '../features/places/PlaceCard'
import { fetchMyFavorites, unfavoritePlace } from '../features/places/places-api'
import { useToast } from '../components/common/use-toast'

export default function FavoritesPage() {
  const { showToast } = useToast()
  const [page, setPage] = useState(1)
  const limit = 12

  const favoritesQuery = useQuery({
    queryKey: queryKeys.favoritePlaces(page, limit),
    queryFn: () => fetchMyFavorites(page, limit),
  })

  const unfavoriteMutation = useMutation({
    mutationFn: unfavoritePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'favorites'] })
      showToast('Đã bỏ khỏi danh sách yêu thích.', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Không thể cập nhật yêu thích.', 'error')
    },
  })

  const pagination = favoritesQuery.data?.pagination

  return (
    <div className="space-y-4">
      <section className="glass-card p-5">
        <h1 className="font-display text-4xl text-ink">Kho quán yêu thích</h1>
        <p className="mt-2 text-sm text-[#6f668d]">Các quán bạn đã lưu để rủ hội đi liền tay.</p>
      </section>

      {favoritesQuery.isLoading ? <LoadingState /> : null}

      {favoritesQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách yêu thích"
          description={favoritesQuery.error instanceof Error ? favoritesQuery.error.message : 'Có lỗi xảy ra'}
          actionLabel="Thử lại"
          onAction={() => favoritesQuery.refetch()}
        />
      ) : null}

      {!favoritesQuery.isLoading && !favoritesQuery.isError && (favoritesQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="Bạn chưa lưu quán nào"
          description="Qua màn random hoặc khám phá để thả tim quán hợp gu nhé."
        />
      ) : null}

      <section className="grid gap-3 md:grid-cols-2">
        {favoritesQuery.data?.items.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isFavorited
            onFavoriteClick={() => unfavoriteMutation.mutate(place.id)}
            favoriteLoading={unfavoriteMutation.isPending}
          />
        ))}
      </section>

      {pagination ? (
        <div className="glass-card flex items-center justify-between p-4">
          <p className="text-sm text-[#6f668d]">
            Trang {pagination.page}/{pagination.total_pages}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={pagination.page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              Trang trước
            </Button>
            <Button
              variant="secondary"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Trang sau
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
