import { useState } from "react"
import { posApi } from "../../services/pos.service"
import { notifyError } from "../../utils/toast" // Solo dejamos Error aquí, el Success lo da el padre
import PagoModal from "./PagoModal"
import "./CerrarVentaButton.css"

export default function CerrarVentaButton({ venta, onVentaCerrada }) {
  const [showPagoModal, setShowPagoModal] = useState(false)

  const handleConfirmarPago = async (pagos) => {
    try {
      await posApi.cerrarVenta(venta.venta_id, pagos)
      setShowPagoModal(false)
      // Ejecutamos el callback del padre que ya tiene el notifySuccess y limpia la venta
      onVentaCerrada() 
    } catch (err) {
      console.error("Error cerrando venta:", err)
      notifyError(err.response?.data?.error || "Error al cerrar venta")
    }
  }

  const puedeCerrar = venta.Items && venta.Items.length > 0

  return (
    <>
      <button
        className="btn-cerrar-venta"
        onClick={() => setShowPagoModal(true)}
        disabled={!puedeCerrar}
      >
        ✅ Finalizar Venta
      </button>

      <PagoModal
        venta={venta}
        isOpen={showPagoModal}
        onClose={() => setShowPagoModal(false)}
        onConfirm={handleConfirmarPago}
      />
    </>
  )
}