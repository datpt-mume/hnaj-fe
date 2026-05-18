import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#f48ab0] to-[#f59a88] text-white shadow-[0_8px_20px_rgba(244,138,176,0.2)] hover:brightness-105 active:translate-y-px',
  secondary: 'bg-white text-ink border border-[#e8dce5] hover:bg-cream',
  ghost: 'bg-transparent text-ink hover:bg-white/70',
  danger: 'bg-rose-400 text-white hover:bg-rose-500',
}

export function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variantMap[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
}
