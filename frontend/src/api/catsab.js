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
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/catsab`, data, { headers: authHeader() });
  }

  updateCategoriaSab(catsab_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/catsab/${catsab_cod}`, data, { headers: authHeader() });
  }

  deleteCategoriaSab(catsab_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/catsab/${catsab_cod}`, { headers: authHeader() });
  }
// --- NUEVA FUNCIÓN SOFT DELETE ---
 softDeleteCategoriaSab(catsab_cod) {
  return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/catsab/soft-delete/${catsab_cod}`, {}, { headers: authHeader() });
}
  listSabores(page = 0, size = 1000, title = "", cats = null) {
    const params = { page, size, title }
    if (cats) {
      // cats puede ser array o valores individuales -> convertir a string "1,2"
      params.cats = Array.isArray(cats) ? cats.join(",") : String(cats)
    }
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/sabores`, { params, headers: authHeader() })
  }
  List(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/catsabs/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }
}

export default new CategoriaSabService();