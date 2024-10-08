import axios from 'axios';
import authHeader from './auth-header';

export class UserService {

  getListUser(page, size, title) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/user/list?page=${page}&size=${size}&title=${title}`, { headers: authHeader() });
  }

  getCurrentUser() {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/auth/getLogger`, { headers: authHeader() });
  }
  createUser(form) {
    return axios.post(`${import.meta.env.VITE_REDIRECT_URI}/user/create`, form, { headers: authHeader() });
  }
  updateUser(id, form) {
    return axios.put(`${import.meta.env.VITE_REDIRECT_URI}/user/update/${id}`, form, { headers: authHeader() });
  }
  removeUser(id) {
    return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/user/remove/${id}`, { headers: authHeader() });
  }
  //   getAdminBoard() {
  //     return axios.get(API_URL + 'admin', { headers: authHeader() });
  //   }
}
export default new UserService();