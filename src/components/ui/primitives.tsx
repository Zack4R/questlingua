import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'subtle'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-300 to-violet-300 text-navy-950 font-semibold shadow-[0_0.6rem_2rem_-0.6rem_rgb(94_231_255/0.65)] hover:brightness-110',
  secondary: 'border border-line bg-white/[0.04] text-ink hover:bg-white/[0.09] hover:border-white/25',
  ghost: 'text-muted hover:text-ink hover:bg-white/[0.06]',
  subtle: 'border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-100 hover:bg-cyan-glow/20',
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg' }
>(function Button({ variant = 'secondary', size = 'md', className, type = 'button', ...rest }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl transition duration-200 disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' && 'px-3 py-1.5 text-[0.85rem]',
        size === 'md' && 'px-4 py-2.5 text-[0.95rem]',
        size === 'lg' && 'px-6 py-3.5 text-[1.1rem]',
        variants[variant],
        className,
      )}
      {...rest}
    />
  )
})

export function Badge({
  children,
  tone = 'cyan',
  className,
}: {
  children: ReactNode
  tone?: 'cyan' | 'violet' | 'mint' | 'amber' | 'rose' | 'neutral'
  className?: string
}) {
  const tones = {
    cyan: 'border-cyan-glow/35 bg-cyan-glow/10 text-cyan-100',
    violet: 'border-violet-glow/40 bg-violet-glow/10 text-violet-100',
    mint: 'border-mint-glow/35 bg-mint-glow/10 text-emerald-100',
    amber: 'border-amber-glow/45 bg-amber-glow/10 text-amber-100',
    rose: 'border-rose-glow/45 bg-rose-glow/10 text-rose-100',
    neutral: 'border-line bg-white/[0.04] text-muted',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.75rem] font-semibold tracking-wide uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.8em] items-center justify-center rounded-md border border-white/20 border-b-white/10 bg-white/[0.06] px-1.5 py-0.5 font-sans text-[0.8em] font-semibold text-ink shadow-[inset_0_-2px_0_rgb(0_0_0/0.3)]">
      {children}
    </kbd>
  )
}

export function SlideHeading({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="max-w-[70rem]">
      <p className="eyebrow">{kicker}</p>
      <h2 className="mt-2 font-display text-[2rem] leading-[1.08] font-semibold tracking-tight text-balance lg:text-[2.6rem]">
        {title}
      </h2>
      {children && <p className="mt-3 max-w-[62rem] text-[1.05rem] leading-relaxed text-muted lg:text-[1.2rem]">{children}</p>}
    </header>
  )
}

export function IconTile({ children, color = '#5ee7ff', className }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={cn('grid shrink-0 place-items-center rounded-xl border', className)}
      style={{
        color,
        borderColor: `${color}55`,
        background: `radial-gradient(circle at 30% 20%, ${color}33, ${color}0d 70%)`,
        boxShadow: `0 0 1.4rem -0.5rem ${color}aa`,
      }}
    >
      {children}
    </span>
  )
}
