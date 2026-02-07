import { useState, useEffect } from "react"
import insumosService from "../../services/insumos.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import "./AjustarStockModal.css"

export default function AjustarStockModal({ isOpen, onClose, onSuccess, insumo }) {
  const [cantidadNueva, setCantidadNueva] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (insumo && isOpen) {
      setCantidadNueva(Number(insumo.stock_actual).toFixed(2))
      setObservaciones('')
    }
  }, [insumo, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cantidadNueva === '' || cantidadNueva === null) {
      notifyError("Ingresá la nueva cantidad de stock")
      return
    }

    const nueva = Number(cantidadNueva)
    const actual = Number(insumo.stock_actual)

    if (nueva === actual) {
      notifyError("La cantidad nueva es igual a la actual")
      return
    }

    try {
      setLoading(true)

      await insumosService.ajustarStock(
        insumo.insumo_id,
        nueva,
        observaciones || null
      )

      const diferencia = nueva - actual
      const mensaje = diferencia > 0 
        ? `Stock incrementado en ${diferencia.toFixed(2)} ${insumo.unidad_medida}`
        : `Stock reducido en ${Math.abs(diferencia).toFixed(2)} ${insumo.unidad_medida}`

      notifySuccess(mensaje)
      onSuccess()
    } catch (err) {
      console.error("Error ajustando stock:", err)
      notifyError(err.response?.data?.error || "Error al ajustar stock")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !insumo) return null

  const nueva = Number(cantidadNueva) || 0
  const actual = Number(insumo.stock_actual)
  const diferencia = nueva - actual

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ajustar-stock" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h3>⚖️ Ajustar Stock</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            <div className="insumo-info">
              <h4>{insumo.insumo_nombre}</h4>
              <p>Unidad: <strong>{insumo.unidad_medida}</strong></p>
            </div>

            <div className="stock-actual-info">
              <div className="info-item">
                <span className="label">Stock Actual:</span>
                <span className="valor actual">{actual.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Stock Mínimo:</span>
                <span className="valor minimo">{Number(insumo.stock_minimo).toFixed(2)}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cantidad_nueva">Nueva Cantidad *</label>
              <input
                id="cantidad_nueva"
                type="number"
                step="0.01"
                value={cantidadNueva}
                onChange={(e) => setCantidadNueva(e.target.value)}
                className="form-input cantidad-input"
                autoFocus
              />
            </div>

            {diferencia !== 0 && (
              <div className={`diferencia-preview ${diferencia > 0 ? 'positiva' : 'negativa'}`}>
                <span className="icono">{diferencia > 0 ? '📈' : '📉'}</span>
                <div className="diferencia-info">
                  <span className="label">
                    {diferencia > 0 ? 'Incremento' : 'Reducción'}:
                  </span>
                  <span className="valor">
                    {diferencia > 0 ? '+' : ''}{diferencia.toFixed(2)} {insumo.unidad_medida}
                  </span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="form-textarea"
                placeholder="Motivo del ajuste (opcional)"
                rows="3"
              />
            </div>

          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || diferencia === 0}
            >
              {loading ? 'Guardando...' : 'Ajustar Stock'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}