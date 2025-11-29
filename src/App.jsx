import { useState } from 'react'
import './App.css'
import SessionsView from './components/SessionsView'
import HistoryView from './components/HistoryView'
import AvionsView from './components/AvionsView'
import InfoView from './components/InfoView'

// Icônes Lucide
import { PlaneTakeoff, History, Plane, Info, Home } from 'lucide-react'

function App() {
  const [currentView, setCurrentView] = useState('sessions')

  const navItems = [
    { id: 'sessions', label: 'Sessions', icon: <PlaneTakeoff size={22} /> },
    { id: 'history',   label: 'Historique', icon: <History size={22} /> },
    { id: 'avions',    label: 'Avions', icon: <Plane size={22} /> },
    { id: 'infos',     label: 'Infos', icon: <Info size={22} /> },
  ]

  return (
    <div className="app">
      {/* Contenu principal */}
      <main className="app-main">
        {currentView === 'sessions' && <SessionsView />}
        {currentView === 'history' && <HistoryView />}
        {currentView === 'avions' && <AvionsView />}
        {currentView === 'infos' && <InfoView />}
      </main>

      {/* Navbar fixe en bas – Parfaite sur mobile */}
      <nav className="bottom-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {currentView === item.id && <span className="active-indicator"></span>}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App