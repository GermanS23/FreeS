import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import CategoriesCRUD from './components/CategoriaSab/CategoriaSab';

function AuthenticatedLayout({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Asumimos que está logueado para este ejemplo

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <Header />
        {children}
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isLoggedIn 
              ? <Navigate to="/" replace /> 
              : <Login setIsLoggedIn={setIsLoggedIn} />
          } 
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/categories"
          element={
            isLoggedIn ? (
              <AuthenticatedLayout>
                <CategoriesCRUD />
              </AuthenticatedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;