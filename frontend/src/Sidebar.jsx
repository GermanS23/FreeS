import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, List, PlusCircle, Grid, User, LogOut, Menu } from 'lucide-react';
import Logo from '../assets/Logo.svg'

export default function Sidebar() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const SidebarContent = () => (
    <>
      <div className="sidebar-header">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}><Home size={20} /> <span>Dashboard</span></Link>
          </li>
          <li className={`dropdown ${isProductsOpen ? 'open' : ''}`}>
            <button onClick={() => setIsProductsOpen(!isProductsOpen)}>
              <Package size={20} /> <span>Productos</span>
            </button>
            {isProductsOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/productos" onClick={() => setIsMobileMenuOpen(false)}><List size={16} /> <span>Lista de Productos</span></Link></li>
                <li><Link to="/productos/nuevo" onClick={() => setIsMobileMenuOpen(false)}><PlusCircle size={16} /> <span>Añadir Producto</span></Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/categorias" onClick={() => setIsMobileMenuOpen(false)}><Grid size={20} /> <span>Categorías</span></Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)}><User size={20} /> <span>Perfil</span></Link>
        <Link to="/logout" onClick={() => setIsMobileMenuOpen(false)}><LogOut size={20} /> <span>Salir</span></Link>
      </div>
    </>
  );

  return (
    <>
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>
      )}
      <div className={`sidebar ${isMobile ? 'mobile' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
        <SidebarContent />
      </div>
    </>
  );
}