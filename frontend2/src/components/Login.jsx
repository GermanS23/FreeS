import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';  
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/')
    }
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación 
    if (user === '') {
      alert("Campo de usuario vacio")
    } else if (password === '') {
      alert("Campo de password vacio")
    }
    const data={
      us_user:user,
      us_pass:password
  }
    await authService
      .login(data)
      .then((e) => {
        localStorage.setItem('token', e.accessToken)
        navigate('/')
      })
      .catch((error) => {
        alert(error) 
      })

    e.preventDefault()
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src="" alt="Logo" className="logo" />
        <h1>Inicia Sesion en tu cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user">Usuario</label>
            <input
              type="user"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          <button type="submit" className="sign-in-button">Sign in</button>
        </form>
       
      </div>
    </div>
  );
  
}
Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired
};

export default Login;