import { cn } from '../../lib/utils/cn'

type RatingStarsProps = {
  rating: number
  onChange?: (rating: number) => void
  size?: 'sm' | 'md'
}

export function RatingStars({ rating, onChange, size = 'md' }: RatingStarsProps) {
  const iconSize = size === 'md' ? 'text-2xl' : 'text-lg'

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const active = rating >= value
        const button = typeof onChange === 'function'

        return (
          <button
            key={value}
            type="button"
            onClick={button ? () => onChange(value) : undefined}
            className={cn(iconSize, active ? 'text-amber-400' : 'text-slate-300')}
            aria-label={`Chọn ${value} sao`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
