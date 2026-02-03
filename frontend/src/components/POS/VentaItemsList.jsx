import VentaItemRow from "./VentaItemRow"
import "./VentaItemsList.css"

export default function VentaItemsList({ items, onEliminarItem, onModificarCantidad }) {
  if (!items || items.length === 0) {
    return (
      <div className="items-empty">
        <div className="empty-cart-icon">🛒</div>
        <p>Sin productos agregados</p>
      </div>
    )
  }

  return (
    <div className="venta-items-list">
      {items.map((item) => (
        <VentaItemRow
          key={item.venta_items_id}
          item={item}
          onEliminar={onEliminarItem}
          onModificarCantidad={onModificarCantidad}
        />
      ))}
    </div>
  )
}