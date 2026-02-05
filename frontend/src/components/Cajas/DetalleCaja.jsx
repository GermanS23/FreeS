import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import cajasService from "../../services/cajas.service"
import { notifyError } from "../../utils/toast"
import { ToastContainer } from "react-toastify"
import "./DetalleCaja.css"

export default function DetalleCaja() {
  const { cajaId } = useParams()
  const navigate = useNavigate()
  const [caja, setCaja] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDetalle()
  }, [cajaId])

  const cargarDetalle = async () => {
    try {
      setLoading(true)
      const response = await cajasService.getCajaById(cajaId)
      setCaja(response.data)
    } catch (err) {
      console.error("Error cargando detalle:", err)
      notifyError("Error al cargar el detalle de la caja")
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const calcularDuracion = () => {
    if (!caja?.caja_fecha_cierre) return "En curso"
    
    const inicio = new Date(caja.caja_fecha_apertura)
    const fin = new Date(caja.caja_fecha_cierre)
    const diff = fin - inicio
    
    const horas = Math.floor(diff / (1000 * 60 * 60))
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${horas}h ${minutos}m`
  }

  const verDetalleVenta = (ventaId) => {
    navigate(`/ventas/detalle/${ventaId}`)
  }

  if (loading) {
    return (
      <div className="detalle-loading">
        <div className="spinner"></div>
        <p>Cargando información...</p>
      </div>
    )
  }

  if (!caja) {
    return (
      <div className="detalle-error">
        <h2>❌ Caja no encontrada</h2>
        <button onClick={() => navigate(-1)} className="btn-volver">
          ← Volver
        </button>
      </div>
    )
  }

  const diferencia = Number(caja.caja_diferencia || 0)
  const tieneDiferencia = Math.abs(diferencia) > 0.01

  return (
    <>
      <div className="detalle-caja-container">
        {/* Header */}
        <div className="detalle-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Volver
          </button>
          <div className="header-info">
            <h1>Caja #{caja.caja_id}</h1>
            <span className={`estado-badge ${caja.caja_estado.toLowerCase()}`}>
              {caja.caja_estado}
            </span>
          </div>
        </div>

        {/* Grid de información */}
        <div className="detalle-grid">
          
          {/* Card: Información General */}
          <div className="detalle-card">
            <h3>📋 Información General</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Cajero:</span>
                <strong>{caja.Usuario?.us_nomape || 'Sin asignar'}</strong>
              </div>
              <div className="info-item">
                <span className="label">Usuario:</span>
                <span>{caja.Usuario?.us_user}</span>
              </div>
              <div className="info-item">
                <span className="label">Fecha Apertura:</span>
                <strong>{formatearFecha(caja.caja_fecha_apertura)}</strong>
              </div>
              <div className="info-item">
                <span className="label">Fecha Cierre:</span>
                <strong>
                  {caja.caja_fecha_cierre 
                    ? formatearFecha(caja.caja_fecha_cierre)
                    : 'Aún no cerrada'
                  }
                </strong>
              </div>
              <div className="info-item">
                <span className="label">Duración:</span>
                <strong>{calcularDuracion()}</strong>
              </div>
            </div>
          </div>

          {/* Card: Resumen Financiero */}
          <div className="detalle-card">
            <h3>💰 Resumen Financiero</h3>
            <div className="resumen-financiero">
              <div className="resumen-item">
                <span className="label">Monto Inicial</span>
                <span className="monto">
                  ${Number(caja.caja_monto_inicial).toFixed(2)}
                </span>
              </div>
              
              <div className="resumen-item destacado">
                <span className="label">Total Ventas</span>
                <span className="monto grande">
                  ${Number(caja.caja_total_ventas).toFixed(2)}
                </span>
              </div>

              <div className="resumen-item">
                <span className="label">Efectivo Esperado</span>
                <span className="monto">
                  ${Number(caja.caja_total_efectivo_esperado).toFixed(2)}
                </span>
              </div>

              {caja.caja_estado === 'CERRADA' && (
                <>
                  <div className="resumen-item">
                    <span className="label">Efectivo Real (Contado)</span>
                    <span className="monto">
                      ${Number(caja.caja_total_efectivo_real).toFixed(2)}
                    </span>
                  </div>

                  <div className={`resumen-item diferencia ${
                    diferencia > 0 ? 'sobrante' : diferencia < 0 ? 'faltante' : 'exacto'
                  }`}>
                    <span className="label">
                      {diferencia > 0 ? '📈 Sobrante' : diferencia < 0 ? '📉 Faltante' : '✅ Exacto'}
                    </span>
                    <span className="monto">
                      {diferencia > 0 && '+'}
                      ${diferencia.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card: Observaciones */}
          {caja.caja_observaciones && (
            <div className="detalle-card full-width">
              <h3>📝 Observaciones</h3>
              <p className="observaciones-texto">{caja.caja_observaciones}</p>
            </div>
          )}

          {/* Card: Ventas */}
          <div className="detalle-card full-width">
            <h3>🛒 Ventas Registradas ({caja.Ventas?.length || 0})</h3>
            
            {!caja.Ventas || caja.Ventas.length === 0 ? (
              <p className="no-ventas">No hay ventas registradas en esta caja</p>
            ) : (
              <div className="ventas-tabla-container">
                <table className="ventas-tabla">
                  <thead>
                    <tr>
                      <th>ID Venta</th>
                      <th>Fecha</th>
                      <th>Subtotal</th>
                      <th>Descuento</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caja.Ventas.map((venta) => (
                      <tr key={venta.venta_id}>
                        <td>
                          <span className="venta-id">#{venta.venta_id}</span>
                        </td>
                        <td>{formatearFecha(venta.venta_fecha)}</td>
                        <td>${Number(venta.venta_subtotal).toFixed(2)}</td>
                        <td>
                          {Number(venta.descuento) > 0 
                            ? `-$${Number(venta.descuento).toFixed(2)}`
                            : '-'
                          }
                        </td>
                        <td className="monto-destacado">
                          ${Number(venta.venta_total).toFixed(2)}
                        </td>
                        <td>
                          <span className={`estado-venta ${venta.venta_estado.toLowerCase()}`}>
                            {venta.venta_estado}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-ver-venta"
                            onClick={() => verDetalleVenta(venta.venta_id)}
                          >
                            👁️ Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

      <ToastContainer />
    </>
  )
}