import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CSpinner, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft } from '@coreui/icons';
import PantallasService from '../../services/pantalla.service';
import { getComponent } from './Registro';
import './PantallaViewer.css';

const PantallaViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pantalla, setPantalla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ComponentToRender, setComponentToRender] = useState(null);

  useEffect(() => {
    const fetchPantalla = async () => {
      try {
        setLoading(true);
        const response = await PantallasService.getPantallaById(id);
        setPantalla(response.data);
        
        // Obtener el componente a renderizar
        if (response.data.pan_componente) {
          const componentInfo = getComponent(response.data.pan_componente);
          if (componentInfo && componentInfo.component) {
            setComponentToRender(componentInfo.component);
          } else {
            setError(`No se encontró el componente: ${response.data.pan_componente}`);
          }
        } else {
          setError('Esta pantalla no tiene un componente asignado');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar la pantalla:', err);
        setError('Error al cargar la pantalla. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    if (id) {
      fetchPantalla();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pantalla-error">
        <div className="alert alert-danger">{error}</div>
        <CButton color="primary" onClick={() => navigate(-1)}>
          <CIcon icon={cilArrowLeft} className="me-2" />
          Volver
        </CButton>
      </div>
    );
  }

  if (!pantalla || !ComponentToRender) {
    return (
      <div className="pantalla-error">
        <div className="alert alert-warning">No se pudo cargar la pantalla</div>
        <CButton color="primary" onClick={() => navigate(-1)}>
          <CIcon icon={cilArrowLeft} className="me-2" />
          Volver
        </CButton>
      </div>
    );
  }

  // Configuración combinada (plantilla + pantalla)
  const config = {
    ...(pantalla.plantilla?.plan_config || {}),
    ...(pantalla.pan_config || {})
  };

  return (
    <div className="pantalla-viewer">
      <div className="pantalla-viewer-content">
        <ComponentToRender {...config} />
      </div>
    </div>
  );
};

export default PantallaViewer;