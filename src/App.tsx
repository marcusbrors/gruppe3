import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TournamentProvider } from './context/TournamentContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CreateTournamentPage } from './pages/CreateTournamentPage'
import { TournamentDetailPage } from './pages/TournamentDetailPage'

export default function App() {
  return (
    <TournamentProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="ny" element={<CreateTournamentPage />} />
            <Route path="turnering/:id" element={<TournamentDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TournamentProvider>
  )
}
