import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import CategoriaSab from './components/CategoriaSab/CategoriaSab.jsx';

import Login from './components/Login.jsx'

import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categoriasab" element={<CategoriaSab />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </div>
      </div>
      
    </Router>
  );
}