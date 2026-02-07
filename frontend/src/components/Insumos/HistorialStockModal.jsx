import { useState, useEffect } from "react"
import insumosService from "../../services/insumos.service"
import { notifyError } from "../../utils/toast"
import "./HistorialStockModal.css"

export default function HistorialStockModal({ isOpen, onClose, insumo }) {
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && insumo) {
      cargarHistorial()
    }
  }, [isOpen, insumo])

  const cargarHistorial = async () => {
    try {
      setLoading(true)
      const response = await insumosService.getHistorialStock(insumo.insumo_id, 50)
      setHistorial(response.data)
    } catch (err) {
      console.error("Error cargando historial:", err)
      notifyError("Error al cargar el historial")
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
      minute: '2-digit'
    })
  }

  const getTipoLabel = (tipo) => {
    const labels = {
      'VENTA': { texto: 'Venta', icono: '🛒', clase: 'venta' },
      'AJUSTE_MANUAL': { texto: 'Ajuste Manual', icono: '⚖️', clase: 'ajuste' },
      'INVENTARIO_INICIAL': { texto: 'Inventario Inicial', icono: '📦', clase: 'inicial' }
    }
    return labels[tipo] || { texto: tipo, icono: '❓', clase: 'otro' }
  }

  if (!isOpen || !insumo) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content historial-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h3>📋 Historial de Movimientos</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          
          <div className="insumo-info">
            <h4>{insumo.insumo_nombre}</h4>
            <p>
              Stock actual: <strong>{Number(insumo.stock_actual).toFixed(2)} {insumo.unidad_medida}</strong>
            </p>
          </div>

          {loading ? (
            <div className="historial-loading">
              <div className="spinner"></div>
              <p>Cargando historial...</p>
            </div>
          ) : historial.length === 0 ? (
            <div className="historial-empty">
              <p>No hay movimientos registrados</p>
            </div>
          ) : (
            <div className="historial-tabla-container">
              <table className="historial-tabla">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Anterior</th>
                    <th>Movimiento</th>
                    <th>Nuevo</th>
                    <th>Usuario</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((mov) => {
                    const tipo = getTipoLabel(mov.tipo_movimiento)
                    const esPositivo = Number(mov.cantidad_movimiento) > 0

                    return (
                      <tr key={mov.historial_id}>
                        <td>{formatearFecha(mov.fecha_movimiento)}</td>
                        <td>
                          <span className={`tipo-badge ${tipo.clase}`}>
                            {tipo.icono} {tipo.texto}
                          </span>
                        </td>
                        <td>{Number(mov.cantidad_anterior).toFixed(2)}</td>
                        <td>
                          <span className={`movimiento ${esPositivo ? 'positivo' : 'negativo'}`}>
                            {esPositivo ? '+' : ''}{Number(mov.cantidad_movimiento).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <strong>{Number(mov.cantidad_nueva).toFixed(2)}</strong>
                        </td>
                        <td>{mov.Usuario?.us_nomape || '-'}</td>
                        <td>
                          <span className="observaciones">
                            {mov.observaciones || '-'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>

      </div>
    </div>
  )
}