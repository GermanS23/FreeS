import { useState } from 'react';
import PropTypes from 'prop-types';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    setIsLoggedIn(true);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src="/path-to-your-logo.svg" alt="Logo" className="logo" />
        <h1>Sign in to your account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        <p className="signup-link">
          Not a member? <a href="#">Start a 14 day free trial</a>
        </p>
      </div>
    </div>
  );
  
}
Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired
};

export default Login;