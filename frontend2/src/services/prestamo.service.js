import axios from 'axios'
import authHeader from './auth-header'

class prestamoService {
  getList(data) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/prestamo/list`, {
      headers: authHeader(),
      params: data,
    })
  }
  find(id) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/prestamo/` + id, {
      headers: authHeader(),
    })
  }
  create(form) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/prestamo/create`, form, {
      headers: authHeader(),
    })
  }
  update(id, form) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/prestamo/update/${id}`, form, {
      headers: authHeader(),
    })
  }
  delete(id) {
    return axios.delete(`${import.meta.env.VITE_REDIRECT_URI}/prestamo/delete/${id}`, {
      headers: authHeader(),
    } )
  }
}
export default new prestamoService()
