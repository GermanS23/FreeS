import axios from 'axios';
import authHeader from '../services/auth-header';


class CatProdService {
  getCatProd() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/catprod`, { headers: authHeader() });
  }

  getCatProdById(catprod_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/catprod/${catprod_cod}`, { headers: authHeader() });
  }

  createCatProd(data) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/catprod`, data, { headers: authHeader() });
  }

  updateCatProd(catprod_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/catprod/${catprod_cod}`, data, { headers: authHeader() });
  }

  deleteCatProd(catprod_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/catprod/${catprod_cod}`, { headers: authHeader() });
  }

  listCatProd(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/catprods/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }
}

export default new CatProdService();