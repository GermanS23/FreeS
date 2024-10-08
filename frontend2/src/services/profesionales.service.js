import axios from 'axios'
import authHeader from './auth-header'

class profesionalService {
  getList(page, size, title) {
    return axios.get(
      `${import.meta.env.VITE_REDIRECT_URI}/profesionales/list?page=${page}&size=${size}&title=${title}`,
      { headers: authHeader() },
    )
  }
  create(form) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/profesionales/create`, form, {
      headers: authHeader(),
    })
  }
  update(id, form) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/profesionales/update/${id}`, form, {
      headers: authHeader(),
    })
  }
  exportPDF(page, size, title) {
    return axios.get(
      `${import.meta.env.VITE_REDIRECT_URI}/profesionales/exportPDF?page=${page}&size=${size}&title=${title}`,
      { headers: authHeader() },
    )
  }
  search(title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/profesionales/search?title=${title}`, {
      headers: authHeader(),
    })
  }
  find(id) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/profesionales/find/${id}`, {
      headers: authHeader(),
    })
  }
}
export default new profesionalService()
