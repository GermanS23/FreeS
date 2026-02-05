import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { posApi } from "../../services/pos.service"
import { notifyError } from "../../utils/toast"
import { ToastContainer } from "react-toastify"
import "./DetalleVenta.css"

export default function DetalleVenta() {
  const { ventaId } = useParams()
  const navigate = useNavigate()
  const [venta, setVenta] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDetalle()
  }, [ventaId])

  const cargarDetalle = async () => {
    try {
      setLoading(true)
      const response = await posApi.getVentaById(ventaId)
      setVenta(response)
    } catch (err) {
      console.error("Error cargando detalle:", err)
      notifyError("Error al cargar el detalle de la venta")
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
    if (!venta?.venta_fecha_cierre) return "En curso"
    
    const inicio = new Date(venta.venta_fecha)
    const fin = new Date(venta.venta_fecha_cierre)
    const diff = fin - inicio
    
    const minutos = Math.floor(diff / (1000 * 60))
    const segundos = Math.floor((diff % (1000 * 60)) / 1000)
    
    if (minutos === 0) return `${segundos}s`
    return `${minutos}m ${segundos}s`
  }

  if (loading) {
    return (
      <div className="detalle-venta-loading">
        <div className="spinner"></div>
        <p>Cargando información...</p>
      </div>
    )
  }

  if (!venta) {
    return (
      <div className="detalle-venta-error">
        <h2>❌ Venta no encontrada</h2>
        <button onClick={() => navigate(-1)} className="btn-volver">
          ← Volver
        </button>
      </div>
    )
  }

  // Calcular totales
  const cantidadItems = venta.Items?.reduce((sum, item) => sum + item.cantidad, 0) || 0
  const tieneDescuento = venta.Descuentos && venta.Descuentos.length > 0
  const descuento = tieneDescuento ? venta.Descuentos[0] : null

  return (
    <>
      <div className="detalle-venta-container">
        {/* Header */}
        <div className="detalle-venta-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Volver
          </button>
          <div className="header-info">
            <h1>Venta #{venta.venta_id}</h1>
            <span className={`estado-badge ${venta.venta_estado.toLowerCase()}`}>
              {venta.venta_estado}
            </span>
          </div>
        </div>

        {/* Grid de información */}
        <div className="detalle-venta-grid">
          
          {/* Card: Información General */}
          <div className="detalle-venta-card">
            <h3>📋 Información General</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Fecha de Venta:</span>
                <strong>{formatearFecha(venta.venta_fecha)}</strong>
              </div>
              {venta.venta_fecha_cierre && (
                <>
                  <div className="info-item">
                    <span className="label">Fecha de Cierre:</span>
                    <strong>{formatearFecha(venta.venta_fecha_cierre)}</strong>
                  </div>
                  <div className="info-item">
                    <span className="label">Duración:</span>
                    <strong>{calcularDuracion()}</strong>
                  </div>
                </>
              )}
              <div className="info-item">
                <span className="label">Caja ID:</span>
                <strong>#{venta.caja_id || 'N/A'}</strong>
              </div>
              <div className="info-item">
                <span className="label">Cantidad de Productos:</span>
                <strong>{cantidadItems} items</strong>
              </div>
            </div>
          </div>

          {/* Card: Resumen de Montos */}
          <div className="detalle-venta-card">
            <h3>💰 Resumen de Montos</h3>
            <div className="resumen-montos">
              <div className="monto-item">
                <span className="label">Subtotal</span>
                <span className="monto">
                  ${Number(venta.venta_subtotal).toFixed(2)}
                </span>
              </div>
              
              {Number(venta.descuento) > 0 && (
                <div className="monto-item descuento">
                  <span className="label">Descuento</span>
                  <span className="monto">
                    -${Number(venta.descuento).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="monto-item total">
                <span className="label">TOTAL</span>
                <span className="monto">
                  ${Number(venta.venta_total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Detalle de Descuento */}
          {tieneDescuento && (
            <div className="detalle-venta-card full-width">
              <h3>🎫 Descuento Aplicado</h3>
              <div className="descuento-info">
                <div className="descuento-item">
                  <span className="label">Tipo:</span>
                  <span className="badge-descuento">
                    {descuento.tipo_descuento}
                  </span>
                </div>
                <div className="descuento-item">
                  <span className="label">Valor:</span>
                  <strong>
                    {descuento.tipo_descuento === 'PORCENTAJE' 
                      ? `${descuento.valor_descuento}%`
                      : `$${Number(descuento.valor_descuento).toFixed(2)}`
                    }
                  </strong>
                </div>
                <div className="descuento-item">
                  <span className="label">Importe Aplicado:</span>
                  <strong className="monto-descuento">
                    -${Number(descuento.importe_aplicado).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Card: Productos */}
          <div className="detalle-venta-card full-width">
            <h3>🛒 Productos ({venta.Items?.length || 0})</h3>
            
            {!venta.Items || venta.Items.length === 0 ? (
              <p className="no-items">No hay productos en esta venta</p>
            ) : (
              <div className="items-tabla-container">
                <table className="items-tabla">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Precio Unit.</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venta.Items.map((item) => (
                      <tr key={item.venta_items_id}>
                        <td>
                          <span className="item-id">#{item.venta_items_id}</span>
                        </td>
                        <td>
                          <strong>{item.nombre}</strong>
                        </td>
                        <td>${Number(item.precio_unitario).toFixed(2)}</td>
                        <td>
                          <span className="cantidad-badge">x{item.cantidad}</span>
                        </td>
                        <td className="subtotal-item">
                          ${Number(item.subtotal).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3"></td>
                      <td><strong>SUBTOTAL:</strong></td>
                      <td className="total-footer">
                        ${Number(venta.venta_subtotal).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Card: Métodos de Pago */}
          {venta.Pagos && venta.Pagos.length > 0 && (
            <div className="detalle-venta-card full-width">
              <h3>💳 Métodos de Pago ({venta.Pagos.length})</h3>
              
              <div className="pagos-grid">
                {venta.Pagos.map((pago, idx) => (
                  <div key={idx} className="pago-card">
                    <div className="pago-metodo">
                      <span className="metodo-icon">
                        {pago.MetodoPago?.mp_nombre === 'Efectivo' ? '💵' : 
                         pago.MetodoPago?.mp_nombre === 'Tarjeta' ? '💳' : 
                         pago.MetodoPago?.mp_nombre === 'Transferencia' ? '🏦' : '💰'}
                      </span>
                      <div>
                        <p className="metodo-nombre">
                          {pago.MetodoPago?.mp_nombre || 'Sin nombre'}
                        </p>
                        <p className="metodo-monto">
                          ${Number(pago.vp_monto).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pagos-resumen">
                <span className="label">Total Pagado:</span>
                <span className="total-pagado">
                  ${venta.Pagos.reduce((sum, p) => sum + Number(p.vp_monto), 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      <ToastContainer />
    </>
  )
}