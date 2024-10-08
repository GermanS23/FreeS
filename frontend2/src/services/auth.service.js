import axios from 'axios'
import authHeader from './auth-header'

class AuthService {
  async login(data) {
    console.log(data)
    const response = await axios
      .post(`${import.meta.env.VITE_REDIRECT_URI}/login`,data)
    if (response.data.accessToken) {
      localStorage.setItem('token', JSON.stringify(response.data.accessToken))
    }
    return response.data
  }

  logout() {
    localStorage.removeItem('token')
  }

  getCurrentUser() {
    const response = axios.get(`${import.meta.env.VITE_REDIRECT_URI}/auth/getLogger`, {
      headers: authHeader(),
    })
    return response
  }

  getRoles() {
    const response = axios.get(`${import.meta.env.VITE_REDIRECT_URI}/auth/roles`)
    return response
  }
}
export default new AuthService()
