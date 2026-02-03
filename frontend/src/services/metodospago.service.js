import axios from 'axios'
import authHeader from './auth-header'

const API_URL = import.meta.env.VITE_REDIRECT_URI

class MetodosPagoService {

  // Obtener métodos activos (para POS)
  getActivos() {
    return axios.get(`${API_URL}/metodospago/activos`, {
      headers: authHeader()
    })
  }

  // Obtener todos (ADMIN)
  getAll() {
    return axios.get(`${API_URL}/metodospago`, {
      headers: authHeader()
    })
  }

  // Obtener por ID
  getById(mp_cod) {
    return axios.get(`${API_URL}/metodospago/${mp_cod}`, {
      headers: authHeader()
    })
  }

  // Crear
  create(data) {
    return axios.post(`${API_URL}/metodospago`, data, {
      headers: authHeader()
    })
  }

  // Actualizar
  update(mp_cod, data) {
    return axios.put(`${API_URL}/metodospago/${mp_cod}`, data, {
      headers: authHeader()
    })
  }

  // Eliminar (desactivar)
  delete(mp_cod) {
    return axios.delete(`${API_URL}/metodospago/${mp_cod}`, {
      headers: authHeader()
    })
  }
}

export default new MetodosPagoService()