"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CRow,
  CCol,
  CContainer,
  CSpinner,
  CAlert,
  CBadge,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import PantallasService from "../../services/pantalla.service"
import { getComponent } from "./Registro"
import "./PantallaDisplay.css"

const PantallasDisplay = () => {
  const navigate = useNavigate()
  const [pantallas, setPantallas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPantallasActivas()
  }, [])

  const fetchPantallasActivas = async () => {
    try {
      setLoading(true)
      const response = await PantallasService.getPantallasActivas()
      console.log("[v0] Pantallas activas cargadas:", response.data)
      setPantallas(response.data)
      setLoading(false)
    } catch (err) {
      console.error("[v0] Error al cargar pantallas:", err)
      setError("Error al cargar las pantallas disponibles.")
      setLoading(false)
    }
  }

  const handlePantallaClick = (pantalla) => {
    navigate(`/pantalla-viewer/${pantalla.pan_cod}`)
  }

  const getComponentInfo = (componentId) => {
    return getComponent(componentId)
  }

  const formatLastUpdate = (date) => {
    if (!date) return "Reciente"
    const now = new Date()
    const updateDate = new Date(date)
    const diffInMinutes = Math.floor((now - updateDate) / (1000 * 60))

    if (diffInMinutes < 1) return "Ahora mismo"
    if (diffInMinutes < 60) return `hace ${diffInMinutes} minutos`
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} horas`
    return `hace ${Math.floor(diffInMinutes / 1440)} días`
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger">{error}</CAlert>
      </CContainer>
    )
  }

  return (
    <div className="pantallas-display-container">
      <CContainer fluid>
        <CCard className="mb-4 border-0 shadow-sm">
          <CCardHeader className="bg-white border-bottom">
            <CCardTitle className="display-title d-flex align-items-center mb-0">
              <CIcon className="me-2" size="lg" />
              Pantallas Disponibles
            </CCardTitle>
          </CCardHeader>
          <CCardBody>
            {pantallas.length === 0 ? (
              <div className="text-center p-5">
                <CIcon size="3xl" className="text-muted mb-3" />
                <p className="text-muted fs-5">No hay pantallas activas disponibles</p>
              </div>
            ) : (
              <CRow className="g-4">
                {pantallas.map((pantalla) => {
                  const componentInfo = getComponentInfo(pantalla.pan_componente)
                  return (
                    <CCol key={pantalla.pan_cod} xs={12} sm={6} lg={4} xl={3}>
                      <div className="pantalla-card h-100" onClick={() => handlePantallaClick(pantalla)}>
                        <div className="pantalla-thumbnail">
                          {pantalla.Plantillum?.plan_imagen ? (
                            <img
                              src={pantalla.Plantillum.plan_imagen || "/placeholder.svg"}
                              alt={pantalla.pan_nomb}
                              className="thumbnail-image"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : componentInfo?.previewImage ? (
                            <img
                              src={componentInfo.previewImage || "/placeholder.svg"}
                              alt={pantalla.pan_nomb}
                              className="thumbnail-image"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className="thumbnail-placeholder"
                            style={{
                              display:
                                pantalla.Plantillum?.plan_imagen || componentInfo?.previewImage ? "none" : "flex",
                            }}
                          >
                            <CIcon size="xl" />
                          </div>
                          <div className="play-overlay">
                            <CIcon  className="play-icon" />
                          </div>
                          <div className="duration-badge">
                            <CIcon className="me-1" size="sm" />
                            En vivo
                          </div>
                        </div>

                        <div className="pantalla-info">
                          <h3 className="pantalla-title">{pantalla.pan_nomb}</h3>

                          <div className="pantalla-meta">
                            <div className="component-info mb-2">
                              <CBadge color="primary" className="me-2">
                                {componentInfo?.name || "Componente personalizado"}
                              </CBadge>
                              {pantalla.Plantillum && (
                                <CBadge color="secondary">{pantalla.Plantillum.plan_nomb}</CBadge>
                              )}
                            </div>

                            <div className="pantalla-stats">
                              <span className="stat-item">
                                <CIcon  className="me-1" size="sm" />
                                {formatLastUpdate(pantalla.updatedAt || pantalla.createdAt)}
                              </span>
                            </div>
                          </div>

                          {pantalla.pan_desc && <p className="pantalla-description">{pantalla.pan_desc}</p>}
                        </div>
                      </div>
                    </CCol>
                  )
                })}
              </CRow>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}

export default PantallasDisplay
