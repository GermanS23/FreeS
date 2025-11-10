import axios from "axios"
import authHeader from "../services/auth-header"

class PlantillasService {
  getPlantillas() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/plantillas`, { headers: authHeader() })
  }

  getPlantillaById(plan_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/plantillas/${plan_cod}`, { headers: authHeader() })
  }

  createPlantilla(data, imagenFile) {
    const formData = new FormData()

    // Agregar todos los campos de texto
    formData.append("plan_nomb", data.plan_nomb)
    formData.append("plan_tipo", data.plan_tipo || "")

    // Agregar la configuración como JSON string
    if (data.plan_config) {
      formData.append("plan_config", JSON.stringify(data.plan_config))
    }

    // Agregar el archivo de imagen si existe
    if (imagenFile) {
      formData.append("imagen", imagenFile)
    }

    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/plantillas`, formData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    })
  }

  updatePlantilla(plan_cod, data, imagenFile) {
    const formData = new FormData()

    // Agregar todos los campos de texto
    formData.append("plan_nomb", data.plan_nomb)
    formData.append("plan_tipo", data.plan_tipo || "")

    // Agregar la configuración como JSON string
    if (data.plan_config) {
      formData.append("plan_config", JSON.stringify(data.plan_config))
    }

    // Agregar el archivo de imagen si existe (nueva imagen)
    if (imagenFile) {
      formData.append("imagen", imagenFile)
    }

    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/plantillas/${plan_cod}`, formData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    })
  }

  deletePlantilla(plan_cod) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/plantillas/${plan_cod}`, { headers: authHeader() })
  }

  listPlantillas(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/plantillas/list`, {
      params: { page, size, title },
      headers: authHeader(),
    })
  }
}

export default new PlantillasService()
