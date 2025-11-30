import axios from "axios";

const API_BASE_URL = "https://192.168.100.124:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const avionService = {
  getAllAvions: () => api.get("/avions"),
  getAvion: (id) => api.get(`/avions/${id}`),
  createAvion: (data) => api.post("/avions", data),
  deleteAvion: (id) => api.delete(`/avions/${id}`),
  updateAvion: (id, data) => api.put(`/avions/${id}`, data)
};

export const sessionService = {
  getAllSessions: () => api.get("/sessions"),
  getSession: (id) => api.get(`/sessions/${id}`),
  getSessionsByAvion: (idAvion) => api.get(`/sessions/avion/${idAvion}`),
  createSession: (data) => api.post("/sessions", data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  enregistrerSession: (id) => api.post(`/sessions/${id}/enregistrer`),
};

export const tractageService = {
  getTractagesBySession: (idSession) =>
    api.get(`/tractages/session/${idSession}`),

  createTractage: (data) =>
    api.post("/tractages", {
      IdSession: data.idSession,
      Champ1: data.champ1 || null,
      Champ2: data.champ2 || null,
      Champ3: data.champ3 || null,
    }),

  updateTractage: (id, data) =>
    api.put(`/tractages/${id}`, {
      Champ1: data.champ1,
      Champ2: data.champ2,
      Champ3: data.champ3,
    }),

  deleteTractage: (id) => api.delete(`/tractages/${id}`),
};

export const tacheService = {
  getTachesBySession: (idSession) => api.get(`/taches/session/${idSession}`),

  createTache: (data) =>
    api.post("/taches", {
      idSession: data.idSession || data.IdSession,
      libelle: data.libelle || data.Libelle,
      estTerminee: data.estTerminee || data.EstTerminee,
    }),

  updateTache: (id, data) =>
    api.put(`/taches/${id}`, {
      libelle: data.libelle || data.Libelle, // ✅ Accepte les deux
      estTerminee: data.estTerminee || data.EstTerminee, // ✅ Ajouter estTerminee
    }),

  toggleTache: (id) => api.patch(`/taches/${id}/toggle`),
  deleteTache: (id) => api.delete(`/taches/${id}`),
};

export const melItemService = {
  getMELItemsBySession: (idSession) =>
    api.get(`/melitems/session/${idSession}`),

  updateMELItem: (id, data) =>
    api.put(`/melitems/${id}`, {
      Description: data.description || data.Description, // ✅ Accepte les deux
    }),

  createMELItem: ({ idSession, description }) =>
    api.post("/melitems", {
      IdSession: idSession,
      Description: (description || "").trim() || "Item MEL",
    }),

  deleteMELItem: (id) => api.delete(`/melitems/${id}`),
};

export const historiqueService = {
  getAllHistoriques: () => api.get("/historiques"),
  getHistorique: (id) => api.get(`/historiques/${id}`),
  getHistoriquesBySession: (idSession) =>
    api.get(`/historiques/session/${idSession}`),
  getHistoriquesByDateRange: (startDate, endDate) =>
    api.get("/historiques/date-range", { params: { startDate, endDate } }),
  deleteHistorique: (id) => api.delete(`/historiques/${id}`),
};

export default api;
