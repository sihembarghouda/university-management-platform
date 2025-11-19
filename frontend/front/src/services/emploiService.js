import axios from 'axios';

const BASE = process.env.REACT_APP_EMPLOI_API_URL || 'http://localhost:3010';

const emploiService = {
  async getTodayForEtudiant(etudiantId) {
    const url = `${BASE}/emplois-du-temps/today/etudiant/${etudiantId}`;
    const res = await axios.get(url);
    return res.data;
  },

  async getTodayForEnseignant(enseignantId) {
    const url = `${BASE}/emplois-du-temps/today/enseignant/${enseignantId}`;
    const res = await axios.get(url);
    return res.data;
  },

  async getSession(sessionId) {
    const url = `${BASE}/emplois-du-temps/session/${sessionId}`;
    const res = await axios.get(url);
    return res.data;
  }
,

  // Récupérer le planning complet d'une classe pour un semestre (1 par défaut)
  async getScheduleForClasse(classeId, semestre = 1) {
    const url = `${BASE}/emplois-du-temps/classe/${classeId}/schedule/${semestre}`;
    const res = await axios.get(url);
    return res.data;
  },

  // Récupérer le planning complet d'un enseignant pour un semestre (1 par défaut)
  async getScheduleForEnseignant(enseignantId, semestre = 1) {
    const url = `${BASE}/emplois-du-temps/enseignant/${enseignantId}/schedule/${semestre}`;
    const res = await axios.get(url);
    return res.data;
  }
};

export default emploiService;
