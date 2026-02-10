import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PantallasService from "../../services/pantalla.service"
import { getComponent } from "./Registro"
import "./PantallasPublicas.css"

export default function PantallasPublicas() {
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
      const response = await PantallasService.getPantallasPublicasActivas()
      setPantallas(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error al cargar pantallas:", err)
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

  const handleBackToLogin = () => {
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="pantallas-publicas-loading">
        <div className="spinner"></div>
        <p>Cargando pantallas disponibles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pantallas-publicas-error">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <button className="btn-volver" onClick={handleBackToLogin}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="pantallas-publicas-container">
      
      {/* Header */}
      <div className="pantallas-publicas-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🖥️ Pantallas Disponibles</h1>
            <p>Seleccioná una pantalla para visualizarla</p>
          </div>
          <button className="btn-login" onClick={handleBackToLogin}>
            🔐 Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Grid de Pantallas */}
      <div className="pantallas-publicas-content">
        {pantallas.length === 0 ? (
          <div className="pantallas-empty">
            <div className="empty-icon">🖥️</div>
            <h3>No hay pantallas activas disponibles</h3>
            <p>Volvé más tarde o contactá al administrador</p>
          </div>
        ) : (
          <div className="pantallas-grid">
            {pantallas.map((pantalla) => {
              const componentInfo = getComponentInfo(pantalla.pan_componente)
              
              return (
                <div 
                  key={pantalla.pan_cod} 
                  className="pantalla-card"
                  onClick={() => handlePantallaClick(pantalla)}
                >
                  <div className="pantalla-thumbnail">
                    {pantalla.Plantilla?.plan_imagen ? (
                      <img
                        src={`http://localhost:3000${pantalla.Plantilla.plan_imagen}`}
                        alt={pantalla.pan_nomb}
                        className="thumbnail-image"
                        onError={(e) => {
                          e.target.style.display = "none"
                          e.target.nextSibling.style.display = "flex"
                        }}
                      />
                    ) : componentInfo?.previewImage ? (
                      <img
                        src={componentInfo.previewImage}
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
                        display: pantalla.Plantilla?.plan_imagen || componentInfo?.previewImage ? "none" : "flex",
                      }}
                    >
                      <div className="placeholder-icon">🖥️</div>
                    </div>
                    
                    <div className="play-overlay">
                      <div className="play-icon">▶️</div>
                    </div>
                    
                    <div className="duration-badge">
                      ▶️ En vivo
                    </div>
                  </div>

                  <div className="pantalla-info">
                    <h3 className="pantalla-title">{pantalla.pan_nomb}</h3>

                    <div className="pantalla-meta">
                      <div className="component-info">
                        <span className="badge badge-primary">
                          {componentInfo?.name || "Componente personalizado"}
                        </span>
                        {pantalla.Plantilla && (
                          <span className="badge badge-secondary">
                            {pantalla.Plantilla.plan_nomb}
                          </span>
                        )}
                      </div>

                      <div className="pantalla-stats">
                        <span className="stat-item">
                          🕐 {formatLastUpdate(pantalla.updatedAt || pantalla.createdAt)}
                        </span>
                      </div>
                    </div>

                    {pantalla.pan_desc && (
                      <p className="pantalla-description">{pantalla.pan_desc}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}