import "./CancelarVentaButton.css" 

export default function CancelarVentaButton({ venta, onVentaCancelada }) {
  
  // El botón solo se habilita si hay una venta cargada en el estado
  const puedeCancelar = venta && venta.venta_id

  return (
    <button
      className="btn-cancelar-venta"
      onClick={onVentaCancelada} // Gatilla la función 'handleRequestCancelar' en el POSPage
      disabled={!puedeCancelar}
    >
      ❌ Cancelar venta
    </button>
  )
}