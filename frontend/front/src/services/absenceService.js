import axios from 'axios';

const BASE = process.env.REACT_APP_ABSENCE_API_URL || 'http://localhost:3003';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const absenceService = {
  async postAttendance(sessionId, attendanceArray) {
    const url = `${BASE}/absences/session/${sessionId}/attendance`;
    const res = await axios.post(url, attendanceArray, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
    return res.data;
  },

  async postBatch(batch) {
    const url = `${BASE}/absences/batch`;
    const res = await axios.post(url, batch, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
    return res.data;
  },

  async getAbsencesByStudent(etudiantId) {
    const url = `${BASE}/absences/etudiant/${etudiantId}`;
    const res = await axios.get(url, { headers: authHeaders() });
    return res.data;
  }
,
  async getStatistics() {
    const url = `${BASE}/absences/statistiques`;
    const res = await axios.get(url, { headers: authHeaders() });
    return res.data;
  }
};

export default absenceService;
