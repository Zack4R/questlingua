import { Info, WifiOff } from 'lucide-react'
import { FindYourWayDemo } from '../components/demo/FindYourWayDemo'
import { SlideFrame } from './SlideFrame'

export function DemoSlide() {
  return (
    <SlideFrame className="lg:pt-[1.6rem]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="eyebrow">05 · Live practical demonstration</p>
          <h2 className="mt-1.5 font-display text-[1.9rem] leading-tight font-semibold tracking-tight lg:text-[2.2rem]">
            Mission 02 · <span className="text-gradient">Find Your Way</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 pb-1 text-[0.8rem] lg:text-[0.85rem]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-glow/40 bg-amber-glow/[0.08] px-3 py-1 text-amber-50">
            <Info className="size-3.5" /> Browser demonstration of the teaching method — not evidence of learning improvement
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-muted">
            <WifiOff className="size-3.5" /> Runs locally · no game login
          </span>
        </div>
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col lg:mt-[1rem]">
        <FindYourWayDemo />
      </div>
    </SlideFrame>
  )
}
