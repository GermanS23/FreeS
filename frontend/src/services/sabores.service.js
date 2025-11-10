// src/services/sabores.service.js
import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL = import.meta.env.VITE_REDIRECT_URI

class SaboresService {
  // --- RUTAS DE ADMIN ---
  getSab() {
    return axios.get(`${API_URL}/sab`, { headers: authHeader() });
  }

  getSabById(sab_cod) {
    return axios.get(`${API_URL}/sab/${sab_cod}`, { headers: authHeader() });
  }

  createSab(data) {
    return axios.post(`${API_URL}/sab`, data, { headers: authHeader() });
  }

  updateSab(sab_cod, data) {
    return axios.put(`${API_URL}/sab/${sab_cod}`, data, { headers: authHeader() });
  }

  deleteSab(sab_cod) {
    return axios.delete(`${API_URL}/sab/${sab_cod}`, { headers: authHeader() });
  }

  // Esta es tu función de ADMIN original
  listSabores(page = 0, size = 1000, title = '', catsab = null) {
    const params = { page, size, title }
    if (catsab) {
      if (Array.isArray(catsab)) {
        params.catsab = catsab.join(',')
      } else {
        params.catsab = String(catsab)
      }
    }
    return axios.get(`${API_URL}/sabs/list`, { // Ruta de Admin
      params,
      headers: authHeader(),
    })
  }

  //
  // 🔹 NUEVA FUNCIÓN PÚBLICA
  // Esta es la que usará PantallaSabores.jsx (SaboresMenu)
  // Llama a la ruta pública y no envía authHeader()
  //
  listSaboresPublic(catsab = null) {
    const params = { page: 0, size: 1000 } // Trae todos los sabores
    if (catsab) {
      if (Array.isArray(catsab)) {
        params.catsab = catsab.join(',')
      } else {
        params.catsab = String(catsab)
      }
    }
    return axios.get(`${API_URL}/sabs/public/list`, { // Ruta pública
      params,
      // Sin headers: authHeader()
    })
  }
  //
  // ----------------------------------------
  //
}

export default new SaboresService();