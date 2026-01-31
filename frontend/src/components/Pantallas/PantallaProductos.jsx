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
import PromocionesService from '../../services/promociones.service' // 🔹 1. IMPORTAMOS EL NUEVO SERVICIO
import './MenuProductos.css' 

const DEFAULT_CONFIG = {
  colorTexto: '#000000',
  fuenteTexto: 'Arial, sans-serif',
  fuenteTitulo: 'Arial, sans-serif',
  tamanoFuenteTitulo: '28px',
  tamanoFuenteTexto: '16px',
  mostrarFooter: true,
  mostrarLogo: true,
};

// 🔹 Usamos el nombre 'MenuProductos' para que coincida con tu 'Registro.jsx'
const MenuProductos = ({ plantilla = null, categoria = null, refreshInterval = 30000, showUI = false }) => {
  const [categoriasProd, setCategoriasProd] = useState([])
  const [promociones, setPromociones] = useState([]) // 🔹 2. AÑADIMOS ESTADO PARA PROMOS
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Lógica de carga de datos (Ahora carga Productos Y Promociones)
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // --- Cargar Productos (como antes) ---
        const responseProd = await ProductosService.listProductosPublic(categoria)
        const itemsProd = responseProd.data.items || []
        const disponibles = itemsProd.filter(p => p.prod_dis === true)
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

        // --- Cargar Promociones (nuevo) ---
        const responsePromo = await PromocionesService.listPromosPublic()
        const promosActivas = responsePromo.data.items || []

        if (isMounted) {
          setCategoriasProd(groupedArray)
          setPromociones(promosActivas) // 🔹 3. GUARDAMOS LAS PROMOS EN EL ESTADO
          setLastUpdate(new Date())
        }

      } catch (err) {
        console.error("Error en loadData:", err)
        if (isMounted) setError("No se pudieron cargar los datos.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    
    loadData()
    const interval = setInterval(loadData, refreshInterval) 
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [categoria, refreshInterval])

  // Lógica de mapeo para el layout (basado en tu imagen)
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

  // Lógica de Estilos
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

  // 🔹 Modificamos la condición de "no encontrado"
  if (categoriasProd.length === 0 && promociones.length === 0) {
    return (
      <CAlert color="info" className="m-5 text-center">
        No se encontraron productos ni promociones disponibles.
      </CAlert>
    )
  }
  
  // 'renderSeccion' está DENTRO del componente
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
            {/* Usamos el prop 'showUI' para ocultar/mostrar esto */}
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
                 
              </CCol>
              <CCol md={4} className="columna-derecha">
                 {renderSeccion(categorias.CAFETERIA, 'cafeteria-seccion')}
                 {renderSeccion(categorias.CAFES_FRIOS, 'cafes-frios-seccion')}
                 {renderSeccion(categorias.DESAYUNOS, 'desayunos-seccion')}
                 {/* 🔹 4. SECCIÓN DE PROMOCIONES DINÁMICA 🔹 */}
                 <div className="seccion-menu promos-seccion">
                    <h2 className="seccion-titulo" style={{ 
                      color: configFinal.colorTitulo || configFinal.colorTexto, 
                      fontFamily: configFinal.fuenteTitulo || configFinal.fuenteTexto, 
                      fontSize: configFinal.tamanoFuenteTitulo 
                    }}>
                      PROMOS
                    </h2>
                    <div className="productos-lista">
                      {promociones.length > 0 ? (
                        promociones.map(promo => (
                          // Usamos las mismas clases CSS que los productos
                          <div key={promo.prom_cod} className="producto-item">
                            <span className="producto-nombre" style={{ color: configFinal.colorTexto }}>{promo.prom_nom}</span>
                            <span className="producto-precio" style={{ color: configFinal.colorTexto }}>${Number(promo.prom_importe).toLocaleString()}</span>
                          </div>
                        ))
                      ) : (
                        <p style={{color: configFinal.colorTexto, padding: '10px'}}>
                          No hay promociones disponibles.
                        </p>
                      )}
                    </div>
                 </div>
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

// 🔹 Exportamos con el nombre 'MenuProductos'
export default MenuProductos