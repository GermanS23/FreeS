import axios from 'axios';
import authHeader from '../services/auth-header';


class SucursalesService {
  getSucursal() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/sucursal`, { headers: authHeader() });
  }
  getSucursalAll() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/sucursales`, { headers: authHeader() });
  }

  getSucursalById(suc_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/sucursal/${suc_cod}`, { headers: authHeader() });
  }

  createSucursal(data) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/sucursal`, data, { headers: authHeader() });
  }

  updateSucursal(suc_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/sucursal/${suc_cod}`, data, { headers: authHeader() });
  }

  deleteSucursal(suc_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/sucursal/${suc_cod}`, { headers: authHeader() });
  }

  listSucursales(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/sucursales/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }
}

export default new SucursalesService();