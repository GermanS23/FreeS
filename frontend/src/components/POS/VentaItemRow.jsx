import { useState } from "react"
import "./VentaItemRow.css"

export default function VentaItemRow({ item, onEliminar, onModificarCantidad }) {
  const [editando, setEditando] = useState(false)
  const [nuevaCantidad, setNuevaCantidad] = useState(item.cantidad)

  // Si no hay handlers, la venta está cerrada (solo lectura)
  const soloLectura = !onEliminar && !onModificarCantidad

  const handleGuardar = () => {
    if (nuevaCantidad > 0 && nuevaCantidad !== item.cantidad) {
      onModificarCantidad(item.venta_items_id, nuevaCantidad)
    }
    setEditando(false)
  }

  const handleCancelar = () => {
    setNuevaCantidad(item.cantidad)
    setEditando(false)
  }

  return (
    <div className="venta-item-row">
      <div className="item-info">
        <span className="item-nombre">{item.nombre}</span>
        <span className="item-detalle">
          {editando ? (
            <div className="cantidad-editor">
              <button 
                className="btn-cantidad"
                onClick={() => setNuevaCantidad(Math.max(1, nuevaCantidad - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={nuevaCantidad}
                onChange={(e) => setNuevaCantidad(parseInt(e.target.value) || 1)}
                className="input-cantidad"
              />
              <button 
                className="btn-cantidad"
                onClick={() => setNuevaCantidad(nuevaCantidad + 1)}
              >
                +
              </button>
              <button className="btn-guardar" onClick={handleGuardar}>✓</button>
              <button className="btn-cancelar-edit" onClick={handleCancelar}>✕</button>
            </div>
          ) : (
            <>
              {item.cantidad} × ${Number(item.precio_unitario).toFixed(2)}
              {!soloLectura && (
                <button 
                  className="btn-editar-cantidad"
                  onClick={() => setEditando(true)}
                >
                  ✏️
                </button>
              )}
            </>
          )}
        </span>
      </div>
      <div className="item-acciones">
        <div className="item-subtotal">${Number(item.subtotal).toFixed(2)}</div>
        {!soloLectura && (
          <button
            className="btn-eliminar-item"
            onClick={() => onEliminar(item.venta_items_id, item.nombre)}
            title="Eliminar producto"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}