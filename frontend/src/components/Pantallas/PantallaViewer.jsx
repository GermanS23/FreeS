"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CSpinner, CButton, CAlert } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import * as icons from "@coreui/icons"
import PantallasService from "../../services/pantalla.service"
import { getComponent } from "./Registro" // Asumo que este es tu Registro.jsx
import "./PantallaViewer.css"

const PantallaViewer = () => {
  const { pan_cod } = useParams()
  const navigate = useNavigate()
  
  const [pantalla, setPantalla] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 1. Cargar la data de la Pantalla (Plantilla, Categorías, etc.)
  useEffect(() => {
    const fetchPantalla = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await PantallasService.getPantallaPublicaById(pan_cod)
        setPantalla(response.data)
      } catch (err) {
        console.error("[v0] Error al cargar pantalla:", err)
        setError("Error al cargar la pantalla.")
      } finally {
        setLoading(false)
      }
    }

    if (pan_cod) fetchPantalla()
  }, [pan_cod]) // Se ejecuta solo si el ID de la pantalla cambia

  // 2. Definir qué componente hijo mostrar (basado en la data cargada)
  const ComponentToRender = useMemo(() => {
    if (!pantalla) return null
    const componentInfo = getComponent(pantalla.pan_componente) // ej: "menu-sabores"
    return componentInfo ? componentInfo.component : null
  }, [pantalla])

  // 3. Preparar los props para el hijo: Objeto Plantilla
  const plantillaObj = useMemo(() => {
    if (!pantalla || !pantalla.Plantilla) return null
    const raw = pantalla.Plantilla
    const clone = { ...raw }
    
    // Arreglar URL de imagen
    if (clone.plan_imagen && !clone.plan_imagen.startsWith("http")) {
      clone.plan_imagen = `http://localhost:3000${clone.plan_imagen}`
    }
    // Parsear JSON de config
    if (typeof clone.plan_config === "string") {
      try { clone.plan_config = JSON.parse(clone.plan_config || "{}") } catch (e) { clone.plan_config = {} }
    }
    return clone
  }, [pantalla])

  // 4. Preparar los props para el hijo: IDs de Categoría
  const catsIds = useMemo(() => {
    if (!pantalla || !pantalla.CategoriaSabs) return []
    const arr = pantalla.CategoriaSabs
    return arr.map((c) => Number(c.catsab_cod)).filter(Boolean)
  }, [pantalla])

  // 5. Preparar los props para el hijo: Configuración final (merged)
  const config = useMemo(() => {
    const planCfg = plantillaObj?.plan_config || {}
    let panCfg = pantalla?.pan_config || {}
    if (typeof panCfg === "string") {
      try { panCfg = JSON.parse(panCfg || "{}") } catch (e) { panCfg = {} }
    }
    return { ...planCfg, ...panCfg }
  }, [plantillaObj, pantalla])

  // 6. Preparar los estilos de fondo
  const plantillaStyles = useMemo(() => ({
    backgroundImage: plantillaObj?.plan_imagen ? `url(${plantillaObj.plan_imagen})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: config?.colorFondo || "#ffffff",
    color: config?.colorTexto || "#000000",
    fontFamily: config?.fuenteTexto || "Arial, sans-serif",
    fontSize: config?.tamanoFuenteTexto || "16px",
    minHeight: "100vh",
    padding: "12px",
  }), [plantillaObj, config])

  
  // --- RENDERIZADO ---

  // Estado 1: Cargando el 'PantallaViewer'
  if (loading) {
    return (
      <div className="pantalla-viewer-loading">
        <CSpinner color="primary" />
        <p className="mt-3">Cargando pantalla...</p>
      </div>
    )
  }

  // Estado 2: Error al cargar el 'PantallaViewer'
  if (error) {
    return (
      <div className="pantalla-error">
        <CAlert color="danger">{error}</CAlert>
        <CButton color="primary" onClick={() => navigate("/pantallas")}>
          <CIcon icon={icons.cilArrowLeft} className="me-2" /> Volver
        </CButton>
      </div>
    )
  }

  // Estado 3: Error, no se encontró el componente hijo
  if (!pantalla || !ComponentToRender) {
    return (
      <div className="pantalla-error">
        <CAlert color="warning">
          {!pantalla 
            ? "No se pudo cargar la pantalla." 
            : `Componente '${pantalla.pan_componente}' no encontrado (verif. Registro.jsx)`
          }
        </CAlert>
        <CButton color="primary" onClick={() => navigate("/pantallas")}>
          <CIcon icon={icons.cilArrowLeft} className="me-2" /> Volver
        </CButton>
      </div>
    )
  }

  // Estado 4: Éxito. Renderizar el hijo ('PantallaSabores')
  return (
    <div className="pantalla-viewer" style={plantillaStyles}>
      <div className="pantalla-viewer-header">
        <CButton color="light" size="sm" onClick={() => navigate("/pantallas")} className="back-button">
          <CIcon icon={icons.cilArrowLeft} className="me-2" /> Volver
        </CButton>
        <h2 className="pantalla-viewer-title">{pantalla.pan_nomb}</h2>
      </div>

      <div className="pantalla-viewer-content">
        <ComponentToRender 
          {...config} 
          plantilla={plantillaObj} 
          categoria={catsIds.length ? catsIds : null} // Le pasamos [2]
        />
      </div>
    </div>
  )
}

export default PantallaViewer