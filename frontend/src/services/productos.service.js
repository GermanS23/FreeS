import axios from 'axios';
import authHeader from '../services/auth-header';

const API_URL = import.meta.env.VITE_REDIRECT_URI;

class ProductosService {
  // --- RUTAS DE ADMIN (Protegidas) ---
  getProd() {
    return axios.get(`${API_URL}/prod`, { headers: authHeader() });
  }

  getProdById(prod_cod) {
    return axios.get(`${API_URL}/prod/${prod_cod}`, { headers: authHeader() });
  }

  createProd(data) {
    return axios.post(`${API_URL}/prod`, data, { headers: authHeader() });
  }

  updateProd(prod_cod, data) {
    return axios.put(`${API_URL}/prod/${prod_cod}`, data, { headers: authHeader() });
  }

  deleteProd(prod_cod) {
    return axios.delete(`${API_URL}/prod/${prod_cod}`, { headers: authHeader() });
  }

  listProductos(page, size, title) {
    return axios.get(`${API_URL}/prods/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }

  //
  // 🔹 --- FUNCIÓN PÚBLICA NUEVA --- 🔹
  //
  listProductosPublic(catprod = null) {
    const params = { page: 0, size: 1000 }; // Trae todos los productos
    if (catprod) {
      // catprod es el array de IDs de categoría, ej: [1, 2]
      if (Array.isArray(catprod)) {
        params.catprod = catprod.join(',');
      } else {
        params.catprod = String(catprod);
      }
    }
    // Llama a la ruta pública y NO envía token
    return axios.get(`${API_URL}/prods/public/list`, {
      params,
    });
  }
}

export default new ProductosService();