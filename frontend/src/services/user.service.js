import axios from 'axios';
import authHeader from '../services/auth-header';

export class UserService {

  getListUser(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/usuarios/list`, {
      params: { page, size, title },
      headers: authHeader(),
    });
  }

  getCurrentUser() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/auth/getLogger`, { headers: authHeader() });
  }
  createUser(data) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/usuarios`, data, { headers: authHeader() });
  }
  updateUser(us_cod, data) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/usuarios/${us_cod}`, data, { headers: authHeader() });
  }
  removeUser(us_cod) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/usuarios/${us_cod}`, { headers: authHeader() });
  }
  //   getAdminBoard() {
  //     return axios.get(API_URL + 'admin', { headers: authHeader() });
  //   }
  getRoles() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/rol`, { headers: authHeader() });
 }
}

export default new UserService();