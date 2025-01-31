import axios from 'axios';
import authHeader from '../services/auth-header';


class ProductosService {
  getProd() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/prod`, { headers: authHeader() });
  }

  getProdById(prod_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/prod/${prod_cod}`, { headers: authHeader() });
  }

  createProd(data) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/prod/create`, data, { headers: authHeader() });
  }

  updateProd(prod_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/prod/${prod_cod}`, data, { headers: authHeader() });
  }

  deleteProd(prod_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/prod/${prod_cod}`, { headers: authHeader() });
  }

  listProductos(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/prods/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }
}

export default new ProductosService();