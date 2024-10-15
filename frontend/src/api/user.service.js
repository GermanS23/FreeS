import axios from 'axios'
import authHeader from './auth-header'

class UserService {
    createUser(){
        return axios.get(`${import.meta.env.VITE_REDIRECT_URI}/usuarios/create/${us_cod}`)
    }
}