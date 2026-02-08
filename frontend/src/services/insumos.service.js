import axios from 'axios'
import authHeader from './auth-header'

const API_URL = import.meta.env.VITE_REDIRECT_URI

class InsumosService {

  // Listar insumos de una sucursal
  getInsumos(suc_cod, incluirInactivos = false) {
    return axios.get(`${API_URL}/insumos/sucursal/${suc_cod}`, {
      params: { incluirInactivos },
      headers: authHeader()
    })
  }

  // Obtener insumo por ID
  getInsumoById(insumo_id) {
    return axios.get(`${API_URL}/insumos/${insumo_id}`, {
      headers: authHeader()
    })
  }
getHistorialGlobal(suc_cod, limit = 100) {
    return axios.get(`${API_URL}/insumos/historial/global`, {
      params: { suc_cod, limit },
      headers: authHeader()
    })
  }
  // Crear insumo
  createInsumo(data) {
    return axios.post(`${API_URL}/insumos`, data, {
      headers: authHeader()
    })
  }

  // Actualizar insumo
  updateInsumo(insumo_id, data) {
    return axios.put(`${API_URL}/insumos/${insumo_id}`, data, {
      headers: authHeader()
    })
  }

  // Ajustar stock manualmente
  ajustarStock(insumo_id, cantidad_nueva, observaciones = null) {
    return axios.post(
      `${API_URL}/insumos/${insumo_id}/ajustar-stock`,
      { cantidad_nueva, observaciones },
      { headers: authHeader() }
    )
  }

  // Obtener insumos críticos
  getInsumosCriticos(suc_cod) {
    return axios.get(`${API_URL}/insumos/criticos/${suc_cod}`, {
      headers: authHeader()
    })
  }

  // Obtener historial de movimientos
  getHistorialStock(insumo_id, limit = 50) {
    return axios.get(`${API_URL}/insumos/${insumo_id}/historial`, {
      params: { limit },
      headers: authHeader()
    })
  }

  // Eliminar insumo
  deleteInsumo(insumo_id) {
    return axios.delete(`${API_URL}/insumos/${insumo_id}`, {
      headers: authHeader()
    })
  }
}

export default new InsumosService()