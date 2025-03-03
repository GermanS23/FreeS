import React, { useState, useEffect, useRef } from 'react';
import { 
  CCard, 
  CCardBody, 
  CContainer, 
  CRow, 
  CCol, 
  CButton,
  CButtonGroup,
  CFormSelect,
  CFormRange,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CCloseButton
} from '@coreui/react';
import { cilFullscreen, cilFullscreenExit, cilOptions } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ProductosService from '../../services/productos.service';
import '@coreui/coreui/dist/css/coreui.min.css';
import './MenuDigital.css';

const MenuDigital = () => {
  // Estado para almacenar los productos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para personalización
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [backgroundColor, setBackgroundColor] = useState('#e6f7ff');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const menuRef = useRef(null);

  // Obtener productos del backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setIsLoading(true);
        
        // Opción 1: Usar el nuevo endpoint específico para productos disponibles
        // const response = await ProductosService.getProductosDisponibles();
        // const productosDisponibles = response.data;
        
        // Opción 2: Usar el endpoint de lista existente y filtrar en el frontend
        const response = await ProductosService.listProductos(0, 100, '');
        
        // Filtrar solo productos disponibles (prod_dis = true)
        const productosDisponibles = response.data.items.filter(
          producto => producto.prod_dis === true
        );
        
        // Agrupar productos por categoría
        const categoriaMap = {};
        productosDisponibles.forEach(producto => {
          const categoria = producto.CategoriaProd?.nombre || 'Sin categoría';
          if (!categoriaMap[categoria]) {
            categoriaMap[categoria] = [];
          }
          categoriaMap[categoria].push(producto);
        });
        
        // Convertir el mapa a un array de categorías
        const categoriasArray = Object.keys(categoriaMap).map(nombre => ({
          nombre,
          productos: categoriaMap[nombre]
        }));
        
        setCategorias(categoriasArray);
        setProductos(productosDisponibles);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setError('Error al cargar los productos. Por favor, intente nuevamente.');
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Función para alternar pantalla completa
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (menuRef.current.requestFullscreen) {
        menuRef.current.requestFullscreen();
      } else if (menuRef.current.mozRequestFullScreen) {
        menuRef.current.mozRequestFullScreen();
      } else if (menuRef.current.webkitRequestFullscreen) {
        menuRef.current.webkitRequestFullscreen();
      } else if (menuRef.current.msRequestFullscreen) {
        menuRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Escuchar eventos de cambio de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.mozFullScreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Renderizar productos por categoría
  const renderProductosPorCategoria = () => {
    if (categorias.length === 0) {
      return <p>No hay productos disponibles.</p>;
    }

    // Dividir categorías en columnas (similar a la imagen)
    const numColumnas = 3;
    const categoriasAgrupadas = [];
    
    for (let i = 0; i < categorias.length; i += numColumnas) {
      categoriasAgrupadas.push(categorias.slice(i, i + numColumnas));
    }

    return categoriasAgrupadas.map((grupo, groupIndex) => (
      <CRow key={`grupo-${groupIndex}`} className="mb-4">
        {grupo.map((categoria, index) => (
          <CCol key={`categoria-${index}`} md={12 / numColumnas}>
            <div className="categoria-container">
              <h2 className="categoria-titulo">{categoria.nombre}</h2>
              <div className="productos-lista">
                {categoria.productos.map((producto) => (
                  <div key={producto.prod_cod} className="producto-item">
                    <span className="producto-nombre">{producto.prod_nom}</span>
                    <span className="producto-precio">{Number(producto.prod_pre).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CCol>
        ))}
      </CRow>
    ));
  };

  // Aplicar imagen de fondo
  const handleBackgroundImageChange = (url) => {
    setBackgroundImage(url);
  };

  // Estilos dinámicos basados en la personalización
  const menuStyle = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: textColor,
  };

  return (
    <div ref={menuRef} className="menu-digital-container" style={menuStyle}>
      <CContainer fluid className="p-0">
        <div className="menu-controls">
          <CButtonGroup>
            <CButton 
              color="primary" 
              variant="ghost" 
              onClick={toggleFullscreen}
            >
              <CIcon icon={isFullscreen ? cilFullscreenExit : cilFullscreen} />
            </CButton>
            <CButton 
              color="primary" 
              variant="ghost" 
              onClick={() => setShowSettings(!showSettings)}
            >
              <CIcon icon={cilOptions} />
            </CButton>
          </CButtonGroup>
        </div>

        <CCard className="menu-card">
          <CCardBody>
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="menu-content">
                <h1 className="menu-title text-center mb-4">Menú Digital</h1>
                {renderProductosPorCategoria()}
              </div>
            )}
          </CCardBody>
        </CCard>
      </CContainer>

      {/* Panel de configuración */}
      <COffcanvas 
        placement="end" 
        visible={showSettings} 
        onHide={() => setShowSettings(false)}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Personalización</COffcanvasTitle>
          <CCloseButton onClick={() => setShowSettings(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <div className="mb-3">
            <label className="form-label">Tamaño de fuente: {fontSize}px</label>
            <CFormRange 
              min="12" 
              max="32" 
              value={fontSize} 
              onChange={(e) => setFontSize(e.target.value)} 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Tipo de fuente</label>
            <CFormSelect 
              value={fontFamily} 
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
            </CFormSelect>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Color de fondo</label>
            <input 
              type="color" 
              className="form-control form-control-color" 
              value={backgroundColor} 
              onChange={(e) => setBackgroundColor(e.target.value)} 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Color de texto</label>
            <input 
              type="color" 
              className="form-control form-control-color" 
              value={textColor} 
              onChange={(e) => setTextColor(e.target.value)} 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Imagen de fondo (URL)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="https://ejemplo.com/imagen.jpg" 
              onChange={(e) => handleBackgroundImageChange(e.target.value)} 
            />
          </div>
        </COffcanvasBody>
      </COffcanvas>
    </div>
  );
};

export default MenuDigital;