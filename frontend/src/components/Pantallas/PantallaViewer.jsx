"use client"

import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react"
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

  const [scale, setScale] = useState(1)
  const contentRef = useRef(null)

  const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement)
  const [showUI, setShowUI] = useState(false)
  const hideUiTimer = useRef(null)

  /* =========================
     CARGA DE PANTALLA
  ========================== */
  useEffect(() => {
    const fetchPantalla = async () => {
      try {
        setLoading(true)
        const response = await PantallasService.getPantallaPublicaById(pan_cod)
        setPantalla(response.data)
      } catch (err) {
        setError("Error al cargar la pantalla")
      } finally {
        setLoading(false)
      }
    }
    fetchPantalla()
  }, [pan_cod])

  /* =========================
     FULLSCREEN
  ========================== */
  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onFullScreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange)
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }, [])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setShowUI(false)
  }

  const handleMouseMove = () => {
    setShowUI(true)
    clearTimeout(hideUiTimer.current)
    hideUiTimer.current = setTimeout(() => setShowUI(false), 3000)
  }

  /* =========================
     COMPONENTE DINÁMICO
  ========================== */
  const ComponentToRender = useMemo(() => {
    if (!pantalla) return null
    const componentInfo = getComponent(pantalla.pan_componente)
    return componentInfo?.component || null
  }, [pantalla])

  /* =========================
     ESCALADO AUTOMÁTICO
  ========================== */
  useLayoutEffect(() => {
    if (!contentRef.current) return

    const resize = () => {
      const contentHeight = contentRef.current.scrollHeight
      const viewportHeight = window.innerHeight
      const newScale = contentHeight > viewportHeight
        ? viewportHeight / contentHeight
        : 1

      setScale(newScale)
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [pantalla])

  /* =========================
     ESTILOS DE FONDO
  ========================== */
  const plantillaStyles = useMemo(() => ({
    backgroundImage: pantalla?.Plantilla?.plan_imagen
      ? `url(http://localhost:3000${pantalla.Plantilla.plan_imagen})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  }), [pantalla])

  /* =========================
     RENDER
  ========================== */
  if (loading) {
    return (
      <div className="pantalla-viewer-loading">
        <CSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="pantalla-error">
        <CAlert color="danger">{error}</CAlert>
      </div>
    )
  }

  if (!ComponentToRender) {
    return (
      <div className="pantalla-error">
        <CAlert color="warning">Componente no encontrado</CAlert>
      </div>
    )
  }

  return (
    <div
      className="pantalla-viewer"
      style={plantillaStyles}
      onMouseMove={handleMouseMove}
    >
      {/* UI */}
      <div className="ui-overlay" style={{ opacity: showUI ? 1 : 0 }}>
        <CButton color="light" onClick={() => navigate(-1)}>
          <CIcon icon={icons.cilArrowLeft} />
        </CButton>
        <CButton color="light" onClick={toggleFullScreen}>
          <CIcon icon={isFullScreen ? icons.cilCompress : icons.cilFullscreen} />
        </CButton>
      </div>

      {/* CONTENIDO ESCALADO */}
      <div className="pantalla-scaler">
        <div
          className="pantalla-scaled-content"
          ref={contentRef}
          style={{ transform: `scale(${scale})` }}
        >
          <ComponentToRender />
        </div>
      </div>
    </div>
  )
}

export default PantallaViewer
