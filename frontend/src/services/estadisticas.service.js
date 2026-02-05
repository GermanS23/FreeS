import axios from 'axios'
import authHeader from './auth-header'

const API_URL = import.meta.env.VITE_REDIRECT_URI

class EstadisticasService {

  // Resumen del día
  getResumenHoy(suc_cod) {
    return axios.get(`${API_URL}/estadisticas/resumen-hoy/${suc_cod}`, {
      headers: authHeader()
    })
  }

  // Ventas por hora
  getVentasPorHora(suc_cod) {
    return axios.get(`${API_URL}/estadisticas/ventas-por-hora/${suc_cod}`, {
      headers: authHeader()
    })
  }

  // Productos más vendidos
  getProductosTop(suc_cod, limit = 10) {
    return axios.get(`${API_URL}/estadisticas/productos-top/${suc_cod}`, {
      params: { limit },
      headers: authHeader()
    })
  }

  // Métodos de pago
  getMetodosPago(suc_cod) {
    return axios.get(`${API_URL}/estadisticas/metodos-pago/${suc_cod}`, {
      headers: authHeader()
    })
  }

  // Ventas semanales
  getVentasSemanales(suc_cod) {
    return axios.get(`${API_URL}/estadisticas/ventas-semanales/${suc_cod}`, {
      headers: authHeader()
    })
  }

  // Estadísticas de cajeros
  getEstadisticasCajeros(suc_cod) {
    return axios.get(`${API_URL}/estadisticas/cajeros/${suc_cod}`, {
      headers: authHeader()
    })
  }

  // Comparativa mensual
  getComparativaMensual(suc_cod) {
    return axios.get(`${API_URL}/estadisticas/comparativa-mensual/${suc_cod}`, {
      headers: authHeader()
    })
  }
}

export default new EstadisticasService()