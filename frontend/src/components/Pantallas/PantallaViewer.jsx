"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CSpinner, CButton, CAlert } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilArrowLeft } from "@coreui/icons"
import PantallasService from "../../services/pantalla.service"
import { getComponent } from "./Registro"
import "./PantallaViewer.css"

const PantallaViewer = () => {
  const { pan_cod } = useParams()
  const navigate = useNavigate()
  const [pantalla, setPantalla] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ComponentToRender, setComponentToRender] = useState(null)

  useEffect(() => {
    const fetchPantalla = async () => {
      try {
        setLoading(true)
        console.log("[v0] Cargando pantalla con código:", pan_cod)
        const response = await PantallasService.getPantallaById(pan_cod)
        console.log("[v0] Pantalla cargada:", response.data)
        setPantalla(response.data)

        // Obtener el componente a renderizar
        if (response.data.pan_componente) {
          const componentInfo = getComponent(response.data.pan_componente)
          console.log("[v0] Componente encontrado:", componentInfo)
          if (componentInfo && componentInfo.component) {
            setComponentToRender(() => componentInfo.component)
          } else {
            setError(`No se encontró el componente: ${response.data.pan_componente}`)
          }
        } else {
          setError("Esta pantalla no tiene un componente asignado")
        }

        setLoading(false)
      } catch (err) {
        console.error("[v0] Error al cargar la pantalla:", err)
        setError("Error al cargar la pantalla. Por favor, intente nuevamente.")
        setLoading(false)
      }
    }

    if (pan_cod) {
      fetchPantalla()
    }
  }, [pan_cod])

  if (loading) {
    return (
      <div className="pantalla-viewer-loading">
        <CSpinner color="primary" size="lg" />
        <p className="mt-3">Cargando pantalla...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pantalla-error">
        <CAlert color="danger">{error}</CAlert>
        <CButton color="primary" onClick={() => navigate("/pantallas")}>
          <CIcon icon={cilArrowLeft} className="me-2" />
          Volver a Pantallas
        </CButton>
      </div>
    )
  }

  if (!pantalla || !ComponentToRender) {
    return (
      <div className="pantalla-error">
        <CAlert color="warning">No se pudo cargar la pantalla</CAlert>
        <CButton color="primary" onClick={() => navigate("/pantallas")}>
          <CIcon icon={cilArrowLeft} className="me-2" />
          Volver a Pantallas
        </CButton>
      </div>
    )
  }

  const plantillaStyles = pantalla.Plantillum
    ? {
        backgroundImage: pantalla.Plantillum.plan_imagen ? `url(${pantalla.Plantillum.plan_imagen})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: pantalla.Plantillum.plan_config?.colorFondo || "#ffffff",
        color: pantalla.Plantillum.plan_config?.colorTexto || "#000000",
        fontFamily: pantalla.Plantillum.plan_config?.fuenteTexto || "Arial",
      }
    : {}

  // Configuración combinada (plantilla + pantalla)
  const config = {
    ...(pantalla.Plantillum?.plan_config || {}),
    ...(pantalla.pan_config || {}),
  }

  return (
    <div className="pantalla-viewer" style={plantillaStyles}>
      <div className="pantalla-viewer-header">
        <CButton color="light" size="sm" onClick={() => navigate("/pantallas")} className="back-button">
          <CIcon icon={cilArrowLeft} className="me-2" />
          Volver
        </CButton>
        <h2 className="pantalla-viewer-title">{pantalla.pan_nomb}</h2>
      </div>

      <div className="pantalla-viewer-content">
        <ComponentToRender {...config} plantilla={pantalla.Plantillum} />
      </div>
    </div>
  )
}

export default PantallaViewer
