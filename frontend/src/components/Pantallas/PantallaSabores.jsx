import React, { useState, useEffect, useMemo, useRef } from 'react' // 🔹 CORREGIDO (useRef)
import {
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { Heart } from 'lucide-react'
import SaboresService from '../../services/sabores.service'
import './SaboresMenu.css' 

const DEFAULT_CONFIG = {
  colorTexto: '#000000',
  fuenteTexto: 'Arial, sans-serif',
  fuenteTitulo: 'Arial, sans-serif',
  tamanoFuenteTitulo: '24px',
  tamanoFuenteTexto: '16px',
  mostrarLogo: true,
  mostrarFooter: true,
};

// 🔹 ACEPTAMOS 'showUI' y usamos el nombre 'MenuSabores'
const MenuSabores = ({ plantilla = null, categoria = null, refreshInterval = 30000, showUI = false }) => {
  const [categorias, setCategorias] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadSabores = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await SaboresService.listSaboresPublic(categoria)
        const items = response.data.items || []
        const disponibles = items.filter(s => s.sab_disp === true)

        const groups = {}
        disponibles.forEach(sabor => {
          const catId = sabor.catsab_cod;
          if (!groups[catId]) {
            groups[catId] = {
              cat_cod: catId,
              cat_name: sabor.CategoriaSab?.catsab_name || 'Otros',
              sabores: [] 
            };
          }
          groups[catId].sabores.push(sabor);
        });

        const groupedArray = Object.values(groups);

        if (isMounted) {
          setCategorias(groupedArray)
          setLastUpdate(new Date())
        }

      } catch (err) {
        console.error("Error en loadSabores:", err)
        if (isMounted) setError("No se pudieron cargar los sabores.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadSabores()
    const interval = setInterval(loadSabores, refreshInterval)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [categoria, refreshInterval])

  const { catIzquierda, catDerecha } = useMemo(() => {
    return {
      catIzquierda: categorias[0] || null, 
      catDerecha: categorias[1] || null,  
    }
  }, [categorias])

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
      <div className="text-center p-5 d-flex justify-content-center align-items-center" style={{ minHeight: '200px', zIndex: 10, position: 'relative' }}>
        <CSpinner color="warning" />
        <p className="ms-3">Cargando Sabores...</p> 
      </div>
    )
  }

  if (error) {
    return ( <CAlert color="danger" className="m-5 text-center">{error}</CAlert> )
  }

  if (categorias.length === 0) {
    return (
      <CAlert color="info" className="m-5 text-center">
        No se encontraron sabores disponibles para esta categoría.
      </CAlert>
    )
  }

  return (
    <div className="sabores-menu-container" style={rootStyle}>
      <CContainer fluid>
        <CCard className="sabores-card" style={{ background: 'transparent', boxShadow: 'none' }}>
          <CCardBody>
            {/* 🔹 USAMOS 'showUI' PARA OCULTAR/MOSTRAR ESTO 🔹 */}
            <div 
              className={`last-update ${showUI ? '' : 'hidden'}`} 
              style={{ color: configFinal.colorTexto }}
            >
              {lastUpdate ? `Última actualización: ${lastUpdate.toLocaleTimeString()}` : ''}
            </div>
            
            <CRow>
              <CCol md={5}>
                {catIzquierda && (
                  <>
                    <h2 className="menu-section-title" style={{ 
                      color: configFinal.colorTitulo || configFinal.colorTexto, 
                      fontFamily: configFinal.fuenteTitulo || configFinal.fuenteTexto, 
                      fontSize: configFinal.tamanoFuenteTitulo, 
                      marginTop:0 
                    }}>
                      {catIzquierda.cat_name.toUpperCase()}
                    </h2>
                    <ul className="sabores-list">
                      {catIzquierda.sabores.map(s => (<li key={s.sab_cod} style={{ color: configFinal.colorTexto }}>• {s.sab_nom}</li>))}
                    </ul>
                  </>
                )}
              </CCol>

              <CCol md={2} className="d-flex justify-content-center align-items-center">
                <div className="central-content" style={{textAlign:'center'}}>
                  {configFinal.mostrarLogo && (<img src="../src/assets/Logo.svg" alt="Free Shop Logo" className="brand-logo" />)}
                  <div className="social-icons" style={{ marginTop: 8 }}><Heart className="heart-icon" /><Heart className="heart-icon" /></div>
                </div>
              </CCol>

              <CCol md={5}>
                 {catDerecha && (
                  <>
                    <h2 className="menu-section-title" style={{ 
                      color: configFinal.colorTitulo || configFinal.colorTexto, 
                      fontFamily: configFinal.fuenteTitulo || configFinal.fuenteTexto, 
                      fontSize: configFinal.tamanoFuenteTitulo, 
                      marginTop:0 
                    }}>
                      {catDerecha.cat_name.toUpperCase()}
                    </h2>
                    <ul className="sabores-list">
                      {catDerecha.sabores.map(s => (<li key={s.sab_cod} style={{ color: configFinal.colorTexto }}>• {s.sab_nom}</li>))}
                    </ul>
                  </>
                )}
              </CCol>
            </CRow>

            {configFinal.mostrarFooter && (
              <div 
                className="footer-note" 
                style={{ color: configFinal.colorTexto }}
              >
                Los sabores <b>FREE SHOP</b> ...
              </div>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}

// 🔹 CORRECCIÓN: Exportamos 'MenuSabores'
export default MenuSabores