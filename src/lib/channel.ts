// Same-origin messaging between the projected presentation and the presenter view.
// Works offline; nothing leaves the browser.

export type PresenterMessage =
  | { type: 'state'; index: number }
  | { type: 'go'; index: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'hello' }

const NAME = 'questlingua-presenter'

export function openChannel(onMessage: (m: PresenterMessage) => void) {
  if (typeof BroadcastChannel === 'undefined') return { post: () => {}, close: () => {} }
  const ch = new BroadcastChannel(NAME)
  ch.onmessage = (e) => onMessage(e.data as PresenterMessage)
  return {
    post: (m: PresenterMessage) => ch.postMessage(m),
    close: () => ch.close(),
  }
}
