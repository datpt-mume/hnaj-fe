import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-2xl border border-[#f0d7df] bg-white/90 px-4 text-sm text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
