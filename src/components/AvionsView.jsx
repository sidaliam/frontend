import { useState, useEffect } from "react";
import { avionService } from "../services/api";
import { Plus, Plane, Edit2, Trash2, X } from "lucide-react";
import "./AvionsView.css";
import toast from "react-hot-toast";

export default function AvionsView() {
  const [avions, setAvions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAvionId, setCurrentAvionId] = useState(null);
  const [matriculeInput, setMatriculeInput] = useState("");

  useEffect(() => {
    loadAvions();
  }, []);

  const loadAvions = async () => {
    try {
      setLoading(true);
      const response = await avionService.getAllAvions();
      setAvions(response.data || []);
    } catch (err) {
      console.error("Erreur chargement avions:", err);
      setAvions([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (avion = null) => {
    if (avion) {
      setIsEditMode(true);
      setCurrentAvionId(avion.idAvion);
      setMatriculeInput(avion.matricule);
    } else {
      setIsEditMode(false);
      setCurrentAvionId(null);
      setMatriculeInput("");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMatriculeInput("");
    setIsEditMode(false);
    setCurrentAvionId(null);
  };

  const handleSave = async () => {
    const matricule = matriculeInput.trim();
    if (!matricule) return;

    try {
      if (isEditMode && currentAvionId) {
        await avionService.updateAvion(currentAvionId, { matricule });
        toast.success("Avion modifié !");
      } else {
        await avionService.createAvion({ matricule });
        toast.success("Avion ajouté !");
      }
      closeModal();
      loadAvions();
    } catch (err) {
      toast.error(isEditMode ? "Échec modification" : "Échec ajout");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Supprimer cet avion ? Attention: toutes les sessions associées seront affectées !"
      )
    )
      return;

    try {
      await avionService.deleteAvion(id);
      toast.success("Avion supprimé");
      loadAvions();
    } catch (err) {
      toast.error("Impossible de supprimer (sessions actives ?)");
    }
  };

  if (loading) {
    return (
      <div className="avions-view loading">
        <div className="spinner"></div>
        <p>Chargement des avions...</p>
      </div>
    );
  }

  return (
    <div className="avions-view">
      <div className="header">
        <h2>
          <Plane className="icon" />
          Gestion des avions
        </h2>
        {avions.length != 0 && (
          <button className="btn-add" onClick={() => openModal()}>
            <Plus size={25} />
            <h3>Nouvel avion</h3>
          </button>
        )}
      </div>

      {avions.length === 0 ? (
        <div className="empty-state">
          <Plane size={64} className="empty-icon" />
          <h3>Aucun avion enregistré</h3>
          <p>Commencez par ajouter votre premier avion</p>
          <button className="btn-primary-large" onClick={() => openModal()}>
            <Plus size={20} />
            Ajouter un avion
          </button>
        </div>
      ) : (
        <div className="avions-grid">
          {avions.map((avion) => (
            <div key={avion.idAvion} className="avion-card">
              <div className="avion-info">
                <Plane size={20} className="plane-icon" />
                <strong>{avion.matricule}</strong>
              </div>
              <div className="avion-actions">
                <button
                  className="btn-icon"
                  onClick={() => openModal(avion)}
                  title="Modifier"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(avion.idAvion)}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CENTRÉ, RESPONSIVE, MAGNIFIQUE */}
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? "Modifier l'avion" : "Nouvel avion"}</h3>
            </div>

            <div className="modal-body">
              <label>Matricule de l'avion</label>
              <input
                type="text"
                placeholder="Ex: F-GABC, TS-ABC..."
                value={matriculeInput}
                onChange={(e) => setMatriculeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
                className="input-full"
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={closeModal}
                style={{ background: "white", color: "#1e40af" }}
              >
                Annuler
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={!matriculeInput.trim()}
              >
                {isEditMode ? "Sauvegarder" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
