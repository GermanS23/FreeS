import DescuentoModal from "./DescuentoModal"
import CerrarVentaButton from "./CerrarVentaButton"
import CancelarVentaButton from "./CancelarVentaButton"
import "./AccionesPanel.css"

export default function AccionesPanel({ venta, onVentaUpdate, onVentaCerrada, onVentaCancelada }) {
  return (
    <section className="acciones-panel">
      <h3 className="acciones-titulo">⚡ Acciones</h3>

      <div className="acciones-contenido">
        <DescuentoModal venta={venta} onVentaUpdate={onVentaUpdate} />

        <CerrarVentaButton venta={venta} onVentaCerrada={onVentaCerrada} />
        
        <CancelarVentaButton venta={venta} onVentaCancelada={onVentaCancelada} />
      </div>
    </section>
  )
}