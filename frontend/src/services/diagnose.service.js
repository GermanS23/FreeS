import axios from 'axios'
import authHeader from './auth-header'

class diagnoseService {
  searchPaciente(title) {
    return axios.get(
      `${import.meta.env.VITE_REDIRECT_URI_HCR}/pacientes/list?dni=${title}&hc=${title}`,
      {},
    )
  }
  searchProfesional(title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI_HCR}/profesionales/list?q=${title}`, {})
  }
}
export default new diagnoseService()
