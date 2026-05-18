import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

type StateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function LoadingState() {
  return (
    <div className="space-y-3">
      <div className="h-24 animate-pulse rounded-3xl bg-white/70" />
      <div className="h-24 animate-pulse rounded-3xl bg-white/70" />
      <div className="h-24 animate-pulse rounded-3xl bg-white/70" />
    </div>
  )
}

export function EmptyState({ title, description, actionLabel, onAction }: StateProps) {
  return (
    <Card className="text-center">
      <p className="text-4xl">(｡•́︿•̀｡)</p>
      <h3 className="mt-2 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm text-[#7f779d]">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  )
}

export function ErrorState({ title, description, actionLabel, onAction }: StateProps) {
  return (
    <Card className="border-rose-200 bg-rose-50/70 text-center">
      <p className="text-4xl">(╥﹏╥)</p>
      <h3 className="mt-2 font-display text-xl text-rose-700">{title}</h3>
      <p className="mt-2 text-sm text-rose-700/80">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-4" variant="danger" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  )
}
