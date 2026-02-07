import axios from 'axios'
import authHeader from './auth-header'

const API_URL = import.meta.env.VITE_REDIRECT_URI

class RecetasService {

  // Obtener receta de un producto
  getRecetaProducto(prod_cod) {
    return axios.get(`${API_URL}/recetas/producto/${prod_cod}`, {
      headers: authHeader()
    })
  }

  // Asignar/Actualizar receta completa
  asignarReceta(prod_cod, insumos) {
    return axios.post(
      `${API_URL}/recetas/producto/${prod_cod}`,
      { insumos },
      { headers: authHeader() }
    )
  }

  // Agregar un insumo a la receta
  agregarInsumo(prod_cod, insumo_id, cantidad_requerida) {
    return axios.post(
      `${API_URL}/recetas/agregar`,
      { prod_cod, insumo_id, cantidad_requerida },
      { headers: authHeader() }
    )
  }

  // Modificar cantidad de insumo en receta
  modificarCantidad(producto_insumo_id, cantidad_requerida) {
    return axios.put(
      `${API_URL}/recetas/${producto_insumo_id}`,
      { cantidad_requerida },
      { headers: authHeader() }
    )
  }

  // Eliminar insumo de receta
  eliminarInsumo(producto_insumo_id) {
    return axios.delete(`${API_URL}/recetas/${producto_insumo_id}`, {
      headers: authHeader()
    })
  }

  // Listar productos con recetas
  getProductosConRecetas(suc_cod) {
    return axios.get(`${API_URL}/recetas/productos/sucursal/${suc_cod}`, {
      headers: authHeader()
    })
  }

  // Verificar disponibilidad de stock
  verificarDisponibilidad(prod_cod, cantidad = 1) {
    return axios.post(
      `${API_URL}/recetas/verificar-disponibilidad`,
      { prod_cod, cantidad },
      { headers: authHeader() }
    )
  }
}

export default new RecetasService()