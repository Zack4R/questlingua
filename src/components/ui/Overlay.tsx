import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/dom'

/** Modal layer used for the overview, shortcuts help and mission details. */
export function Overlay({
  open,
  onClose,
  title,
  children,
  className,
  labelledBy,
}: {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  className?: string
  labelledBy?: string
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    return () => prev?.focus?.()
  }, [open])

  if (!open) return null
  // Portalled to <body> so transformed / blurred ancestors never trap the fixed layer.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-navy-950/75 backdrop-blur-md" aria-hidden onMouseDown={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'panel relative max-h-[calc(100dvh-1.5rem)] w-full animate-pop overflow-y-auto p-5 outline-none scrollbar-thin sm:p-7',
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="-m-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-muted transition hover:bg-white/10 hover:text-ink"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
