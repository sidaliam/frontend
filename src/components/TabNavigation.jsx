import './TabNavigation.css'

export default function TabNavigation({
  sessions,
  activeSessionId,
  onSelectSession,
  onAddSession,
  onDeleteSession,
}) {
  return (
    <nav className="tab-navigation fixed-session-tabs"> {/* ← AJOUT */}
      {sessions.map((session) => (
        <div key={session.idSession} className="tab-button-wrapper">
          <button
            className={`tab-btn ${
              activeSessionId === session.idSession ? 'active' : ''
            } ${session.aprs_ok ? 'green' : ''}`}
            onClick={() => onSelectSession(session.idSession)}
          >
            {session.matricule || `Avion ${session.idSession}`}
          </button>
          <button
            className="tab-delete-btn"
            onClick={(e) => {
              e.stopPropagation()
              if (
                confirm(
                  `Supprimer la session ${session.matricule || session.idSession} ?`
                )
              ) {
                onDeleteSession(session.idSession)
              }
            }}
            title="Supprimer"
          >
            X
          </button>
        </div>
      ))}
      <button className="tab-add-btn" onClick={onAddSession}>
        + Ajouter
      </button>
    </nav>
  )
}