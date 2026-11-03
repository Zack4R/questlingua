import surveyVideo from '../assets/saualnama.mp4'

/** Classroom recording of the questionnaire (Сауалнама) shown on the Results slide. */
export const SURVEY_VIDEO = surveyVideo

/**
 * Downloads the video once after the first load so it sits in the browser cache
 * (hashed /assets/ files are served as immutable) before the Results slide is reached.
 * The service worker leaves videos alone: <video> needs range requests to play and seek.
 */
export function cacheMedia() {
  if (!import.meta.env.PROD) return
  fetch(SURVEY_VIDEO)
    .then((r) => r.blob())
    .catch(() => {
      // Offline: the video still loads when the slide is shown.
    })
}
