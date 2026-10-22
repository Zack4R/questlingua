import { useEffect, useState } from 'react'

// Pronunciation support uses the browser's built-in speech synthesis. Voices that
// are installed on the device (localService) are preferred so it works offline.

const synth = () => (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null)

function pickVoice(preferIndex = 0): SpeechSynthesisVoice | null {
  const s = synth()
  if (!s) return null
  const english = s.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'))
  const local = english.filter((v) => v.localService)
  const pool = local.length ? local : english
  if (!pool.length) return null
  const ranked = [
    ...pool.filter((v) => /en-gb/i.test(v.lang)),
    ...pool.filter((v) => /en-us/i.test(v.lang)),
    ...pool.filter((v) => !/en-(gb|us)/i.test(v.lang)),
  ]
  return ranked[preferIndex % ranked.length] ?? ranked[0]
}

export function speak(text: string, opts: { voiceIndex?: number; rate?: number } = {}) {
  const s = synth()
  if (!s) return
  s.cancel()
  const u = new SpeechSynthesisUtterance(text.replace(/…/g, ' something '))
  const voice = pickVoice(opts.voiceIndex ?? 0)
  if (voice) u.voice = voice
  u.lang = voice?.lang ?? 'en-GB'
  u.rate = opts.rate ?? 0.92
  s.speak(u)
}

export function stopSpeaking() {
  synth()?.cancel()
}

/** True once at least one English voice is available. */
export function useSpeechAvailable() {
  const [available, setAvailable] = useState(() => !!pickVoice())
  useEffect(() => {
    const s = synth()
    if (!s) return
    const update = () => setAvailable(!!pickVoice())
    update()
    s.addEventListener?.('voiceschanged', update)
    return () => s.removeEventListener?.('voiceschanged', update)
  }, [])
  return available
}
