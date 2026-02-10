// components/login/Login.jsx

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import authService from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.svg';
import './Login.css';

function Login({ setIsLoggedIn }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      navigate('/');
    }
  }, [navigate, setIsLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user === '') {
      alert("Campo de usuario vacío");
      return;
    } else if (password === '') {
      alert("Campo de contraseña vacío");
      return;
    }
    const data = {
      us_user: user,
      us_pass: password
    };
    try {
      const response = await authService.login(data);
      localStorage.setItem('token', response.accessToken);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      alert(error);
    }
  };

  // 🔹 NUEVA FUNCIÓN: Acceso como invitado
  const handleGuestAccess = () => {
    navigate('/pantallas-publicas')
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <img
          alt="FreeShop Logo"
          src={Logo}
          className="login-logo"
        />
        <h2 className="login-title">
          Inicia Sesión en tu cuenta
        </h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="user">Usuario</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password">Contraseña</label>
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
          
          {/* 🔹 MODIFICADO: Botón de invitado */}
          <div className="guest-access">
            <span>¿Solo querés ver las pantallas?</span>
            <button
              type="button"
              className="guest-button"
              onClick={handleGuestAccess}
            >
              Acceder como invitado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired
};

export default Login;