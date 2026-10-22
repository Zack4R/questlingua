import { Navigate, Route, Routes } from 'react-router'
import { ResearchRecordProvider } from './lib/record'
import { TimerProvider } from './lib/timer'
import { Backdrop } from './components/visuals/Backdrop'
import { PresentationPage } from './presentation/PresentationPage'
import { PresenterPage } from './presentation/PresenterPage'
import { ExplorePage } from './explore/ExplorePage'

export function App() {
  return (
    <ResearchRecordProvider>
      <TimerProvider>
        <Backdrop />
        <Routes>
          <Route path="/" element={<PresentationPage />} />
          <Route path="/slide/:n" element={<PresentationPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/:section" element={<ExplorePage />} />
          <Route path="/presenter" element={<PresenterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TimerProvider>
    </ResearchRecordProvider>
  )
}
