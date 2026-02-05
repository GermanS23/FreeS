import { useState, useEffect } from "react"
import estadisticasService from "../services/estadisticas.service"
import { notifyError } from "../utils/toast"
import { ToastContainer } from "react-toastify"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import "./Dashboard.css"

export default function Dashboard({ sucCod = 1 }) {
  const [loading, setLoading] = useState(true)
  const [resumenHoy, setResumenHoy] = useState(null)
  const [ventasPorHora, setVentasPorHora] = useState([])
  const [productosTop, setProductosTop] = useState([])
  const [metodosPago, setMetodosPago] = useState([])
  const [ventasSemanales, setVentasSemanales] = useState([])
  const [cajeros, setCajeros] = useState([])
  const [comparativaMensual, setComparativaMensual] = useState([])

  useEffect(() => {
    cargarDatos()
    // Recargar cada 5 minutos
    const interval = setInterval(cargarDatos, 300000)
    return () => clearInterval(interval)
  }, [sucCod])

  const cargarDatos = async () => {
    try {
      setLoading(true)

      const [
        resumen,
        porHora,
        productos,
        pagos,
        semanales,
        estadCajeros,
        mensual
      ] = await Promise.all([
        estadisticasService.getResumenHoy(sucCod),
        estadisticasService.getVentasPorHora(sucCod),
        estadisticasService.getProductosTop(sucCod, 10),
        estadisticasService.getMetodosPago(sucCod),
        estadisticasService.getVentasSemanales(sucCod),
        estadisticasService.getEstadisticasCajeros(sucCod),
        estadisticasService.getComparativaMensual(sucCod)
      ])

      setResumenHoy(resumen.data)
      setVentasPorHora(porHora.data)
      setProductosTop(productos.data)
      setMetodosPago(pagos.data)
      setVentasSemanales(semanales.data)
      setCajeros(estadCajeros.data)
      setComparativaMensual(mensual.data)

    } catch (err) {
      console.error("Error cargando estadísticas:", err)
      notifyError("Error al cargar las estadísticas")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    )
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a']

  return (
    <>
      <div className="dashboard-container">
        
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>📊 Dashboard</h1>
            <p className="dashboard-subtitle">
              Última actualización: {new Date().toLocaleTimeString('es-AR')}
            </p>
          </div>
          <button className="btn-refresh" onClick={cargarDatos}>
            🔄 Actualizar
          </button>
        </div>

        {/* KPIs Principales */}
        <div className="kpis-grid">
          <div className="kpi-card ventas">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <p className="kpi-label">Ventas de Hoy</p>
              <h2 className="kpi-value">${resumenHoy?.totalVentas.toFixed(2) || '0.00'}</h2>
              <p className="kpi-subtitle">{resumenHoy?.cantidadVentas || 0} transacciones</p>
            </div>
          </div>

          <div className="kpi-card ticket">
            <div className="kpi-icon">🎫</div>
            <div className="kpi-content">
              <p className="kpi-label">Ticket Promedio</p>
              <h2 className="kpi-value">${resumenHoy?.ticketPromedio.toFixed(2) || '0.00'}</h2>
              <p className="kpi-subtitle">Por transacción</p>
            </div>
          </div>

          <div className="kpi-card caja">
            <div className="kpi-icon">🏦</div>
            <div className="kpi-content">
              <p className="kpi-label">Estado de Caja</p>
              <h2 className="kpi-value">
                {resumenHoy?.cajaAbierta ? 'ABIERTA' : 'CERRADA'}
              </h2>
              <p className="kpi-subtitle">
                {resumenHoy?.cajaAbierta 
                  ? `Inicial: $${resumenHoy.cajaAbierta.monto_inicial.toFixed(2)}`
                  : 'No hay caja abierta'
                }
              </p>
            </div>
          </div>

          <div className="kpi-card productos">
            <div className="kpi-icon">📦</div>
            <div className="kpi-content">
              <p className="kpi-label">Productos Vendidos</p>
              <h2 className="kpi-value">
                {productosTop.reduce((sum, p) => sum + p.cantidad, 0)}
              </h2>
              <p className="kpi-subtitle">Últimos 7 días</p>
            </div>
          </div>
        </div>

        {/* Gráficos Principales */}
        <div className="charts-grid">
          
          {/* Ventas por Hora */}
          <div className="chart-card full-width">
            <h3>📈 Ventas por Hora (Hoy)</h3>
            {ventasPorHora.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'total') return [`$${value}`, 'Total']
                      return [value, 'Cantidad']
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#667eea" name="Total $" />
                  <Bar dataKey="cantidad" fill="#43e97b" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No hay ventas registradas hoy</p>
            )}
          </div>

          {/* Ventas Semanales */}
          <div className="chart-card">
            <h3>📅 Últimos 7 Días</h3>
            {ventasSemanales.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventasSemanales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    name="Total"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cantidad" 
                    stroke="#43e97b" 
                    strokeWidth={2}
                    name="Cantidad"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No hay datos de la semana</p>
            )}
          </div>

          {/* Métodos de Pago */}
          <div className="chart-card">
            <h3>💳 Métodos de Pago</h3>
            {metodosPago.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metodosPago}
                    dataKey="total"
                    nameKey="metodo"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.metodo}: $${entry.total.toFixed(2)}`}
                  >
                    {metodosPago.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No hay datos de pagos</p>
            )}
          </div>

          {/* Comparativa Mensual */}
          <div className="chart-card full-width">
            <h3>📊 Comparativa Últimos 6 Meses</h3>
            {comparativaMensual.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparativaMensual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'total') return [`$${value}`, 'Total']
                      return [value, 'Cantidad']
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#764ba2" name="Total $" />
                  <Bar dataKey="cantidad" fill="#f093fb" name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No hay datos históricos</p>
            )}
          </div>

        </div>

        {/* Tablas de Datos */}
        <div className="tables-grid">
          
          {/* Top Productos */}
          <div className="data-table-card">
            <h3>🏆 Top 10 Productos</h3>
            {productosTop.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosTop.map((prod, idx) => (
                      <tr key={prod.prod_cod}>
                        <td>
                          <span className="ranking">{idx + 1}</span>
                        </td>
                        <td><strong>{prod.nombre}</strong></td>
                        <td>
                          <span className="cantidad-badge">{prod.cantidad}</span>
                        </td>
                        <td className="monto">${prod.ingresos.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No hay datos de productos</p>
            )}
          </div>

          {/* Estadísticas de Cajeros */}
          <div className="data-table-card">
            <h3>👥 Rendimiento de Cajeros (Este Mes)</h3>
            {cajeros.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cajero</th>
                      <th>Turnos</th>
                      <th>Total Ventas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cajeros.map((cajero, idx) => (
                      <tr key={idx}>
                        <td><strong>{cajero.cajero}</strong></td>
                        <td>{cajero.turnos}</td>
                        <td className="monto">${cajero.totalVentas.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No hay datos de cajeros</p>
            )}
          </div>

        </div>

      </div>

      <ToastContainer />
    </>
  )
}