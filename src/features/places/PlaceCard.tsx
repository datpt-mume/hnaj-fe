import { Link } from 'react-router-dom'
import type { Place } from '../../types/domain'
import { formatRating, statusOpenNowText } from '../../lib/utils/format'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

type PlaceCardProps = {
  place: Place
  isFavorited?: boolean
  onFavoriteClick?: () => void
  favoriteLoading?: boolean
}

export function PlaceCard({ place, isFavorited, onFavoriteClick, favoriteLoading }: PlaceCardProps) {
  return (
    <Card className="animate-pop">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="kawaii-pill bg-mint text-ink">✨ {statusOpenNowText(place.is_open_now)}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight text-ink">{place.displayName}</h3>
        </div>
        <span className="kawaii-pill bg-peach text-ink">⭐ {formatRating(place.rating)}</span>
      </div>

      <p className="mt-3 text-sm text-[#6f668d]">📍 {place.formattedAddress}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={`/places/${place.id}`}>
          <Button>Xem chi tiết</Button>
        </Link>
        {onFavoriteClick ? (
          <Button variant="secondary" onClick={onFavoriteClick} disabled={favoriteLoading}>
            {isFavorited ? 'Bỏ lưu' : 'Lưu quán'}
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
