import { useState, useEffect } from 'react'
import { avionService, sessionService } from '../services/api'
import TabNavigation from './TabNavigation'
import TabContent from './TabContent'
import toast from 'react-hot-toast'
import { PlaneTakeoff } from 'lucide-react'
import './SessionsView.css'

export default function SessionsView() {
  const [avions, setAvions] = useState([])
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadAvions(), loadSessions()])
      setLoading(false)
    }
    init()
  }, [])

  const loadAvions = async () => {
    try {
      const res = await avionService.getAllAvions()
      setAvions(res.data)
    } catch (err) {
      toast.error('Erreur chargement avions')
    }
  }

  const loadSessions = async () => {
    try {
      const res = await sessionService.getAllSessions()
      const sess = res.data || []
      setSessions(sess)

      // Auto-sélection intelligente
      if (sess.length > 0) {
        const active = sess.find(s => s.idSession === activeSessionId) || sess[0]
        setActiveSessionId(active.idSession)
      }
    } catch (err) {
      toast.error('Erreur chargement sessions')
    }
  }

  const handleAddSession = async () => {
    if (avions.length === 0) {
      toast.error('Ajoutez d’abord un avion')
      return
    }

    try {
      const newSess = await sessionService.createSession({
        idAvion: avions[0].idAvion,
        aprs_ok: false,
      })

      await loadSessions()
      setActiveSessionId(newSess.data.idSession)
      toast.success('Session créée')
    } catch (err) {
      toast.error('Erreur création session')
    }
  }

  const handleDeleteSession = async (id) => {
    if (!confirm('Supprimer cette session ?')) return

    try {
      await sessionService.deleteSession(id)
      await loadSessions()
      toast.success('Session supprimée')
    } catch (err) {
      toast.error('Impossible de supprimer (tractages en cours ?)')
    }
  }

  const activeSession = sessions.find(s => s.idSession === activeSessionId)

  if (loading) {
    return (
      <div className="sessions-view loading">
        <PlaneTakeoff size={32} className="spin" />
        <p>Chargement...</p>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="sessions-view empty-state">
        <PlaneTakeoff size={64} opacity={0.3} />
        <h2>Bienvenue !</h2>
        <p>Aucune session active</p>
        <button className="btn-primary large" onClick={handleAddSession}>
          + Nouvelle session
        </button>
      </div>
    )
  }

  return (
    <div className="sessions-view">
      {/* Contenu principal - prend toute la hauteur */}
      <div className="tab-content-wrapper">
        <TabContent
          key={activeSessionId} // Force re-render propre
          session={activeSession}
          avions={avions}
          onSessionUpdated={loadSessions}
        />
      </div>

      {/* Navigation fixe en bas */}
      <div className="tab-navigation-fixed">
        <TabNavigation
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onAddSession={handleAddSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>
<br />
<br />
<br />
    </div>
  )
}