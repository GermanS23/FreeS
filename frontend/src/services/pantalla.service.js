import axios from 'axios';
import authHeader from '../services/auth-header';

class PantallasService {
  getPantallas() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/pantallas`, { headers: authHeader() });
  }

  getPantallaById(pan_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/pantallas/${pan_cod}`, { headers: authHeader() });
  }

  createPantalla(data) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/pantallas`, data, { headers: authHeader() });
  }

  updatePantalla(pan_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/pantallas/${pan_cod}`, data, { headers: authHeader() });
  }

  deletePantalla(pan_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/pantallas/${pan_cod}`, { headers: authHeader() });
  }

  listPantallas(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/pantallas/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }

  getPantallasActivas() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/pantallas/activas`, { headers: authHeader() });
  }
}

export default new PantallasService();