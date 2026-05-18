import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('glass-card p-4 md:p-5', className)} {...props} />
}
