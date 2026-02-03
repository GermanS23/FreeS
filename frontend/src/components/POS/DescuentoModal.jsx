import { posApi } from "../../services/pos.service"
import "./DescuentoModal.css"

export default function DescuentoModal({ venta, onVentaUpdate }) {
  const aplicarDescuento = async (tipo, valor) => {
    try {
      const ventaActualizada = await posApi.aplicarDescuento(venta.venta_id, {
        nombre: tipo,
        valor: valor,
      })

      onVentaUpdate(ventaActualizada)
    } catch (err) {
      console.error("Error aplicando descuento:", err)
      alert("Error al aplicar descuento: " + err.message)
    }
  }

  const quitarDescuento = async () => {
    try {
      const ventaActualizada = await posApi.quitarDescuento(venta.venta_id)
      onVentaUpdate(ventaActualizada)
    } catch (err) {
      console.error("Error quitando descuento:", err)
      alert("Error al quitar descuento: " + err.message)
    }
  }

  const tieneDescuento = venta.descuento > 0

  return (
    <div className="descuento-modal">
      <h4 className="descuento-titulo">💰 Descuentos</h4>

      <div className="descuento-botones">
        <button
          className="btn-descuento"
          onClick={() => aplicarDescuento("PORCENTAJE", 10)}
          disabled={tieneDescuento}
        >
          -10%
        </button>

        <button
          className="btn-descuento"
          onClick={() => aplicarDescuento("PORCENTAJE", 20)}
          disabled={tieneDescuento}
        >
          -20%
        </button>

        <button
          className="btn-descuento"
          onClick={() => aplicarDescuento("FIJO", 1000)}
          disabled={tieneDescuento}
        >
          -$1000
        </button>
      </div>

      {tieneDescuento && (
        <button className="btn-quitar-descuento" onClick={quitarDescuento}>
          ❌ Quitar descuento
        </button>
      )}
    </div>
  )
}