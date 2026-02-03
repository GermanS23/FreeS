import { useState, useEffect } from "react"
import metodospagoService from "../../services/metodospago.service"
import { notifyError } from "../../utils/toast"
import "./PagoModal.css"

export default function PagoModal({ venta, isOpen, onClose, onConfirm }) {
  const [metodosPago, setMetodosPago] = useState([])
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar métodos de pago disponibles
  useEffect(() => {
    const cargarMetodos = async () => {
      try {
        const response = await metodospagoService.getActivos()
        setMetodosPago(response.data)
        
        // Inicializar con un pago vacío
        if (response.data.length > 0) {
          setPagos([{
            mp_cod: response.data[0].mp_cod,
            monto: Number(venta.venta_total).toFixed(2)
          }])
        }
      } catch (err) {
        console.error("Error cargando métodos de pago:", err)
        notifyError("Error al cargar métodos de pago")
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      cargarMetodos()
    }
  }, [isOpen, venta])

  // =========================
  // HANDLERS
  // =========================

  const agregarPago = () => {
    if (metodosPago.length === 0) return

    const totalPagado = calcularTotalPagos()
    const restante = Number(venta.venta_total) - totalPagado

    setPagos([...pagos, {
      mp_cod: metodosPago[0].mp_cod,
      monto: restante > 0 ? restante.toFixed(2) : '0.00'
    }])
  }

  const eliminarPago = (index) => {
    if (pagos.length === 1) {
      notifyError("Debe haber al menos un método de pago")
      return
    }
    setPagos(pagos.filter((_, i) => i !== index))
  }

  const actualizarPago = (index, field, value) => {
    const nuevosPagos = [...pagos]
    nuevosPagos[index][field] = value
    setPagos(nuevosPagos)
  }

  const calcularTotalPagos = () => {
    return pagos.reduce((sum, p) => sum + Number(p.monto || 0), 0)
  }

  const handleConfirmar = () => {
    const total = Number(venta.venta_total)
    const totalPagos = calcularTotalPagos()

    // Validar que coincidan
    if (Math.abs(totalPagos - total) > 0.01) {
      notifyError(
        `El total de pagos ($${totalPagos.toFixed(2)}) debe coincidir con el total de la venta ($${total.toFixed(2)})`
      )
      return
    }

    // Validar que todos tengan monto > 0
    if (pagos.some(p => Number(p.monto) <= 0)) {
      notifyError("Todos los montos deben ser mayores a 0")
      return
    }

    onConfirm(pagos)
  }

  // =========================
  // RENDER
  // =========================

  if (!isOpen) return null

  const total = Number(venta.venta_total)
  const totalPagos = calcularTotalPagos()
  const diferencia = total - totalPagos

  return (
    <div className="pago-modal-overlay" onClick={onClose}>
      <div className="pago-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="pago-modal-header">
          <h3>💳 Métodos de Pago</h3>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="pago-modal-body">
          
          {/* Resumen de venta */}
          <div className="pago-resumen">
            <div className="pago-resumen-row">
              <span>Total de la venta:</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <div className="pago-resumen-row">
              <span>Total pagado:</span>
              <strong className={diferencia === 0 ? 'text-success' : 'text-warning'}>
                ${totalPagos.toFixed(2)}
              </strong>
            </div>
            {diferencia !== 0 && (
              <div className="pago-resumen-row diferencia">
                <span>{diferencia > 0 ? 'Falta:' : 'Excede:'}</span>
                <strong>${Math.abs(diferencia).toFixed(2)}</strong>
              </div>
            )}
          </div>

          {/* Lista de pagos */}
          {loading ? (
            <p>Cargando métodos...</p>
          ) : (
            <div className="pagos-list">
              {pagos.map((pago, index) => (
                <div key={index} className="pago-item">
                  <select
                    value={pago.mp_cod}
                    onChange={(e) => actualizarPago(index, 'mp_cod', e.target.value)}
                    className="pago-select"
                  >
                    {metodosPago.map(m => (
                      <option key={m.mp_cod} value={m.mp_cod}>
                        {m.mp_nombre}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={pago.monto}
                    onChange={(e) => actualizarPago(index, 'monto', e.target.value)}
                    className="pago-input"
                    placeholder="Monto"
                  />

                  {pagos.length > 1 && (
                    <button
                      className="btn-eliminar-pago"
                      onClick={() => eliminarPago(index)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}

              <button className="btn-agregar-pago" onClick={agregarPago}>
                ➕ Agregar método de pago
              </button>
            </div>
          )}

        </div>

        <div className="pago-modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-confirmar"
            onClick={handleConfirmar}
            disabled={Math.abs(diferencia) > 0.01}
          >
            Confirmar pago
          </button>
        </div>

      </div>
    </div>
  )
}