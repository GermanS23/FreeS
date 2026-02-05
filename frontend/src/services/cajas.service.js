import axios from 'axios'
import authHeader from './auth-header'

const API_URL = import.meta.env.VITE_REDIRECT_URI

class CajasService {

  // Obtener caja abierta por sucursal
  getCajaAbierta(suc_cod) {
    return axios.get(`${API_URL}/cajas/abierta/${suc_cod}`, {
      headers: authHeader()
    })
  }

  // Abrir caja
  abrirCaja(data) {
    return axios.post(`${API_URL}/cajas/abrir`, data, {
      headers: authHeader()
    })
  }

  // Obtener resumen de caja abierta
  getResumenCaja(caja_id) {
    return axios.get(`${API_URL}/cajas/${caja_id}/resumen`, {
      headers: authHeader()
    })
  }

  // Cerrar caja
  cerrarCaja(caja_id, data) {
    return axios.post(`${API_URL}/cajas/cerrar/${caja_id}`, data, {
      headers: authHeader()
    })
  }

  // Historial de cajas
  getCajasPorSucursal(suc_cod, page = 0, size = 20) {
    return axios.get(`${API_URL}/cajas/sucursal/${suc_cod}`, {
      params: { page, size },
      headers: authHeader()
    })
  }

  // Obtener caja por ID
  getCajaById(caja_id) {
    return axios.get(`${API_URL}/cajas/${caja_id}`, {
      headers: authHeader()
    })
  }

  // Eliminar caja
  deleteCaja(caja_id) {
    return axios.delete(`${API_URL}/cajas/${caja_id}`, {
      headers: authHeader()
    })
  }
}

export default new CajasService()