import { useCallback, useEffect, useState } from 'react'

type FsDocument = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void> }
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }

const fsElement = () => document.fullscreenElement ?? (document as FsDocument).webkitFullscreenElement ?? null

export const fullscreenSupported = () =>
  typeof document !== 'undefined' &&
  !!(document.documentElement.requestFullscreen || (document.documentElement as FsElement).webkitRequestFullscreen)

/** Must be called from a user gesture (click / key press). */
export async function enterFullscreen() {
  const el = document.documentElement as FsElement
  if (fsElement()) return
  try {
    if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' })
    else await el.webkitRequestFullscreen?.()
  } catch {
    /* refused by the browser — the presentation still works in a window */
  }
}

export async function exitFullscreen() {
  if (!fsElement()) return
  try {
    if (document.exitFullscreen) await document.exitFullscreen()
    else await (document as FsDocument).webkitExitFullscreen?.()
  } catch {
    /* ignore */
  }
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(() => typeof document !== 'undefined' && !!fsElement())

  useEffect(() => {
    const update = () => setIsFullscreen(!!fsElement())
    document.addEventListener('fullscreenchange', update)
    document.addEventListener('webkitfullscreenchange', update)
    return () => {
      document.removeEventListener('fullscreenchange', update)
      document.removeEventListener('webkitfullscreenchange', update)
    }
  }, [])

  const toggle = useCallback(() => (fsElement() ? exitFullscreen() : enterFullscreen()), [])

  return { isFullscreen, toggle, supported: fullscreenSupported() }
}
