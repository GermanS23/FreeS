import { useState, useEffect } from "react"
import insumosService from "../../services/insumos.service"
import { notifyError } from "../../utils/toast"

export default function HistorialGlobalTable({ sucCod }) {
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [limit, setLimit] = useState(100)

  useEffect(() => {
    cargarHistorialGlobal()
  }, [sucCod, limit])

  const cargarHistorialGlobal = async () => {
    try {
      setLoading(true)
      const response = await insumosService.getHistorialGlobal(sucCod, limit)
      setHistorial(response.data)
    } catch (err) {
      console.error("Error cargando historial global:", err)
      notifyError("Error al cargar el historial de movimientos")
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const getTipoLabel = (tipo) => {
    const labels = {
      'VENTA': { texto: 'Venta', icono: '🛒', clase: 'venta' },
      'AJUSTE_MANUAL': { texto: 'Ajuste Manual', icono: '⚖️', clase: 'ajuste' },
      'INVENTARIO_INICIAL': { texto: 'Inventario Inicial', icono: '📦', clase: 'inicial' }
    }
    return labels[tipo] || { texto: tipo, icono: '❓', clase: 'otro' }
  }

  if (loading) return (
    <div className="historial-loading">
      <div className="spinner"></div>
      <p>Consultando auditoría global...</p>
    </div>
  )

  return (
    <div className="historial-tabla-container global-view">
      <table className="historial-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Insumo</th>
            <th>Tipo</th>
            <th>Movimiento</th>
            <th>Stock Resultante</th>
            <th>Usuario</th>
            <th>Detalles/Obs.</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((mov) => {
            const tipo = getTipoLabel(mov.tipo_movimiento)
            const esPositivo = Number(mov.cantidad_movimiento) > 0
            return (
              <tr key={mov.historial_id}>
                <td>{formatearFecha(mov.fecha_movimiento)}</td>
                <td>
                  <strong>{mov.Insumo?.insumo_nombre}</strong>
                  <br />
                  <small className="badge-unidad" style={{fontSize: '0.6rem'}}>
                    {mov.Insumo?.unidad_medida}
                  </small>
                </td>
                <td>
                  <span className={`tipo-badge ${tipo.clase}`}>
                    {tipo.icono} {tipo.texto}
                  </span>
                </td>
                <td>
                  <span className={`movimiento ${esPositivo ? 'positivo' : 'negativo'}`}>
                    {esPositivo ? '+' : ''}{Number(mov.cantidad_movimiento).toFixed(2)}
                  </span>
                </td>
                <td>
                  <strong>{Number(mov.cantidad_nueva).toFixed(2)}</strong>
                </td>
                <td>{mov.Usuario?.us_nomape || 'Sistema'}</td>
                <td>
                  <span className="observaciones">
                    {mov.observaciones || '-'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}