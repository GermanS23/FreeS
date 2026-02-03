import axios from "axios"
import authHeader from "./auth-header"

const API_URL = import.meta.env.VITE_REDIRECT_URI

export const posApi = {

  // =========================
  // POS – VENTA ABIERTA
  // =========================

  getVentaAbierta: async (sucCod) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/ventas/abierta/${sucCod}`,
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en getVentaAbierta:", error)
      throw error
    }
  },

  crearVenta: async (sucCod) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/ventas/nueva`,  // ✅ Cambiar aquí
      { suc_cod: sucCod },
      { headers: authHeader() }
    )
    return data
  } catch (error) {
    console.error("Error en crearVenta:", error)
    throw error
  }
},

  // =========================
  // ITEMS
  // =========================

  agregarProducto: async (ventaId, prod_cod, cantidad = 1) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/ventas/${ventaId}/items`,
        { prod_cod, cantidad },
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en agregarProducto:", error)
      throw error
    }
  },

  // 🔹 NUEVO: Eliminar item
  eliminarItem: async (ventaItemsId) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/ventas/items/${ventaItemsId}`,
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en eliminarItem:", error)
      throw error
    }
  },

  // 🔹 NUEVO: Modificar cantidad
  modificarCantidad: async (ventaItemsId, cantidad) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/ventas/items/${ventaItemsId}`,
        { cantidad },
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en modificarCantidad:", error)
      throw error
    }
  },

  // =========================
  // DESCUENTOS
  // =========================

  aplicarDescuento: async (ventaId, payload) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/descuentoventas/${ventaId}/descuento`,
        payload,
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en aplicarDescuento:", error)
      throw error
    }
  },

  quitarDescuento: async (ventaId) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/descuentoventas/${ventaId}/descuento`,
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en quitarDescuento:", error)
      throw error
    }
  },

  // =========================
  // CIERRE Y CANCELACIÓN
  // =========================

   // =========================
  // CIERRE (MODIFICADO)
  // =========================

  cerrarVenta: async (ventaId, pagos) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/ventas/cerrar/${ventaId}`,
        { pagos }, // 🔹 Ahora envía array de pagos
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en cerrarVenta:", error)
      throw error
    }
  },


  // 🔹 NUEVO: Cancelar venta
  cancelarVenta: async (ventaId) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/ventas/cancelar/${ventaId}`,
        {},
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en cancelarVenta:", error)
      throw error
    }
  },

  // =========================
  // HISTÓRICO
  // =========================

  getVentasPorSucursal: async (sucCod) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/ventas/sucursal/${sucCod}`,
        { headers: authHeader() }
      )
      return data
    } catch (error) {
      console.error("Error en getVentasPorSucursal:", error)
      throw error
    }
  },
}