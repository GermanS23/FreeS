"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CSpinner, CButton, CAlert } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import * as icons from "@coreui/icons"
import PantallasService from "../../services/pantalla.service"
import { getComponent } from "./Registro"
import "./PantallaViewer.css"

const PantallaViewer = () => {
  const { pan_cod } = useParams()
  const navigate = useNavigate()
  
  const [pantalla, setPantalla] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement)
  const [showUI, setShowUI] = useState(false) // Estado para mostrar/ocultar toda la UI
  
  // Usamos useRef para el timer
  const hideUiTimer = useRef(null)

  // --- Carga de Datos (Sin cambios) ---
  useEffect(() => {
    const fetchPantalla = async () => {
      setLoading(true); setError(null);
      try {
        const response = await PantallasService.getPantallaPublicaById(pan_cod)
        setPantalla(response.data)
      } catch (err) {
        console.error("[v0] Error al cargar pantalla:", err); setError("Error al cargar la pantalla.")
      } finally {
        setLoading(false)
      }
    }
    if (pan_cod) fetchPantalla()
  }, [pan_cod])

  // --- Lógica de Pantalla Completa ---
  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onFullScreenChange)

    // 🔹 ARREGLO BUG "ATRÁS" EN FULLSCREEN:
    // Esta es la función de limpieza. Se ejecuta cuando el componente "muere" (navegas atrás)
    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange)
      // Si salimos del componente y seguíamos en pantalla completa, forzamos la salida.
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }, [])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setShowUI(false) // Ocultar UI después del clic
  }

  // Lógica para mostrar/ocultar el botón (Corregida)
  const handleMouseMove = () => {
    setShowUI(true) // Muestra UI
    if (hideUiTimer.current) {
      clearTimeout(hideUiTimer.current) // Limpia el timer anterior
    }
    // Oculta la UI después de 3 segundos
    hideUiTimer.current = setTimeout(() => {
      setShowUI(false)
    }, 3000)
  }

  // --- Preparación de Props (Sin cambios) ---
  const ComponentToRender = useMemo(() => {
    if (!pantalla) return null
    const componentInfo = getComponent(pantalla.pan_componente)
    return componentInfo ? componentInfo.component : null
  }, [pantalla])

  const plantillaObj = useMemo(() => {
    if (!pantalla || !pantalla.Plantilla) return null
    const raw = pantalla.Plantilla
    const clone = { ...raw }
    if (clone.plan_imagen && !clone.plan_imagen.startsWith("http")) {
      clone.plan_imagen = `http://localhost:3000${clone.plan_imagen}`
    }
    if (typeof clone.plan_config === "string") {
      try { clone.plan_config = JSON.parse(clone.plan_config || "{}") } catch (e) { clone.plan_config = {} }
    }
    return clone
  }, [pantalla])

  const catsIds = useMemo(() => {
    if (!pantalla) return []
    const arr = pantalla.CategoriaSabs || pantalla.CategoriaProds || []
    return arr.map((c) => Number(c.catsab_cod || c.catprod_cod)).filter(Boolean)
  }, [pantalla])

  const config = useMemo(() => {
    const planCfg = plantillaObj?.plan_config || {}
    let panCfg = pantalla?.pan_config || {}
    if (typeof panCfg === "string") {
      try { panCfg = JSON.parse(panCfg || "{}") } catch (e) { panCfg = {} }
    }
    return { ...planCfg, ...panCfg }
  }, [plantillaObj, pantalla])

  // 🔹 ARREGLO "ESPACIO ARRIBA" / "CANDY CORTADO":
  // Eliminamos el 'padding' y forzamos 'height: 100vh'
  const plantillaStyles = useMemo(() => ({
    backgroundImage: plantillaObj?.plan_imagen ? `url(${plantillaObj.plan_imagen})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: config?.colorFondo || "#ffffff",
    color: config?.colorTexto || "#000000",
    fontFamily: config?.fuenteTexto || "Arial, sans-serif",
    fontSize: config?.tamanoFuenteTexto || "16px",
    height: "100vh", // Ocupa el 100% de la altura de la ventana
    width: "100vw",  // Ocupa el 100% del ancho de la ventana
    overflow: "hidden", // La página principal no scrollea
    display: "flex",
    flexDirection: "column",
    padding: 0 // Sin padding
  }), [plantillaObj, config])

  
  // --- RENDERIZADO ---

  if (loading) {
    return (
      <div className="pantalla-viewer-loading">
        <CSpinner color="primary" />
        <p className="mt-3">Cargando pantalla...</p>
      </div>
    )
  }
  if (error) { return ( <div className="pantalla-error"><CAlert color="danger">{error}</CAlert></div> ) }
  if (!pantalla || !ComponentToRender) { return ( <div className="pantalla-error"><CAlert color="warning">Componente no encontrado</CAlert></div> ) }

  return (
    <div 
      className="pantalla-viewer" 
      style={plantillaStyles} 
      onMouseMove={handleMouseMove}
      tabIndex={-1}
    >
      
      {/* 🔹 GRUPO DE BOTONES (Overlay) 🔹 */}
      <div 
        className="ui-overlay" 
        style={{ opacity: showUI ? 1 : 0 }}
      >
        <CButton color="light" size="lg" onClick={() => navigate(-1)}>
          <CIcon icon={icons.cilArrowLeft} size="xl" />
        </CButton>
        <CButton color="light" size="lg" onClick={toggleFullScreen}>
          <CIcon icon={isFullScreen ? icons.cilCompress : icons.cilFullscreen} size="xl" />
        </CButton>
      </div>
      
      {/* 🔹 CONTENIDO (Crece para ocupar el espacio) 🔹 */}
      <div 
        className="pantalla-viewer-content" 
        style={{ flexGrow: 1, overflow: 'hidden'}} // Añadimos padding aquí
      >
        <ComponentToRender 
          {...config} 
          plantilla={plantillaObj} 
          categoria={catsIds.length ? catsIds : null}
          showUI={showUI} // Pasamos el estado a los hijos
        />
      </div>
    </div>
  )
}

export default PantallaViewer