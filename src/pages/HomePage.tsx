import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { EmptyState, ErrorState, LoadingState } from '../components/common/PageStates'
import { useToast } from '../components/common/use-toast'
import { queryClient } from '../app/query-client'
import { ApiClientError, queryKeys } from '../lib/api/client'
import { useAuth } from '../features/auth/use-auth'
import { PlaceCard } from '../features/places/PlaceCard'
import { RandomFilterBar } from '../features/places/RandomFilterBar'
import { favoritePlace, fetchMyFavorites, fetchRandomPlaces, unfavoritePlace } from '../features/places/places-api'
import type { PlacesRandomFilters } from '../types/domain'

const defaultFilters: PlacesRandomFilters = {
  limit: 3,
  open_now: true,
}

export default function HomePage() {
  const { showToast } = useToast()
  const { ensureAuthOrPrompt, isAuthenticated } = useAuth()
  const [draftFilters, setDraftFilters] = useState<PlacesRandomFilters>(defaultFilters)
  const [appliedFilters, setAppliedFilters] = useState<PlacesRandomFilters>(defaultFilters)
  const [refreshSeed, setRefreshSeed] = useState(0)
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({})

  const randomQuery = useQuery({
    queryKey: queryKeys.randomPlaces({ ...appliedFilters, refreshSeed }),
    queryFn: () => fetchRandomPlaces(appliedFilters),
  })
  const favoriteStatsQuery = useQuery({
    queryKey: queryKeys.favoritePlaces(1, 1),
    queryFn: () => fetchMyFavorites(1, 1),
    enabled: isAuthenticated,
  })

  const favoriteMutation = useMutation({
    mutationFn: async ({ placeId, favorited }: { placeId: string; favorited: boolean }) => {
      if (favorited) {
        await unfavoritePlace(placeId)
      } else {
        await favoritePlace(placeId)
      }
      return { placeId, favorited: !favorited }
    },
    onSuccess: ({ placeId, favorited }) => {
      setFavoriteMap((prev) => ({ ...prev, [placeId]: favorited }))
      queryClient.invalidateQueries({ queryKey: ['users', 'favorites'] })
      showToast(favorited ? 'Đã lưu quán vào danh sách yêu thích 💖' : 'Đã bỏ khỏi yêu thích', 'success')
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.code === 'UNAUTHORIZED') {
        ensureAuthOrPrompt('login')
        return
      }

      showToast(error instanceof Error ? error.message : 'Không thể lưu quán.', 'error')
    },
  })

  const items = randomQuery.data?.items ?? []
  const favoriteCount = favoriteStatsQuery.data?.pagination.total ?? 0

  useEffect(() => {
    if (favoriteCount > 0) return
    if (!draftFilters.favorite_only && !appliedFilters.favorite_only) return

    setDraftFilters((prev) => ({ ...prev, favorite_only: undefined }))
    setAppliedFilters((prev) => ({ ...prev, favorite_only: undefined }))
  }, [favoriteCount, draftFilters.favorite_only, appliedFilters.favorite_only])

  const title = useMemo(() => {
    if ((appliedFilters.primary_category ?? '') !== '') {
      return 'Gợi ý chuẩn gu của bạn'
    }
    return 'Bốc quán ngẫu nhiên cho hôm nay'
  }, [appliedFilters.primary_category])

  function handleRandom() {
    setAppliedFilters({ ...draftFilters })
    setRefreshSeed((prev) => prev + 1)
  }

  function handleFavorite(placeId: string, current: boolean) {
    if (!ensureAuthOrPrompt('login')) {
      return
    }
    favoriteMutation.mutate({ placeId, favorited: current })
  }

  return (
    <div className="space-y-4">
      <section className="glass-card overflow-hidden p-5">
        <div className="relative">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-melon/70 blur-xl" />
          <h1 className="font-display text-4xl leading-tight text-ink">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6f668d]">
            Không biết đi đâu ăn gì? Chọn mood, bấm random, hệ thống sẽ đề xuất quán theo quận và trạng thái mở cửa.
          </p>
        </div>
      </section>

      <RandomFilterBar
        value={draftFilters}
        onChange={setDraftFilters}
        onSubmit={handleRandom}
        loading={randomQuery.isFetching}
        showFavoriteOnlyOption={isAuthenticated}
        favoriteCount={favoriteCount}
      />

      <section className="space-y-3">
        {randomQuery.isLoading ? <LoadingState /> : null}

        {randomQuery.isError ? (
          <ErrorState
            title="Random lỗi mất rồi"
            description={randomQuery.error instanceof Error ? randomQuery.error.message : 'Không thể tải dữ liệu.'}
            actionLabel="Thử lại"
            onAction={() => randomQuery.refetch()}
          />
        ) : null}

        {!randomQuery.isLoading && !randomQuery.isError && items.length === 0 ? (
          <EmptyState
            title="Chưa thấy quán phù hợp"
            description="Thử nới filter một chút nhé, ví dụ tắt 'đang mở cửa' hoặc đổi quận."
            actionLabel="Làm mới"
            onAction={() => randomQuery.refetch()}
          />
        ) : null}

        {items.map((place) => {
          const favorited = favoriteMap[place.id] ?? false
          return (
            <PlaceCard
              key={place.id}
              place={place}
              isFavorited={favorited}
              onFavoriteClick={() => handleFavorite(place.id, favorited)}
              favoriteLoading={favoriteMutation.isPending}
            />
          )
        })}
      </section>
    </div>
  )
}
