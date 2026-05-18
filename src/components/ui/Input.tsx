import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-[#f0d7df] bg-white/90 px-4 text-sm text-ink placeholder:text-[#998fb0]',
        className,
      )}
      {...props}
    />
  )
}
