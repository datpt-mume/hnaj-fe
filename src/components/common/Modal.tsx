import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/utils/cn'

type ModalProps = PropsWithChildren<{
  open: boolean
  title: string
  onClose: () => void
  className?: string
}>

export function Modal({ open, title, onClose, className, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-3 md:items-center">
      <div className={cn('w-full max-w-md rounded-t-3xl bg-white p-5 shadow-cloud md:rounded-3xl', className)}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          <button
            type="button"
            className="rounded-full bg-cream px-3 py-1 text-sm font-semibold text-ink"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
