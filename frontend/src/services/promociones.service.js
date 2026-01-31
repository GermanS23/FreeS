// services/promociones.service.js
import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL = import.meta.env.VITE_REDIRECT_URI;

class PromocionesService {
  
  // --- FUNCIÓN PÚBLICA ---
  listPromosPublic() {
    return axios.get(`${API_URL}/promos/public/list`);
  }

  // --- 🔹 FUNCIONES DE ADMIN (NUEVAS) 🔹 ---
  
  listPromosAdmin(page, size, title) {
    return axios.get(`${API_URL}/promociones/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }
  
  getPromoById(id) {
    return axios.get(`${API_URL}/promociones/${id}`, { headers: authHeader() });
  }

  createPromo(data) {
    return axios.post(`${API_URL}/promociones`, data, { headers: authHeader() });
  }

  updatePromo(id, data) {
    return axios.put(`${API_URL}/promociones/${id}`, data, { headers: authHeader() });
  }

  deletePromo(id) {
    return axios.delete(`${API_URL}/promociones/${id}`, { headers: authHeader() });
  }
}

export default new PromocionesService();