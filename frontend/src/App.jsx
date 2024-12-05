import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes.jsx';

const AppWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const routing = useRoutes(routes(isLoggedIn, setIsLoggedIn));

  return (
    <>
      {routing}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

