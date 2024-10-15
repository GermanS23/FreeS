import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import    CategoriaSab from './components/CategoriaSab/CategoriaSab.jsx';
import Login from './components/Login.jsx';

import './App.css';

function App() {
  const isLoggedIn = localStorage.getItem('token') !== null; // Verificamos si existe un token

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Dashboard /> : <Login />}
        />
        
      </Routes>
    </Router>
  );
}

export default App;