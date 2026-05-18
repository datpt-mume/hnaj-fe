import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiClientError, queryKeys } from '../../lib/api/client'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../auth/use-auth'
import { useToast } from '../../components/common/use-toast'
import { formatDate } from '../../lib/utils/format'
import { RatingStars } from '../../components/common/RatingStars'
import { queryClient } from '../../app/query-client'
import {
  createReview,
  deleteMyReview,
  fetchPlaceReviews,
  updateMyReview,
} from '../places/places-api'

type ReviewSectionProps = {
  placeId: string
}

export function ReviewSection({ placeId }: ReviewSectionProps) {
  const { showToast } = useToast()
  const { user, ensureAuthOrPrompt } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isEditing, setEditing] = useState(false)

  const reviewsQuery = useQuery({
    queryKey: queryKeys.placeReviews(placeId, 1, 20),
    queryFn: () => fetchPlaceReviews(placeId, 1, 20),
  })

  const myReview = useMemo(
    () => reviewsQuery.data?.items.find((review) => review.user.id === user?.id) ?? null,
    [reviewsQuery.data?.items, user?.id],
  )

  const createMutation = useMutation({
    mutationFn: () => createReview(placeId, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.placeReviews(placeId, 1, 20) })
      showToast('Đã đăng review mới ✨', 'success')
      setComment('')
      setRating(5)
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.code === 'CONFLICT') {
        setEditing(true)
        showToast('Bạn đã có review, chuyển sang chế độ chỉnh sửa.', 'info')
      } else {
        showToast(error instanceof Error ? error.message : 'Không thể gửi review.', 'error')
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: () => updateMyReview(placeId, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.placeReviews(placeId, 1, 20) })
      showToast('Cập nhật review thành công 💖', 'success')
      setEditing(false)
      setComment('')
    },
    onError: (error) => showToast(error instanceof Error ? error.message : 'Không thể sửa review.', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteMyReview(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.placeReviews(placeId, 1, 20) })
      showToast('Đã xóa review.', 'success')
      setEditing(false)
      setComment('')
      setRating(5)
    },
    onError: (error) => showToast(error instanceof Error ? error.message : 'Không thể xóa review.', 'error'),
  })

  function handleSubmit() {
    if (!ensureAuthOrPrompt('login')) return

    if (isEditing || myReview) {
      updateMutation.mutate()
      return
    }

    createMutation.mutate()
  }

  function handleStartEdit() {
    if (!myReview) return
    setEditing(true)
    setRating(myReview.rating)
    setComment(myReview.comment ?? '')
  }

  return (
    <Card>
      <div>
        <h3 className="font-display text-2xl text-ink">Review từ cộng đồng</h3>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-[#6f668d]">Chia sẻ trải nghiệm thật để team ăn chơi có thêm niềm tin nha.</p>

          <RatingStars rating={rating} onChange={setRating} />

          <Input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Review ngắn gọn nhưng có tâm..."
            maxLength={2000}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
            >
              {isEditing || myReview ? 'Lưu chỉnh sửa' : 'Đăng review'}
            </Button>

            {myReview && !isEditing ? (
              <Button variant="secondary" onClick={handleStartEdit}>
                Chỉnh sửa review của mình
              </Button>
            ) : null}

            {myReview ? (
              <Button variant="danger" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                Xóa review
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-[#f0e4ea] pt-4">
        <h4 className="font-display text-xl text-ink">Mọi người nói gì</h4>

        <div className="mt-3 space-y-3">
          {reviewsQuery.isLoading ? <p className="text-sm text-[#7b739a]">Đang tải review...</p> : null}

          {!reviewsQuery.isLoading && (reviewsQuery.data?.items.length ?? 0) === 0 ? (
            <p className="text-sm text-[#7b739a]">Chưa có review nào, bạn là người đầu tiên nhé.</p>
          ) : null}

          {reviewsQuery.data?.items.map((review) => (
            <div key={review.id} className="rounded-2xl bg-cream p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-ink">{review.user.name}</p>
                <RatingStars rating={review.rating} size="sm" />
              </div>
              <p className="mt-2 text-sm text-[#6f668d]">{review.comment || 'Không để lại bình luận.'}</p>
              <p className="mt-1 text-xs text-[#9189af]">{formatDate(review.updated_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
