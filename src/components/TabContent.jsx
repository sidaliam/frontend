import { useState, useEffect } from "react";
import {
  sessionService,
  melItemService,
  tacheService,
  tractageService,
} from "../services/api";
import "./TabContent.css";
import toast from "react-hot-toast";
import { Plane, SaveIcon } from "lucide-react";
import { Trash2 } from "lucide-react";

export default function TabContent({ session, avions, onSessionUpdated }) {
  const [heureArrivee, setHeureArrivee] = useState("");
  const [heureDepartPrevue, setHeureDepartPrevue] = useState("");
  const [heureDepartReelle, setHeureDepartReelle] = useState("");
  const [causeRetardLocal, setCauseRetardLocal] = useState("");
  const [melItemsLocal, setMelItemsLocal] = useState([]);
  const [tachesLocal, setTachesLocal] = useState([]);
  const [tractagesLocal, setTractagesLocal] = useState([]);

  // === CHARGEMENT INITIAL ===
  useEffect(() => {
    if (session) {
      setHeureArrivee(dateTimeToTime(session.heureArrivee));
      setHeureDepartPrevue(dateTimeToTime(session.heureDepartPrevue));
      setHeureDepartReelle(dateTimeToTime(session.heureDepartReelle));
      setCauseRetardLocal(session.causeRetard || "");
      loadAllData();
    }
  }, [session?.idSession]);

  const loadAllData = async () => {
    try {
      const [melRes, tachesRes, tractagesRes] = await Promise.all([
        melItemService.getMELItemsBySession(session.idSession),
        tacheService.getTachesBySession(session.idSession),
        tractageService.getTractagesBySession(session.idSession),
      ]);

      setMelItemsLocal(
        (melRes.data || []).map((m) => ({
          idItem: m.idItem,
          description: m.description || "",
          isPersisted: true,
        }))
      );

      setTachesLocal(
        (tachesRes.data || []).map((t) => ({
          idTache: t.idTache,
          libelle: t.libelle || "",
          estTerminee: t.estTerminee || false,
          isPersisted: true,
        }))
      );

      // On garde seulement les 3 premiers tractages (ou moins)
      const tractages = (tractagesRes.data || []).slice(0, 3);
      setTractagesLocal(
        tractages.map((t) => ({
          idTractage: t.idTractage,
          champ1: t.champ1 || "",
          champ2: t.champ2 || "",
          champ3: t.champ3 || "",
          isPersisted: true,
        }))
      );
      // Si moins de 3, on complète avec des lignes vides
      while (tractages.length < 3) {
        tractages.push({
          idTractage: `temp-${Date.now()}-${tractages.length}`,
          champ1: "",
          champ2: "",
          champ3: "",
          isPersisted: false,
        });
      }
      setTractagesLocal(tractages);
    } catch (err) {
      console.error("Erreur chargement données", err);
      toast.error("Erreur chargement des données");
    }
  };

  // === CONVERSIONS HEURES ===
  const timeToDateTime = (time) =>
    !time ? null : `${new Date().toISOString().split("T")[0]}T${time}:00`;
  const dateTimeToTime = (dt) =>
    dt ? new Date(dt).toTimeString().substring(0, 5) : "";

  // === MISE À JOUR SESSION ===
  const updateSession = async (data) => {
    try {
      await sessionService.updateSession(session.idSession, data);
      onSessionUpdated();
    } catch (err) {
      toast.error("Erreur mise à jour session");
    }
  };

  const saveHeures = () => {
    updateSession({
      heureArrivee: timeToDateTime(heureArrivee),
      heureDepartPrevue: timeToDateTime(heureDepartPrevue),
      heureDepartReelle: timeToDateTime(heureDepartReelle),
      CauseRetard: causeRetardLocal.trim() || null,
    });
  };

  // === AJOUTS ===
  const handleAddMelItem = () =>
    setMelItemsLocal((prev) => [
      ...prev,
      { idItem: Date.now(), description: "", isPersisted: false },
    ]);

  const handleAddTache = () =>
    setTachesLocal((prev) => [
      ...prev,
      {
        idTache: Date.now(),
        libelle: "",
        estTerminee: false,
        isPersisted: false,
      },
    ]);

  // === MODIFICATIONS LOCALES ===
  const updateMelItem = (i, value) =>
    setMelItemsLocal((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, description: value } : m))
    );

  const updateTache = (i, libelle) =>
    setTachesLocal((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, libelle } : t))
    );

  const toggleTacheLocal = (i) =>
    setTachesLocal((prev) =>
      prev.map((t, idx) =>
        idx === i ? { ...t, estTerminee: !t.estTerminee } : t
      )
    );

  const updateTractage = (i, field, value) =>
    setTractagesLocal((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t))
    );

  const deleteMelItemLocal = (i) =>
    setMelItemsLocal((prev) => prev.filter((_, idx) => idx !== i));
  const deleteTacheLocal = (i) =>
    setTachesLocal((prev) => prev.filter((_, idx) => idx !== i));

  // === ARCHIVAGE FINAL — VERSION ULTIME ===
  const handleSaveSession = async () => {
    try {
      document.activeElement?.blur();
      await new Promise((r) => setTimeout(r, 300));

      // 1. Heures + retard
      await updateSession({
        heureArrivee: timeToDateTime(heureArrivee),
        heureDepartPrevue: timeToDateTime(heureDepartPrevue),
        heureDepartReelle: timeToDateTime(heureDepartReelle),
        CauseRetard: causeRetardLocal.trim() || null,
      });

      // 2. Tâches
      for (const t of tachesLocal) {
        const libelle = t.libelle.trim();
        if (!libelle) continue;
        if (t.isPersisted) {
          await tacheService.updateTache(t.idTache, {
            Libelle: libelle,
            EstTerminee: t.estTerminee,
          });
        } else {
          await tacheService.createTache({
            IdSession: session.idSession,
            Libelle: libelle,
            EstTerminee: t.estTerminee,
          });
        }
      }

      // 3. MEL Items
      for (const m of melItemsLocal) {
        const desc = (m.description || "").trim();

        if (desc === "") {
          if (m.isPersisted) {
            await melItemService.deleteMELItem(m.idItem);
          }
          continue;
        }

        if (m.isPersisted) {
          // ✅ Toujours mettre à jour si c'est persisté
          await melItemService.updateMELItem(m.idItem, { description: desc });
        } else {
          await melItemService.createMELItem({
            idSession: session.idSession,
            description: desc,
          });
        }
      }

      // 4. Tractages (max 3)
      for (const t of tractagesLocal.slice(0, 3)) {
        const c1 = t.champ1?.trim() || null;
        const c2 = t.champ2?.trim() || null;
        const c3 = t.champ3?.trim() || null;

        if (t.isPersisted) {
          await tractageService.updateTractage(t.idTractage, {
            champ1: c1,
            champ2: c2,
            champ3: c3,
          });
        } else if (c1 || c2 || c3) {
          await tractageService.createTractage({
            idSession: session.idSession,
            champ1: c1,
            champ2: c2,
            champ3: c3,
          });
        }
      }

      // 5. Archivage final
      await sessionService.enregistrerSession(session.idSession);
      toast.success("SESSION ARCHIVÉE AVEC SUCCÈS !", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#10b981",
          color: "white",
          fontWeight: "bold",
          borderRadius: "12px",
          padding: "12px 24px",
        },
      });
      onSessionUpdated();
    } catch (err) {
      console.error("Échec archivage:", err.response?.data || err);
      toast.error("Échec de l'archivage");
    }

    console.log("taches  : ", tachesLocal);
    console.log("melitems : ", melItemsLocal);
  };

  if (!session)
    return <div className="tab-content empty">Sélectionnez une session</div>;

  return (
    <div className="tab-content-responsive">
      <div className="card-responsive">
        <div className="card-header">
          <h2>
            <Plane size={28} /> {session.matricule || "Nouvelle session"}
          </h2>
        </div>

        {/* AVION */}
        <div className="form-group">
          <label className="section-title">Avions</label>
          <select
            value={session.idAvion || ""}
            onChange={(e) =>
              updateSession({ idAvion: parseInt(e.target.value) })
            }
          >
            {avions.map((a) => (
              <option key={a.idAvion} value={a.idAvion}>
                {a.matricule}
              </option>
            ))}
          </select>
        </div>

        {/* HEURES - 2 PAR LIGNE SUR MOBILE */}

        {/* HORAIRES - UN PAR LIGNE, PROPRE ET CLAIR */}
        <div className="form-group">
          <label className="section-title">Horaires</label>

          <div className="time-field">
            <label>Heure d'arrivée</label>
            <input
              type="time"
              value={heureArrivee}
              onChange={(e) => setHeureArrivee(e.target.value)}
              onBlur={saveHeures}
            />
          </div>
          <br />

          <div className="time-field">
            <label>Départ prévu</label>
            <input
              type="time"
              value={heureDepartPrevue}
              onChange={(e) => setHeureDepartPrevue(e.target.value)}
              onBlur={saveHeures}
            />
          </div>
          <br />

          <div className="time-field">
            <label>Départ réel</label>
            <input
              type="time"
              value={heureDepartReelle}
              onChange={(e) => setHeureDepartReelle(e.target.value)}
              onBlur={saveHeures}
            />
          </div>
          <br />

          <div className="time-field">
            <label>Cause du retard</label>
            <input
              type="text"
              value={causeRetardLocal}
              onChange={(e) => setCauseRetardLocal(e.target.value)}
              onBlur={saveHeures}
              placeholder="Ex: météo, MEL, équipage..."
            />
          </div>
        </div>

        {/* TRACTAGES - 1 PAR LIGNE SUR MOBILE */}
        <div className="form-group">
          <label className="section-title">Tractages</label>
          {tractagesLocal.slice(0, 3).map((t, i) => (
            <div key={t.idTractage || i} className="tractage-row">


              <input
                placeholder="Description"
                value={t.champ1 || ""}
                onChange={(e) => updateTractage(i, "champ1", e.target.value)}
              />
              <input
               placeholder="Début"
               value={t.champ2 || ""}
               onChange={(e) => updateTractage(i, "champ2", e.target.value)}
              />

             <input
             placeholder="Fin"
             value={t.champ3 || ""}
             onChange={(e) => updateTractage(i, "champ3", e.target.value)}
             />
            </div>
          ))}
        </div>

        {/* MEL ITEMS */}
        <div className="form-group">
          <label className="section-title">MEL Items</label>
          {melItemsLocal.map((item, i) => (
            <div key={item.idItem} className="list-item">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateMelItem(i, e.target.value)}
                placeholder="Description MEL"
              />
              <button
                className="delete-btn"
                onClick={() => deleteMelItemLocal(i)}
                title="Supprimer"
                aria-label="Supprimer MEL"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button className="btn-add-full" onClick={handleAddMelItem}>
            + Ajouter MEL Item
          </button>
        </div>

        {/* TÂCHES */}
        <div className="form-group">
          <label className="section-title">Tâches</label>
          {tachesLocal.map((t, i) => (
            <div key={t.idTache} className="list-item task-item">
              <input
                type="checkbox"
                checked={t.estTerminee}
                onChange={() => toggleTacheLocal(i)}
              />
              <input
                type="text"
                value={t.libelle}
                onChange={(e) => updateTache(i, e.target.value)}
                placeholder="Nouvelle tâche"
                className={t.estTerminee ? "completed" : ""}
              />
              <button
                className="delete-btn"
                onClick={() => deleteTacheLocal(i)}
                title="Supprimer"
                aria-label="Supprimer tâche"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button className="btn-add-full" onClick={handleAddTache}>
            + Ajouter une tâche
          </button>
        </div>

        <div className="save-section">
          <button className="btn-save-large" onClick={handleSaveSession}>
            <SaveIcon size={24} /> Archiver la session
          </button>
        </div>
      </div>
    </div>
  );
}
