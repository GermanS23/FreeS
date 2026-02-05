import { useState } from "react"
import cajasService from "../../services/cajas.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import "./AbrirCajaModal.css"

export default function AbrirCajaModal({ isOpen, onClose, onCajaAbierta, sucCod, usCod }) {
  const [montoInicial, setMontoInicial] = useState('0')

  const handleAbrir = async () => {
    try {
      const response = await cajasService.abrirCaja({
        suc_cod: sucCod,
        us_cod: usCod,
        monto_inicial: Number(montoInicial)
      })

      notifySuccess("✅ Caja abierta exitosamente")
      onCajaAbierta(response.data)
      onClose()
    } catch (err) {
      console.error("Error abriendo caja:", err)
      notifyError(err.response?.data?.error || "Error al abrir caja")
    }
  }

  if (!isOpen) return null

  return (
    <div className="abrir-caja-modal-overlay" onClick={onClose}>
      <div className="abrir-caja-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="abrir-caja-modal-header">
          <h3>🏦 Abrir Caja</h3>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="abrir-caja-modal-body">
          <p className="abrir-caja-descripcion">
            Ingresá el monto inicial en efectivo con el que comenzarás el turno.
          </p>

          <div className="form-group">
            <label htmlFor="monto-inicial">Monto Inicial (Efectivo)</label>
            <input
              id="monto-inicial"
              type="number"
              step="0.01"
              min="0"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
              className="input-monto"
              placeholder="0.00"
              autoFocus
            />
          </div>
        </div>

        <div className="abrir-caja-modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-abrir" onClick={handleAbrir}>
            Abrir Caja
          </button>
        </div>

      </div>
    </div>
  )
}