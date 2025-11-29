import { useState, useEffect } from "react";
import { historiqueService } from "../services/api";
import "./HistoryView.css";
import {
  Calendar,
  Clock,
  Plane,
  Tractor,
  Wrench,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
  ChevronRight,
  History as HistoryIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function HistoryView({ avionId = null }) {
  // AJOUT : prop optionnelle pour filtrer par avion
  const [historiques, setHistoriques] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadHistoriques();
  }, []);

  useEffect(() => {
    filterHistoriques();
    setCurrentPage(1);
  }, [historiques, selectedDate, avionId]);

  const loadHistoriques = async () => {
    try {
      setLoading(true);
      const res = await historiqueService.getAllHistoriques();
      const sorted = res.data.sort(
        (a, b) =>
          new Date(b.dateEnregistrement) - new Date(a.dateEnregistrement)
      );
      setHistoriques(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterHistoriques = () => {
    let list = [...historiques];

    // Filtre par avion sélectionné (si avionId est passé)
    if (avionId !== null) {
      list = list.filter((h) => {
        try {
          const data = JSON.parse(h.donnees);
          return data.idAvion === avionId;
        } catch {
          return false;
        }
      });
    }

    // Filtre par date
    if (selectedDate) {
      const selected = new Date(selectedDate);
      list = list.filter((h) => {
        const date = new Date(h.dateEnregistrement);
        return (
          date.toLocaleDateString("fr-FR") ===
          selected.toLocaleDateString("fr-FR")
        );
      });
    }

    setFiltered(list);
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const deleteItem = async (id) => {
    if (!confirm("Supprimer cet enregistrement ?")) return;
    try {
      await historiqueService.deleteHistorique(id);
      setHistoriques((prev) => prev.filter((h) => h.idHistorique !== id));
    } catch (err) {
      alert("Erreur suppression");
    }
  };

  const format = (date) =>
    new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const parseData = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="history-view center">
        <HistoryIcon size={32} className="spin" />
        <span>Chargement...</span>
      </div>
    );
  }

  return (
    <div className="history-view">
      <div className="history-header">
        <div className="header-title">
          <HistoryIcon size={28} />
          <h2>Historique {avionId ? `de l'avion sélectionné` : "global"}</h2>
        </div>

        <div className="filter-bar">
          <div className="date-input-wrapper">
            {/* Icône calendrier visible UNIQUEMENT si aucune date n'est sélectionnée */}
            {!selectedDate && <Calendar size={18} className="calendar-icon" />}
            {/* Petite croix rouge à droite QUAND une date est sélectionnée */}

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="Filtrer par date"
            />

            {selectedDate && (
              <button
                className="clear-date-btn"
                onClick={() => setSelectedDate("")}
                title="Effacer la date"
                aria-label="Effacer la date"
              >
                X
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Plane size={64} className="empty-icon" />
          <p>
            {avionId
              ? "Aucun enregistrement pour cet avion"
              : selectedDate
              ? "Aucun enregistrement pour cette date"
              : "Aucun enregistrement"}
          </p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {paginated.map((h) => {
              const data = parseData(h.donnees);
              if (!data) return null;

              const expanded = expandedId === h.idHistorique;

              return (
                <div
                  key={h.idHistorique}
                  className={`history-card ${expanded ? "expanded" : ""}`}
                  onClick={() =>
                    setExpandedId(expanded ? null : h.idHistorique)
                  }
                >
                  <div className="card-header">
                    <div className="card-main">
                      <div className="matricule-badge">
                        <Plane size={20} />
                        <strong>
                          {data.matricule || `Avion ${data.idAvion}`}
                        </strong>
                      </div>
                      <div className="card-date">
                        <Clock size={14} />
                        <span>{format(h.dateEnregistrement)}</span>
                        {expanded ? (
                          <ChevronDown size={22} />
                        ) : (
                          <ChevronRight size={22} />
                        )}
                      </div>
                    </div>

                    <div
                      className="card-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="btn-delete"
                        onClick={() => deleteItem(h.idHistorique)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="card-content">
                      <div className="time-grid">
                        <div className="time-box">
                          <span>Arrivée</span>
                          <strong>{data.heureArrivee || "–"}</strong>
                        </div>
                        <div className="time-box">
                          <span>Départ prévu</span>
                          <strong>{data.heureDepartPrevue || "–"}</strong>
                        </div>
                        <div className="time-box">
                          <span>Départ réel</span>
                          <strong>{data.heureDepartReelle || "–"}</strong>

                          {data.causeRetard && (
                            <div
                              className="cause-retard"
                              style={{ color: "red", marginTop: "10px" }}
                            >
                              Cause Retard : {data.causeRetard}
                            </div>
                          )}
                        </div>
                      </div>

                      {data.tractages?.length > 0 && (
                        <div className="section">
                          <h4>
                            <Tractor size={18} /> Tractages
                          </h4>
                          {data.tractages.map((t, i) => (
                            <div key={i} className="tractage-item">
                              {t.champ1 || "Tractage"} : {t.champ2} → {t.champ3}
                            </div>
                          ))}
                        </div>
                      )}

                      {data.melItems?.length > 0 && (
                        <div className="section">
                          <h4>
                            <Wrench size={18} /> MEL Items
                          </h4>
                          <ul className="mel-list">
                            {data.melItems.map((item, i) => (
                              <li key={i}>{item.description}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {data.taches?.length > 0 && (
                        <div className="section">
                          <h4>Tâches réalisées</h4>
                          <ul className="task-list">
                            {data.taches.map((t, i) => (
                              <li
                                key={i}
                                className={t.estTerminee ? "done" : ""}
                              >
                                {t.estTerminee ? (
                                  <CheckCircle2 size={18} />
                                ) : (
                                  <Circle size={18} />
                                )}
                                {t.libelle}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination-modern">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Numéros de pages (jusqu'à 7 visibles, sinon ... ) */}
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`page-number ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="dots">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
