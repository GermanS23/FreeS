import "./VentaTotales.css"

export default function VentaTotales({ venta }) {
  const subtotal = Number(venta.venta_subtotal).toFixed(2)
  const descuento = Number(venta.descuento).toFixed(2)
  const total = Number(venta.venta_total).toFixed(2)

  return (
    <footer className="venta-totales">
      <div className="totales-row">
        <span>Subtotal</span>
        <span className="totales-valor">${subtotal}</span>
      </div>

      {descuento > 0 && (
        <div className="totales-row descuento-row">
          <span>Descuento</span>
          <span className="totales-valor descuento-valor">-${descuento}</span>
        </div>
      )}

      <div className="totales-separator"></div>

      <div className="totales-row total-row">
        <span className="total-label">TOTAL</span>
        <span className="total-valor">${total}</span>
      </div>
    </footer>
  )
}