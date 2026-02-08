import { useState, useEffect } from "react"
import recetasService from "../../services/recetas.service"
import insumosService from "../../services/insumos.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import { ToastContainer } from "react-toastify"
import "./GestionRecetas.css"

export default function GestionRecetas({ sucCod }) {
  const [productos, setProductos] = useState([])
  const [insumos, setInsumos] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [recetaActual, setRecetaActual] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)

  // ESTADOS PARA FILTROS
  const [busqueda, setBusqueda] = useState('')
  const [filtroReceta, setFiltroReceta] = useState('TODOS') // TODOS | CON_RECETA | SIN_RECETA

  // Formulario para agregar insumo
  const [nuevoInsumo, setNuevoInsumo] = useState({
    insumo_id: '',
    cantidad_requerida: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [sucCod])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [productosRes, insumosRes] = await Promise.all([
        recetasService.getProductosConRecetas(sucCod),
        insumosService.getInsumos(sucCod)
      ])
      setProductos(productosRes.data)
      setInsumos(insumosRes.data.filter(i => i.insumo_activo))
    } catch (err) {
      console.error("Error cargando datos:", err)
      notifyError("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleSeleccionarProducto = async (producto) => {
    try {
      setProductoSeleccionado(producto)
      const response = await recetasService.getRecetaProducto(producto.prod_cod)
      setRecetaActual(response.data)
      setEditando(false)
      setNuevoInsumo({ insumo_id: '', cantidad_requerida: '' })
    } catch (err) {
      notifyError("Error al cargar la receta")
    }
  }

  const handleAgregarInsumo = async (e) => {
    e.preventDefault()
    if (!nuevoInsumo.insumo_id || !nuevoInsumo.cantidad_requerida) {
      notifyError("Completá todos los campos")
      return
    }
    try {
      await recetasService.agregarInsumo(
        productoSeleccionado.prod_cod,
        Number(nuevoInsumo.insumo_id),
        Number(nuevoInsumo.cantidad_requerida)
      )
      notifySuccess("Insumo agregado")
      await cargarDatos()
      // Refrescar vista actual
      const res = await recetasService.getRecetaProducto(productoSeleccionado.prod_cod)
      setRecetaActual(res.data)
      setNuevoInsumo({ insumo_id: '', cantidad_requerida: '' })
    } catch (err) {
      notifyError("Error al agregar insumo")
    }
  }

  const handleEliminarInsumo = async (producto_insumo_id, nombreInsumo) => {
    if (!window.confirm(`¿Eliminar "${nombreInsumo}"?`)) return
    try {
      await recetasService.eliminarInsumo(producto_insumo_id)
      notifySuccess("Eliminado")
      await cargarDatos()
      const res = await recetasService.getRecetaProducto(productoSeleccionado.prod_cod)
      setRecetaActual(res.data)
    } catch (err) {
      notifyError("Error al eliminar")
    }
  }

  const handleModificarCantidad = async (producto_insumo_id, cantidadActual, nombreInsumo) => {
    const nuevaCantidad = prompt(`Nueva cantidad para ${nombreInsumo}:`, cantidadActual)
    if (!nuevaCantidad || isNaN(nuevaCantidad)) return
    try {
      await recetasService.modificarCantidad(producto_insumo_id, Number(nuevaCantidad))
      notifySuccess("Actualizado")
      await cargarDatos()
      const res = await recetasService.getRecetaProducto(productoSeleccionado.prod_cod)
      setRecetaActual(res.data)
    } catch (err) {
      notifyError("Error al actualizar")
    }
  }

  // LÓGICA DE FILTRADO
  const productosFiltrados = productos.filter(producto => {
    const tieneReceta = producto.Receta && producto.Receta.length > 0
    const coincideBusqueda = producto.prod_nom.toLowerCase().includes(busqueda.toLowerCase())
    let coincideFiltro = true
    if (filtroReceta === 'CON_RECETA') coincideFiltro = tieneReceta
    if (filtroReceta === 'SIN_RECETA') coincideFiltro = !tieneReceta
    return coincideBusqueda && coincideFiltro
  })

  // ESTADÍSTICAS
  const totalProductos = productos.length
  const conReceta = productos.filter(p => p.Receta && p.Receta.length > 0).length
  const sinReceta = totalProductos - conReceta

  if (loading) return <div className="recetas-loading"><div className="spinner"></div></div>

  const insumoSeleccionadoInfo = insumos.find(
    (i) => i.insumo_id === Number(nuevoInsumo.insumo_id)
  );
  return (
    <div className="recetas-container">
      <div className="recetas-header">
        <h1>🧾 Gestión de Recetas</h1>
        <p className="recetas-subtitle">Configuración de insumos por producto</p>
      </div>

      <div className="recetas-stats">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-valor">{totalProductos}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card con-receta">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-valor">{conReceta}</span>
            <span className="stat-label">Con Receta</span>
          </div>
        </div>
        <div className="stat-card sin-receta">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <span className="stat-valor">{sinReceta}</span>
            <span className="stat-label">Sin Receta</span>
          </div>
        </div>
      </div>

      <div className="recetas-grid">
        {/* Panel Izquierdo: Productos */}
        <div className="recetas-panel productos-panel">
          <div className="productos-panel-header">
            <h3>Lista de Productos</h3>
            <input
              type="text"
              className="input-busqueda"
              placeholder="🔍 Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="productos-filtros">
              <button 
                className={`filtro-btn ${filtroReceta === 'TODOS' ? 'activo' : ''}`}
                onClick={() => setFiltroReceta('TODOS')}
              >Todos</button>
              <button 
                className={`filtro-btn ${filtroReceta === 'CON_RECETA' ? 'activo' : ''}`}
                onClick={() => setFiltroReceta('CON_RECETA')}
              >Con Receta</button>
              <button 
                className={`filtro-btn ${filtroReceta === 'SIN_RECETA' ? 'activo' : ''}`}
                onClick={() => setFiltroReceta('SIN_RECETA')}
              >Sin</button>
            </div>
          </div>

          <div className="productos-lista">
            {productosFiltrados.map(producto => (
              <div 
                key={producto.prod_cod}
                className={`producto-item ${productoSeleccionado?.prod_cod === producto.prod_cod ? 'seleccionado' : ''}`}
                onClick={() => handleSeleccionarProducto(producto)}
              >
                <div className="producto-info">
                  <strong>{producto.prod_nom}</strong>
                  <span className="producto-precio">${Number(producto.prod_pre).toFixed(2)}</span>
                </div>
                <div className="producto-estado">
                  {producto.Receta?.length > 0 ? (
                    <span className="badge-tiene-receta">✅ {producto.Receta.length} insumos</span>
                  ) : (
                    <span className="badge-sin-receta">❌ Sin receta</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Detalle de Receta */}
        <div className="recetas-panel receta-panel">
          {!productoSeleccionado ? (
            <div className="receta-empty">
              <div className="empty-icon">👈</div>
              <p>Seleccioná un producto para gestionar su receta</p>
            </div>
          ) : (
            <>
              <div className="receta-header">
                <h3>Receta: {productoSeleccionado.prod_nom}</h3>
                <button className="btn-editar" onClick={() => setEditando(!editando)}>
                  {editando ? '❌ Cerrar' : '✏️ Editar Receta'}
                </button>
              </div>

              {recetaActual.length === 0 ? (
                <div className="sin-receta-info"><p>No hay insumos cargados.</p></div>
              ) : (
                <div className="receta-tabla-container">
                  <table className="receta-tabla">
                    <thead>
                      <tr>
                        <th>Insumo</th>
                        <th>Cant.</th>
                        <th>Unidad</th>
                        {editando && <th>Acciones</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {recetaActual.map(item => (
                        <tr key={item.producto_insumo_id}>
                          <td>{item.Insumo?.insumo_nombre}</td>
                          <td>{Number(item.cantidad_requerida).toFixed(2)}</td>
                          <td>{item.Insumo?.unidad_medida}</td>
                          {editando && (
                            <td>
                              <div className="acciones-receta">
                                <button className="btn-accion-mini editar" onClick={() => handleModificarCantidad(item.producto_insumo_id, item.cantidad_requerida, item.Insumo.insumo_nombre)}>✏️</button>
                                <button className="btn-accion-mini eliminar" onClick={() => handleEliminarInsumo(item.producto_insumo_id, item.Insumo.insumo_nombre)}>🗑️</button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {editando && (
                <form onSubmit={handleAgregarInsumo} className="agregar-insumo-form">
                  <h4>➕ Añadir Insumo</h4>
                  <div className="form-row">
                    <select 
                      className="form-select"
                      value={nuevoInsumo.insumo_id}
                      onChange={(e) => setNuevoInsumo({...nuevoInsumo, insumo_id: e.target.value})}
                    >
                      <option value="">Seleccionar...</option>
                      {insumos.map(i => <option key={i.insumo_id} value={i.insumo_id}>{i.insumo_nombre}</option>)}
                    </select>
                    {/* MEDIDA (Dinamica) */}
                    <div className="form-field-group unit">
                      <label> <b>Medida</b></label>
                      <div className="unit-badge">
                        {insumoSeleccionadoInfo ? insumoSeleccionadoInfo.unidad_medida : '--'}
                      </div>
                    </div>
                    <input 
                      type="number" 
                      className="form-input"
                      placeholder="Cant."
                      value={nuevoInsumo.cantidad_requerida}
                      onChange={(e) => setNuevoInsumo({...nuevoInsumo, cantidad_requerida: e.target.value})}
                    />
                    
                    <button type="submit" className="btn-agregar">Añadir</button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}