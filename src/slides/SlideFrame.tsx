import type { ReactNode } from 'react'
import { cn } from '../lib/dom'

/** Common slide padding. On large screens a slide fills exactly one screen; on phones it scrolls. */
export function SlideFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-full w-full max-w-[100rem] flex-col px-5 pt-7 pb-28 sm:px-8 lg:h-full lg:min-h-0 lg:px-[4rem] lg:pt-[2.4rem] lg:pb-[1rem]',
        className,
      )}
    >
      {children}
    </div>
  )
}
