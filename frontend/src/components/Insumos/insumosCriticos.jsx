import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import insumosService from "../../services/insumos.service"
import { notifyError } from "../../utils/toast"
import { ToastContainer } from "react-toastify"
import "./InsumosCriticos.css"

export default function InsumosCriticos({ sucCod }) {
  const navigate = useNavigate()
  const [criticos, setCriticos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarCriticos()
    // Recargar cada 2 minutos
    const interval = setInterval(cargarCriticos, 120000)
    return () => clearInterval(interval)
  }, [sucCod])

  const cargarCriticos = async () => {
    try {
      setLoading(true)
      const response = await insumosService.getInsumosCriticos(sucCod)
      setCriticos(response.data)
    } catch (err) {
      console.error("Error cargando insumos críticos:", err)
      notifyError("Error al cargar insumos críticos")
    } finally {
      setLoading(false)
    }
  }

  const getEstadoStock = (insumo) => {
    const actual = Number(insumo.stock_actual)
    const minimo = Number(insumo.stock_minimo)

    if (actual < 0) return { 
      clase: 'negativo', 
      texto: 'NEGATIVO', 
      icono: '🚨',
      prioridad: 1 
    }
    if (actual === 0) return { 
      clase: 'agotado', 
      texto: 'AGOTADO', 
      icono: '❌',
      prioridad: 2 
    }
    if (actual <= minimo) return { 
      clase: 'critico', 
      texto: 'CRÍTICO', 
      icono: '⚠️',
      prioridad: 3 
    }
    return { 
      clase: 'bajo', 
      texto: 'BAJO', 
      icono: '⚡',
      prioridad: 4 
    }
  }

  const getCantidadFaltante = (insumo) => {
    const actual = Number(insumo.stock_actual)
    const minimo = Number(insumo.stock_minimo)
    const faltante = minimo - actual
    return faltante > 0 ? faltante : 0
  }

  const handleIrAGestion = () => {
    navigate('/insumos')
  }

  if (loading) {
    return (
      <div className="criticos-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <>
      <div className="criticos-container">
        
        {/* Header */}
        <div className="criticos-header">
          <div>
            <h1>⚠️ Insumos Críticos</h1>
            <p className="criticos-subtitle">
              Insumos con stock bajo o agotado
            </p>
          </div>
          <button className="btn-gestion" onClick={handleIrAGestion}>
            📦 Ir a Gestión de Insumos
          </button>
        </div>

        {/* Resumen */}
        <div className="criticos-resumen">
          <div className="resumen-card total">
            <div className="resumen-icono">📊</div>
            <div className="resumen-info">
              <span className="resumen-valor">{criticos.length}</span>
              <span className="resumen-label">Total Críticos</span>
            </div>
          </div>

          <div className="resumen-card negativos">
            <div className="resumen-icono">🚨</div>
            <div className="resumen-info">
              <span className="resumen-valor">
                {criticos.filter(i => Number(i.stock_actual) < 0).length}
              </span>
              <span className="resumen-label">Stock Negativo</span>
            </div>
          </div>

          <div className="resumen-card agotados">
            <div className="resumen-icono">❌</div>
            <div className="resumen-info">
              <span className="resumen-valor">
                {criticos.filter(i => Number(i.stock_actual) === 0).length}
              </span>
              <span className="resumen-label">Agotados</span>
            </div>
          </div>

          <div className="resumen-card criticos-count">
            <div className="resumen-icono">⚠️</div>
            <div className="resumen-info">
              <span className="resumen-valor">
                {criticos.filter(i => {
                  const actual = Number(i.stock_actual)
                  const minimo = Number(i.stock_minimo)
                  return actual > 0 && actual <= minimo
                }).length}
              </span>
              <span className="resumen-label">Por Debajo Mínimo</span>
            </div>
          </div>
        </div>

        {/* Lista de Insumos Críticos */}
        {criticos.length === 0 ? (
          <div className="criticos-empty">
            <div className="empty-icon">✅</div>
            <h3>¡Excelente!</h3>
            <p>No hay insumos con stock crítico</p>
          </div>
        ) : (
          <div className="criticos-grid">
            {criticos
              .sort((a, b) => {
                const estadoA = getEstadoStock(a)
                const estadoB = getEstadoStock(b)
                return estadoA.prioridad - estadoB.prioridad
              })
              .map((insumo) => {
                const estado = getEstadoStock(insumo)
                const faltante = getCantidadFaltante(insumo)

                return (
                  <div key={insumo.insumo_id} className={`critico-card ${estado.clase}`}>
                    
                    <div className="critico-header">
                      <div className="critico-icono">{estado.icono}</div>
                      <div className="critico-estado">
                        <span className={`estado-badge ${estado.clase}`}>
                          {estado.texto}
                        </span>
                      </div>
                    </div>

                    <div className="critico-body">
                      <h4 className="critico-nombre">{insumo.insumo_nombre}</h4>
                      
                      <div className="critico-stocks">
                        <div className="stock-item">
                          <span className="label">Stock Actual:</span>
                          <span className={`valor ${estado.clase}`}>
                            {Number(insumo.stock_actual).toFixed(2)} {insumo.unidad_medida}
                          </span>
                        </div>
                        <div className="stock-item">
                          <span className="label">Stock Mínimo:</span>
                          <span className="valor minimo">
                            {Number(insumo.stock_minimo).toFixed(2)} {insumo.unidad_medida}
                          </span>
                        </div>
                        {faltante > 0 && (
                          <div className="stock-item faltante">
                            <span className="label">Faltante:</span>
                            <span className="valor">
                              {faltante.toFixed(2)} {insumo.unidad_medida}
                            </span>
                          </div>
                        )}
                      </div>

                      {insumo.insumo_descripcion && (
                        <p className="critico-descripcion">
                          {insumo.insumo_descripcion}
                        </p>
                      )}
                    </div>

                    <div className="critico-footer">
                      <button 
                        className="btn-reposicion"
                        onClick={handleIrAGestion}
                      >
                        📋 Gestionar
                      </button>
                    </div>

                  </div>
                )
              })}
          </div>
        )}

      </div>

      <ToastContainer />
    </>
  )
}