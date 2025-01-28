import axios from 'axios';
import authHeader from '../services/auth-header';


class CategoriaSabService {
  getCategoriasSab() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/catsab`, { headers: authHeader() });
  }

  getCategoriaSabById(catsab_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/catsab/${catsab_cod}`, { headers: authHeader() });
  }

  createCategoriaSab(data) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/catsab/create`, data, { headers: authHeader() });
  }

  updateCategoriaSab(catsab_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/catsab/:catsab_cod/${catsab_cod}`, data, { headers: authHeader() });
  }

  deleteCategoriaSab(catsab_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/catsab/${catsab_cod}`, { headers: authHeader() });
  }

  listCategoriasSab(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/catsabs/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }
}

export default new CategoriaSabService();