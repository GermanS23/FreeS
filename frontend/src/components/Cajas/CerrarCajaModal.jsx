import { useState, useEffect } from "react"
import cajasService from "../../services/cajas.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import "./CerrarCajaModal.css"

export default function CerrarCajaModal({ isOpen, onClose, onCajaCerrada, caja }) {
  const [resumen, setResumen] = useState(null)
  const [efectivoReal, setEfectivoReal] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && caja) {
      cargarResumen()
    }
  }, [isOpen, caja])

  const cargarResumen = async () => {
    try {
      setLoading(true)
      const response = await cajasService.getResumenCaja(caja.caja_id)
      setResumen(response.data)
      // Precargar efectivo esperado
      setEfectivoReal(response.data.efectivo_esperado.toFixed(2))
    } catch (err) {
      console.error("Error cargando resumen:", err)
      notifyError("Error al cargar resumen de caja")
    } finally {
      setLoading(false)
    }
  }

  const handleCerrar = async () => {
    if (!efectivoReal || Number(efectivoReal) < 0) {
      notifyError("Ingresá el monto de efectivo real")
      return
    }

    try {
      const response = await cajasService.cerrarCaja(caja.caja_id, {
        monto_efectivo_real: Number(efectivoReal),
        observaciones
      })

      notifySuccess("✅ Caja cerrada exitosamente")
      onCajaCerrada(response.data)
      onClose()
    } catch (err) {
      console.error("Error cerrando caja:", err)
      notifyError(err.response?.data?.error || "Error al cerrar caja")
    }
  }

  if (!isOpen) return null

  const diferencia = resumen ? Number(efectivoReal) - resumen.efectivo_esperado : 0
  const tieneDiferencia = Math.abs(diferencia) > 0.01

  return (
    <div className="cerrar-caja-modal-overlay" onClick={onClose}>
      <div className="cerrar-caja-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="cerrar-caja-modal-header">
          <h3>💰 Arqueo de Caja</h3>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="cerrar-caja-modal-body">
          
          {loading ? (
            <p>Cargando resumen...</p>
          ) : resumen ? (
            <>
              {/* Resumen de ventas */}
              <div className="arqueo-resumen">
                <h4>📊 Resumen del Turno</h4>
                
                <div className="resumen-row">
                  <span>Cantidad de ventas:</span>
                  <strong>{resumen.cantidad_ventas}</strong>
                </div>
                
                <div className="resumen-row">
                  <span>Total vendido:</span>
                  <strong>${resumen.total_ventas.toFixed(2)}</strong>
                </div>

                <div className="resumen-row">
                  <span>Monto inicial:</span>
                  <strong>${resumen.caja_monto_inicial.toFixed(2)}</strong>
                </div>
              </div>

              {/* Pagos por método */}
              {resumen.pagos_por_metodo.length > 0 && (
                <div className="arqueo-metodos">
                  <h4>💳 Pagos por Método</h4>
                  {resumen.pagos_por_metodo.map((metodo, idx) => (
                    <div key={idx} className="metodo-row">
                      <span>{metodo.metodo}</span>
                      <strong>${metodo.total.toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Arqueo de efectivo */}
              <div className="arqueo-efectivo">
                <h4>💵 Arqueo de Efectivo</h4>
                
                <div className="efectivo-row destacado">
                  <span>Efectivo esperado:</span>
                  <strong>${resumen.efectivo_esperado.toFixed(2)}</strong>
                </div>

                <div className="form-group">
                  <label htmlFor="efectivo-real">Efectivo Real (Contar caja)</label>
                  <input
                    id="efectivo-real"
                    type="number"
                    step="0.01"
                    value={efectivoReal}
                    onChange={(e) => setEfectivoReal(e.target.value)}
                    className="input-efectivo"
                    autoFocus
                  />
                </div>

                {tieneDiferencia && (
                  <div className={`diferencia ${diferencia > 0 ? 'sobrante' : 'faltante'}`}>
                    <span>{diferencia > 0 ? 'Sobrante:' : 'Faltante:'}</span>
                    <strong>${Math.abs(diferencia).toFixed(2)}</strong>
                  </div>
                )}
              </div>

              {/* Observaciones */}
              <div className="form-group">
                <label htmlFor="observaciones">Observaciones (opcional)</label>
                <textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="input-observaciones"
                  placeholder="Comentarios sobre el arqueo..."
                  rows="3"
                />
              </div>
            </>
          ) : (
            <p>No se pudo cargar el resumen</p>
          )}

        </div>

        <div className="cerrar-caja-modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn-cerrar-caja" 
            onClick={handleCerrar}
            disabled={loading}
          >
            Cerrar Caja
          </button>
        </div>

      </div>
    </div>
  )
}