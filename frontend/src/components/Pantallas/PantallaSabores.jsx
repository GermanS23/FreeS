import React, { useState, useEffect, useCallback } from 'react';
import { 
  CCard, 
  CCardBody, 
  CContainer, 
  CRow, 
  CCol 
} from '@coreui/react';
import { Heart } from 'lucide-react';
import SaboresService from '../../services/sabores.service';
import './SaboresMenu.css';

const SaboresMenu = () => {
  const [saboresIzquierda, setSaboresIzquierda] = useState([]);
  const [saboresDerecha, setSaboresDerecha] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Función actualizada para obtener sabores
  const fetchSabores = useCallback(async () => {
    try {
      const response = await SaboresService.listSabores(0, 100, '');
      // Filtrar por categoría y disponibilidad
      const saboresDisponibles = response.data.items.filter(
        sabor => sabor.sab_disp === true && 
                sabor.CategoriaSab?.catsab_name === "CREMAS"
      );

      // Dividir los sabores en dos arrays
      const mitad = Math.ceil(saboresDisponibles.length / 2);
      setSaboresIzquierda(saboresDisponibles.slice(0, mitad));
      setSaboresDerecha(saboresDisponibles.slice(mitad));
      setLastUpdate(new Date());
      
      if (isLoading) setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar sabores:', error);
      setError('Error al cargar los sabores. Por favor, intente nuevamente.');
      setIsLoading(false);
    }
  }, [isLoading]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    fetchSabores();
  }, [fetchSabores]);

  // Efecto para actualización periódica
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchSabores();
    }, 30000); // Actualiza cada 30 segundos

    // Cleanup al desmontar el componente
    return () => clearInterval(intervalId);
  }, [fetchSabores]);

  // Opcional: Función para forzar actualización manual
  const handleManualRefresh = () => {
    setIsLoading(true);
    fetchSabores();
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-5">
        {error}
        <button 
          className="btn btn-outline-danger ms-3"
          onClick={handleManualRefresh}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="sabores-menu-container">
      <CContainer fluid>
        <CCard className="sabores-card">
          <CCardBody>
            {/* Indicador de última actualización */}
            <div className="last-update">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </div>

            <CRow>
              {/* Columna izquierda */}
              <CCol md={5}>
                <h2 className="menu-section-title">CREMAS HELADAS</h2>
                <ul className="sabores-list">
                  {saboresIzquierda.map((sabor) => (
                    <li key={sabor.sab_cod} className="sabor-item">
                      • {sabor.sab_nom}
                      {sabor.sab_desc && (
                        <div className="sabor-descripcion">
                          {sabor.sab_desc}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CCol>

              {/* Columna central */}
              <CCol md={2} className="d-flex justify-content-center align-items-center">
                <div className="central-content">
                  <img 
                    src="../src/assets/Logo.svg" 
                    alt="Free Shop Logo" 
                    className="brand-logo"
                  />
                  <div className="social-icons">
                    <Heart className="heart-icon" />
                    <Heart className="heart-icon" />
                  </div>
                </div>
              </CCol>

              {/* Columna derecha */}
              <CCol md={5}>
                <ul className="sabores-list mt-5">
                  {saboresDerecha.map((sabor) => (
                    <li key={sabor.sab_cod} className="sabor-item">
                      • {sabor.sab_nom}
                      {sabor.sab_desc && (
                        <div className="sabor-descripcion">
                          {sabor.sab_desc}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CCol>
            </CRow>

            <div className="footer-note">
              Los sabores <b>FREE SHOP</b> tienen bombones Marroc, chips de chocolate y DDL repostero | www.freeshophelados.com.ar
            </div>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default SaboresMenu;