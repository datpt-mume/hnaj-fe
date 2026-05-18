import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'
import { ToastContext, type ToastVariant } from './toast-context'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null)

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    setToast({ message, variant })
    window.setTimeout(() => {
      setToast(null)
    }, 2500)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          className={cn(
            'fixed bottom-24 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-cloud md:bottom-8',
            toast.variant === 'success' && 'bg-emerald-500',
            toast.variant === 'error' && 'bg-rose-500',
            toast.variant === 'info' && 'bg-ink',
          )}
        >
          {toast.message}
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}
