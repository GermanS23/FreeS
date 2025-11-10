// src/services/pantalla.service.js
import axios from "axios"
import authHeader from "./auth-header"

const API_URL = import.meta.env.VITE_REDIRECT_URI

class PantallasService {
  // Obtener todas las pantallas (ADMIN)
  getPantallas() {
    return axios.get(`${API_URL}/pantallas`, {
      headers: authHeader(),
    })
  }

  // Obtener una pantalla por ID (ADMIN)
  getPantallaById(id) {
    return axios.get(`${API_URL}/pantallas/${id}`, {
      headers: authHeader(),
    })
  }

  //
  // 🔹 NUEVA FUNCIÓN PÚBLICA
  // Esta es la que usará PantallaViewer.jsx
  // No envía authHeader() y llama a la ruta pública
  //
  getPantallaPublicaById(id) {
    return axios.get(`${API_URL}/pantallas/public/${id}`)
  }
  //
  // ----------------------------------------
  //

  // Crear una nueva pantalla (ADMIN)
  createPantalla(data) {
    return axios.post(`${API_URL}/pantallas`, data, {
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
  }

  // Actualizar una pantalla existente (ADMIN)
  updatePantalla(id, data) {
    return axios.put(`${API_URL}/pantallas/${id}`, data, {
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
  }

  // Eliminar una pantalla (ADMIN)
  deletePantalla(id) {
    return axios.delete(`${API_URL}/pantallas/${id}`, {
      headers: authHeader(),
    })
  }

  // Obtener solo las pantallas activas (ADMIN)
  getPantallasActivas() {
    return axios.get(`${API_URL}/pantallas/activas`, {
      headers: authHeader(),
    })
  }
}

export default new PantallasService()