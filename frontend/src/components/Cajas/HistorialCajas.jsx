import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import cajasService from "../../services/cajas.service"
import { notifyError } from "../../utils/toast"
import { ToastContainer } from "react-toastify"
import "./HistorialCajas.css"

export default function HistorialCajas({ sucCod }) {
  const navigate = useNavigate()
  const [cajas, setCajas] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    total: 0
  })

  useEffect(() => {
    cargarCajas(0)
  }, [sucCod])

  const cargarCajas = async (page = 0) => {
    try {
      setLoading(true)
      const response = await cajasService.getCajasPorSucursal(sucCod, page, 20)
      
      setCajas(response.data.cajas)
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      })
    } catch (err) {
      console.error("Error cargando historial:", err)
      notifyError("Error al cargar el historial de cajas")
    } finally {
      setLoading(false)
    }
  }

  const verDetalle = (cajaId) => {
    navigate(`/cajas/detalle/${cajaId}`)
  }

  const calcularDuracion = (apertura, cierre) => {
    if (!cierre) return "En curso"
    
    const inicio = new Date(apertura)
    const fin = new Date(cierre)
    const diff = fin - inicio
    
    const horas = Math.floor(diff / (1000 * 60 * 60))
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${horas}h ${minutos}m`
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && cajas.length === 0) {
    return (
      <div className="historial-loading">
        <div className="spinner"></div>
        <p>Cargando historial...</p>
      </div>
    )
  }

  return (
    <>
      <div className="historial-cajas-container">
        <div className="historial-header">
          <div>
            <h1>📊 Historial de Cajas</h1>
            <p className="historial-subtitle">
              Total de registros: <strong>{pagination.total}</strong>
            </p>
          </div>
        </div>

        {cajas.length === 0 ? (
          <div className="historial-empty">
            <div className="empty-icon">📦</div>
            <h3>No hay cajas registradas</h3>
            <p>Aún no se han cerrado cajas en esta sucursal</p>
          </div>
        ) : (
          <>
            <div className="cajas-tabla-container">
              <table className="cajas-tabla">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cajero</th>
                    <th>Fecha Apertura</th>
                    <th>Fecha Cierre</th>
                    <th>Duración</th>
                    <th>Monto Inicial</th>
                    <th>Total Ventas</th>
                    <th>Efectivo Esperado</th>
                    <th>Efectivo Real</th>
                    <th>Diferencia</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cajas.map((caja) => {
                    const diferencia = Number(caja.caja_diferencia || 0)
                    const tieneDiferencia = Math.abs(diferencia) > 0.01

                    return (
                      <tr key={caja.caja_id}>
                        <td>
                          <span className="caja-id">#{caja.caja_id}</span>
                        </td>
                        <td>
                          <strong>{caja.Usuario?.us_nomape || 'Sin asignar'}</strong>
                        </td>
                        <td>{formatearFecha(caja.caja_fecha_apertura)}</td>
                        <td>
                          {caja.caja_fecha_cierre 
                            ? formatearFecha(caja.caja_fecha_cierre)
                            : <span className="badge-abierta">ABIERTA</span>
                          }
                        </td>
                        <td>
                          {calcularDuracion(caja.caja_fecha_apertura, caja.caja_fecha_cierre)}
                        </td>
                        <td>${Number(caja.caja_monto_inicial).toFixed(2)}</td>
                        <td className="monto-destacado">
                          ${Number(caja.caja_total_ventas).toFixed(2)}
                        </td>
                        <td>${Number(caja.caja_total_efectivo_esperado).toFixed(2)}</td>
                        <td>
                          {caja.caja_total_efectivo_real !== null
                            ? `$${Number(caja.caja_total_efectivo_real).toFixed(2)}`
                            : '-'
                          }
                        </td>
                        <td>
                          {caja.caja_estado === 'CERRADA' ? (
                            <span className={`diferencia-badge ${
                              diferencia > 0 ? 'sobrante' : diferencia < 0 ? 'faltante' : 'exacto'
                            }`}>
                              {diferencia > 0 && '+'}
                              ${diferencia.toFixed(2)}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          <span className={`estado-badge ${caja.caja_estado.toLowerCase()}`}>
                            {caja.caja_estado}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-ver-detalle"
                            onClick={() => verDetalle(caja.caja_id)}
                          >
                            👁️ Ver
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="historial-pagination">
                <button
                  className="btn-pagination"
                  disabled={pagination.currentPage === 0}
                  onClick={() => cargarCajas(pagination.currentPage - 1)}
                >
                  ← Anterior
                </button>
                
                <span className="pagination-info">
                  Página {pagination.currentPage + 1} de {pagination.totalPages}
                </span>
                
                <button
                  className="btn-pagination"
                  disabled={pagination.currentPage >= pagination.totalPages - 1}
                  onClick={() => cargarCajas(pagination.currentPage + 1)}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ToastContainer />
    </>
  )
}