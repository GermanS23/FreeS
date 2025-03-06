import axios from 'axios';
import authHeader from '../services/auth-header';

class PlantillasService {
  getPlantillas() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/plantillas`, { headers: authHeader() });
  }

  getPlantillaById(plan_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/plantillas/${plan_cod}`, { headers: authHeader() });
  }

  createPlantilla(data) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/plantillas`, data, { headers: authHeader() });
  }

  updatePlantilla(plan_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/plantillas/${plan_cod}`, data, { headers: authHeader() });
  }

  deletePlantilla(plan_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/plantillas/${plan_cod}`, { headers: authHeader() });
  }

  listPlantillas(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/plantillas/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }
}

export default new PlantillasService();