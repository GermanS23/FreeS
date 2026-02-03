import "./VentaHeader.css"

export default function VentaHeader({ venta }) {
  const fecha = new Date(venta.venta_fecha).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <header className="venta-header">
      <div className="venta-info">
        <h3 className="venta-titulo">Venta #{venta.venta_id}</h3>
        <div className="venta-meta">
          <span className="venta-sucursal">📍 Sucursal {venta.suc_cod}</span>
          <span className="venta-fecha">🕒 {fecha}</span>
        </div>
      </div>
      <div className="venta-estado">
        <span className="badge-abierta">ABIERTA</span>
      </div>
    </header>
  )
}