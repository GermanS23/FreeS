import axios from 'axios'
import authHeader from './auth-header'

class pacienteService {
  getList(page, size, title) {
    return axios.get(
      `${import.meta.env.VITE_REDIRECT_URI}/pacientes/list?page=${page}&size=${size}&title=${title}`,
      { headers: authHeader() },
    )
  }
  create(form) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/pacientes/create`, form, {
      headers: authHeader(),
    })
  }
  update(id, form) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/pacientes/update/${id}`, form, {
      headers: authHeader(),
    })
  }
  exportPDF(page, size, title) {
    return axios.get(
      `${import.meta.env.VITE_REDIRECT_URI}/pacientes/exportPDF?page=${page}&size=${size}&title=${title}`,
      { headers: authHeader() },
    )
  }
  search(title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/pacientes/search?title=${title}`, {
      headers: authHeader(),
    })
  }
  find(id) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/pacientes/find/${id}`, {
      headers: authHeader(),
    })
  }
}
export default new pacienteService()
