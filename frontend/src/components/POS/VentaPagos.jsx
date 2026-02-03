import "./VentaPago.css"

export default function VentaPagos({ pagos }) {
  return (
    <div className="venta-pagos">
      <h4 className="venta-pagos-titulo">💳 Métodos de Pago</h4>
      <div className="venta-pagos-lista">
        {pagos.map((pago) => (
          <div key={pago.vp_id} className="venta-pago-item">
            <span className="pago-metodo">
              {pago.MetodoPago?.mp_nombre || 'Desconocido'}
            </span>
            <span className="pago-monto">
              ${Number(pago.vp_monto).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}