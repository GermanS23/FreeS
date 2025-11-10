import React, { useState, useEffect, useCallback } from 'react';
import { 
  CCard, 
  CCardBody, 
  CContainer, 
  CRow, 
  CCol 
} from '@coreui/react';
import ProductosService from '../../services/productos.service';
import './MenuProductos.css';

const DEFAULT_CONFIG = {
  colorFondo: '#ffffff',
  colorTexto: '#000000',
  fuenteTexto: 'Arial, sans-serif',
  fuenteTitulo: 'Arial, sans-serif',
  tamanoFuenteTitulo: '28px',
  tamanoFuenteTexto: '16px',
  mostrarFooter: true,
};

const SECCIONES_MENU = {
  HELADOS: "Helados",
  ENVASADOS: "Envasados",
  CANDY: "Candy",
  REPOSTERIA: "Reposteria",
  CAFETERIA: "Cafeteria",
  CAFES_FRIOS: "Cafés Frios",
  DESAYUNOS: "Desayunos y Meriendas",
  PROMOS: "PROMOS"
};

const MenuProductos = ({ plantilla = null }) => {
  const [productos, setProductos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const plantillaConfig = plantilla?.plan_config || {};
  const configFinal = { ...DEFAULT_CONFIG, ...plantillaConfig };
  const plantillaImageUrl = plantilla?.plan_imagen ? `http://localhost:3000${plantilla.plan_imagen}` : null;

  const rootStyle = {
    backgroundImage: plantillaImageUrl ? `url(${plantillaImageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: plantillaImageUrl ? undefined : configFinal.colorFondo,
    color: configFinal.colorTexto,
    fontFamily: configFinal.fuenteTexto,
    fontSize: configFinal.tamanoFuenteTexto,
  };

  const fetchProductos = useCallback(async () => {
    try {
      const response = await ProductosService.listProductos(0, 1000, '');
      const productosDisponibles = response.data.items.filter(producto => producto.prod_dis === true);

      const productosPorCategoria = {};
      Object.values(SECCIONES_MENU).forEach(seccion => {
        productosPorCategoria[seccion] = productosDisponibles.filter(
          producto => producto.CategoriaProd?.catprod_name === seccion
        );
      });

      setProductos(productosPorCategoria);
      setLastUpdate(new Date());
      if (isLoading) setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar los productos. Por favor, intente nuevamente.');
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchProductos();
    const intervalId = setInterval(fetchProductos, 10000);
    return () => clearInterval(intervalId);
  }, [fetchProductos]);

  const renderSeccion = (titulo, items, className = '') => (
    <div className={`seccion-menu ${className}`}>
      <h2 className="seccion-titulo" style={{ color: configFinal.colorTitulo, fontFamily: configFinal.fuenteTitulo, fontSize: configFinal.tamanoFuenteTitulo }}>{titulo}</h2>
      <div className="productos-lista">
        {items?.map((producto) => (
          <div key={producto.prod_cod} className="producto-item">
            <span className="producto-nombre">{producto.prod_nom}</span>
            <span className="producto-precio">${Number(producto.prod_pre).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );

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
    return <div className="alert alert-danger m-5">{error}</div>;
  }

  return (
    <div className="menu-productos-container" style={rootStyle}>
      <CContainer fluid>
        <CCard className="menu-card" style={{ background: 'transparent', boxShadow: 'none' }}>
          <CCardBody>
            <div className="last-update" style={{ color: configFinal.colorTexto }}>
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </div>

            <CRow>
              <CCol md={4}>
                {renderSeccion(SECCIONES_MENU.HELADOS, productos[SECCIONES_MENU.HELADOS], 'helados-seccion')}
                {renderSeccion(SECCIONES_MENU.CANDY, productos[SECCIONES_MENU.CANDY], 'candy-seccion')}
              </CCol>

              <CCol md={4}>
                {renderSeccion(SECCIONES_MENU.ENVASADOS, productos[SECCIONES_MENU.ENVASADOS], 'envasados-seccion')}
                {renderSeccion(SECCIONES_MENU.REPOSTERIA, productos[SECCIONES_MENU.REPOSTERIA], 'reposteria-seccion')}
                {renderSeccion(SECCIONES_MENU.PROMOS, productos[SECCIONES_MENU.PROMOS], 'promos-seccion')}
              </CCol>

              <CCol md={4} className="columna-derecha">
                {renderSeccion(SECCIONES_MENU.CAFETERIA, productos[SECCIONES_MENU.CAFETERIA], 'cafeteria-seccion')}
                {renderSeccion(SECCIONES_MENU.CAFES_FRIOS, productos[SECCIONES_MENU.CAFES_FRIOS], 'cafes-frios-seccion')}
                {renderSeccion(SECCIONES_MENU.DESAYUNOS, productos[SECCIONES_MENU.DESAYUNOS], 'desayunos-seccion')}
              </CCol>
            </CRow>

            <div className="menu-footer">
              {configFinal.mostrarFooter && <img src="../src/assets/Logo.svg" alt="Free Shop Logo" className="footer-logo" />}
            </div>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default MenuProductos;
