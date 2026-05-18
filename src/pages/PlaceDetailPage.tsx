import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '../components/common/PageStates'
import { useToast } from '../components/common/use-toast'
import { ApiClientError, queryKeys } from '../lib/api/client'
import { formatRating, statusOpenNowText } from '../lib/utils/format'
import { useAuth } from '../features/auth/use-auth'
import { ReviewSection } from '../features/reviews/ReviewSection'
import { favoritePlace, fetchPlaceDetail, unfavoritePlace } from '../features/places/places-api'

export default function PlaceDetailPage() {
  const params = useParams()
  const placeId = params.placeId ?? ''
  const { showToast } = useToast()
  const { ensureAuthOrPrompt } = useAuth()
  const [favoriteOverride, setFavoriteOverride] = useState<boolean | null>(null)

  const detailQuery = useQuery({
    queryKey: queryKeys.placeDetail(placeId),
    queryFn: () => fetchPlaceDetail(placeId),
    enabled: Boolean(placeId),
  })

  const favoriteMutation = useMutation({
    mutationFn: async ({ placeId, favorited }: { placeId: string; favorited: boolean }) => {
      if (favorited) {
        await unfavoritePlace(placeId)
      } else {
        await favoritePlace(placeId)
      }
      return !favorited
    },
    onSuccess: (value) => {
      setFavoriteOverride(value)
      showToast(value ? 'Đã lưu quán 💖' : 'Đã bỏ lưu', 'success')
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.code === 'UNAUTHORIZED') {
        ensureAuthOrPrompt('login')
        return
      }
      showToast(error instanceof Error ? error.message : 'Không thể cập nhật yêu thích.', 'error')
    },
  })

  const place = detailQuery.data

  const favorited = useMemo(() => {
    if (!place) return false
    if (favoriteOverride !== null) return favoriteOverride
    return place.is_favorited
  }, [place, favoriteOverride])

  if (!placeId) {
    return <EmptyState title="Không có id quán" description="Bạn quay lại trang trước và chọn lại quán nhé." />
  }

  return (
    <div className="space-y-4">
      <div>
        <Link to="/places" className="text-sm font-semibold text-[#6f668d] hover:text-ink">
          ← Quay lại danh sách
        </Link>
      </div>

      {detailQuery.isLoading ? <LoadingState /> : null}

      {detailQuery.isError ? (
        <ErrorState
          title="Không lấy được chi tiết quán"
          description={detailQuery.error instanceof Error ? detailQuery.error.message : 'Có lỗi xảy ra'}
          actionLabel="Thử lại"
          onAction={() => detailQuery.refetch()}
        />
      ) : null}

      {place ? (
        <>
          <Card className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="kawaii-pill bg-mint text-ink">✨ {statusOpenNowText(place.is_open_now)}</p>
                <h1 className="mt-2 font-display text-3xl leading-tight text-ink">{place.displayName}</h1>
                <p className="mt-2 text-sm text-[#6f668d]">📍 {place.formattedAddress}</p>
              </div>
              <span className="kawaii-pill bg-peach text-ink">⭐ {formatRating(place.rating)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={favorited ? 'secondary' : 'primary'}
                onClick={() => {
                  if (!ensureAuthOrPrompt('login')) return
                  favoriteMutation.mutate({ placeId, favorited })
                }}
              >
                {favorited ? 'Bỏ lưu quán' : 'Lưu quán'}
              </Button>
              {place.googleMapsUri ? (
                <a href={place.googleMapsUri} target="_blank" rel="noreferrer">
                  <Button>Xem trên Google Maps</Button>
                </a>
              ) : null}
            </div>

            <div className="h-px bg-[#f0e4ea]" />

            <div className="grid gap-2 text-sm text-[#6f668d] md:grid-cols-2">
              <p>🕒 {statusOpenNowText(place.is_open_now)}</p>
              <p>⭐ Đánh giá Google: {formatRating(place.rating)}</p>
              <p>
                💬 Đánh giá nội bộ: {formatRating(place.internal_rating_avg)} ({place.internal_review_count} lượt)
              </p>
              {place.nationalPhoneNumber ? <p>📞 {place.nationalPhoneNumber}</p> : null}
            </div>
          </Card>

          <ReviewSection placeId={placeId} />
        </>
      ) : null}
    </div>
  )
}
