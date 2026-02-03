import VentaHeader from "./VentaHeader"
import VentaItemsList from "./VentaItemsList"
import VentaTotales from "./VentaTotales"
import VentaPagos from "./VentaPagos"
import "./VentaPanel.css"

export default function VentaPanel({ venta, onEliminarItem, onModificarCantidad }) {
  const ventaCerrada = venta.venta_estado === 'CERRADA'

  return (
    <section className="venta-panel-container">
      <VentaHeader venta={venta} />

      <div className="venta-items-wrapper">
        <VentaItemsList 
          items={venta.Items} 
          onEliminarItem={ventaCerrada ? null : onEliminarItem}
          onModificarCantidad={ventaCerrada ? null : onModificarCantidad}
        />
      </div>

      <VentaTotales venta={venta} />

      {/* Mostrar pagos si está cerrada */}
      {ventaCerrada && venta.Pagos && venta.Pagos.length > 0 && (
        <VentaPagos pagos={venta.Pagos} />
      )}
    </section>
  )
}