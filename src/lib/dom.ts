export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

/** True when the event comes from a field where keys must reach the field, not the presentation. */
export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

export function downloadText(filename: string, text: string, type = 'application/json') {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

export function formatClock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${pad2(s % 60)}`
}

/**
 * Layout-independent shortcut key: letters come from the physical key (e.code),
 * so shortcuts also work when the keyboard is switched to Russian or Kazakh.
 */
export function shortcutKey(e: KeyboardEvent) {
  if (e.code?.startsWith('Key')) return e.code.slice(3).toLowerCase()
  return e.key.length === 1 ? e.key.toLowerCase() : e.key
}
