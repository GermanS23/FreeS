import axios from 'axios';
import authHeader from '../services/auth-header';


class SaboresService {
  getSab() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/sab`, { headers: authHeader() });
  }

  getSabById(sab_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/sab/${sab_cod}`, { headers: authHeader() });
  }

  createSab(data) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/sab/create`, data, { headers: authHeader() });
  }

  updateSab(sab_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/sab/${sab_cod}`, data, { headers: authHeader() });
  }

  deleteSab(sab_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/sab/${sab_cod}`, { headers: authHeader() });
  }

  listSabores(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/sabs/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }
}

export default new SaboresService();