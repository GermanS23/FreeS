import "./ProductoCard.css"

export default function ProductoCard({ producto, onAgregar }) {
  return (
    <button
      className="producto-card"
      onClick={onAgregar}
    >
      <div className="producto-nombre">{producto.prod_nom}</div>
      <div className="producto-precio">${Number(producto.prod_pre).toFixed(2)}</div>
    </button>
  )
}