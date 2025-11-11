import React, { useState, useEffect, useMemo } from 'react'
import {
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CAlert,
} from '@coreui/react'
import ProductosService from '../../services/productos.service'
import './MenuProductos.css' 

const DEFAULT_CONFIG = {
  colorFondo: '#ffffff',
  colorTexto: '#000000',
  fuenteTexto: 'Arial, sans-serif',
  fuenteTitulo: 'Arial, sans-serif',
  tamanoFuenteTitulo: '28px',
  tamanoFuenteTexto: '16px',
  mostrarFooter: true,
  mostrarLogo: true,
};

// 🔹 ACEPTAMOS EL NUEVO PROP 'showUI' 🔹
// 🔹 CAMBIADO EL NOMBRE A 'PantallaProductos' para que coincida con el archivo
const MenuProductos = ({ plantilla = null, categoria = null, refreshInterval = 30000, showUI = false }) => {
  const [categoriasProd, setCategoriasProd] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // ... (Toda la lógica de useEffect, useMemo, etc., se mantiene idéntica) ...
  useEffect(() => {
    let isMounted = true
    const loadProductos = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await ProductosService.listProductosPublic(categoria)
        const items = response.data.items || []
        const disponibles = items.filter(p => p.prod_dis === true)

        const groups = {}
        disponibles.forEach(producto => {
          const catId = producto.catprod_cod;
          if (!groups[catId]) {
            groups[catId] = {
              cat_cod: catId,
              cat_name: producto.CategoriaProd?.catprod_name || 'Otros',
              productos: []
            };
          }
          groups[catId].productos.push(producto);
        });

        const groupedArray = Object.values(groups);

        if (isMounted) {
          setCategoriasProd(groupedArray)
          setLastUpdate(new Date())
        }

      } catch (err) {
        console.error("Error en loadProductos:", err)
        if (isMounted) setError("No se pudieron cargar los productos.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadProductos()
    const interval = setInterval(loadProductos, refreshInterval)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [categoria, refreshInterval])

  const categorias = useMemo(() => {
    const findCat = (name) => {
      if (!categoriasProd) return null;
      const formattedName = name.toUpperCase().trim();
      return categoriasProd.find(c => c.cat_name.toUpperCase().trim() === formattedName);
    }
    return {
      HELADOS: findCat("Helados"),
      CANDY: findCat("Candy"),
      ENVASADOS: findCat("Envasados"),
      REPOSTERIA: findCat("Reposteria"),
      CAFETERIA: findCat("Cafeteria"),
      CAFES_FRIOS: findCat("Cafés Frios"),
      DESAYUNOS: findCat("Desayunos y Meriendas"),
    };
  }, [categoriasProd]);

  const plantillaConfig = plantilla?.plan_config || {}
  const configFinal = { ...DEFAULT_CONFIG, ...plantillaConfig }
  const plantillaImageUrl = plantilla?.plan_imagen
  
  const rootStyle = {
    backgroundImage: plantillaImageUrl ? `url(${plantillaImageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: plantillaImageUrl ? undefined : configFinal.colorFondo,
    color: configFinal.colorTexto,
    fontFamily: configFinal.fuenteTexto,
    fontSize: configFinal.tamanoFuenteTexto,
  }

  // --- RENDERIZADO ---

  if (isLoading) {
    return (
      <div className="text-center p-5 d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CSpinner color="warning" />
        <p className="ms-3">Cargando Productos...</p> 
      </div>
    )
  }

  if (error) {
    return ( <CAlert color="danger" className="m-5 text-center">{error}</CAlert> )
  }

  if (categoriasProd.length === 0) {
    return (
      <CAlert color="info" className="m-5 text-center">
        No se encontraron productos disponibles para estas categorías.
      </CAlert>
    )
  }
  
  // 🔹 CORRECCIÓN: 'renderSeccion' está AHORA DENTRO del componente
  // para que tenga acceso a 'configFinal'
  const renderSeccion = (categoria, className = '') => {
    if (!categoria || !categoria.productos || categoria.productos.length === 0) {
      return null;
    }
    return (
      <div className={`seccion-menu ${className}`}>
        <h2 className="seccion-titulo" style={{ 
          color: configFinal.colorTitulo || configFinal.colorTexto, 
          fontFamily: configFinal.fuenteTitulo || configFinal.fuenteTexto, 
          fontSize: configFinal.tamanoFuenteTitulo 
        }}>
          {categoria.cat_name.toUpperCase()}
        </h2>
        <div className="productos-lista">
          {categoria.productos.map(p => (
            <div key={p.prod_cod} className="producto-item">
              <span className="producto-nombre" style={{ color: configFinal.colorTexto }}>{p.prod_nom}</span>
              <span className="producto-precio" style={{ color: configFinal.colorTexto }}>${Number(p.prod_pre).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="menu-productos-container" style={rootStyle}>
      <CContainer fluid>
        <CCard className="menu-card" style={{ background: 'transparent', boxShadow: 'none' }}>
          <CCardBody>
            {/* 🔹 USAMOS 'showUI' PARA OCULTAR/MOSTRAR ESTO 🔹 */}
            <div 
              className={`last-update ${showUI ? '' : 'hidden'}`} 
              style={{ color: configFinal.colorTexto }}
            >
              {lastUpdate ? `Última actualización: ${lastUpdate.toLocaleTimeString()}` : ''}
            </div>
            
            <CRow>
              <CCol md={4}>
                {renderSeccion(categorias.HELADOS, 'helados-seccion')}
                {renderSeccion(categorias.CANDY, 'candy-seccion')}
              </CCol>
              <CCol md={4}>
                 {renderSeccion(categorias.ENVASADOS, 'envasados-seccion')}
                 {renderSeccion(categorias.REPOSTERIA, 'reposteria-seccion')}
                 <div className="seccion-menu promos-seccion">
                    <h2 className="seccion-titulo" style={{ 
                      color: configFinal.colorTitulo || configFinal.colorTexto, 
                      fontFamily: configFinal.fuenteTitulo || configFinal.fuenteTexto, 
                      fontSize: configFinal.tamanoFuenteTitulo 
                    }}>
                      PROMOS
                    </h2>
                    <div className="productos-lista">
                      <p style={{color: configFinal.colorTexto, padding: '10px'}}>
                        ¡Próximamente nuevas promociones!
                      </p>
                    </div>
                 </div>
              </CCol>
              <CCol md={4} className="columna-derecha">
                 {renderSeccion(categorias.CAFETERIA, 'cafeteria-seccion')}
                 {renderSeccion(categorias.CAFES_FRIOS, 'cafes-frios-seccion')}
                 {renderSeccion(categorias.DESAYUNOS, 'desayunos-seccion')}
              </CCol>
            </CRow>

            {configFinal.mostrarFooter && (
              <div className="menu-footer">
                 <img src="../src/assets/Logo.svg" alt="Free Shop Logo" className="footer-logo" />
              </div>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}

export default MenuProductos