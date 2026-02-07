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
      console.error("Error cargando receta:", err)
      notifyError("Error al cargar la receta")
    }
  }

  const handleAgregarInsumo = async (e) => {
    e.preventDefault()

    if (!nuevoInsumo.insumo_id || !nuevoInsumo.cantidad_requerida) {
      notifyError("Completá todos los campos")
      return
    }

    if (Number(nuevoInsumo.cantidad_requerida) <= 0) {
      notifyError("La cantidad debe ser mayor a 0")
      return
    }

    // Verificar si ya existe
    if (recetaActual.some(r => r.insumo_id === Number(nuevoInsumo.insumo_id))) {
      notifyError("Este insumo ya está en la receta")
      return
    }

    try {
      await recetasService.agregarInsumo(
        productoSeleccionado.prod_cod,
        Number(nuevoInsumo.insumo_id),
        Number(nuevoInsumo.cantidad_requerida)
      )

      notifySuccess("Insumo agregado a la receta")
      handleSeleccionarProducto(productoSeleccionado)
    } catch (err) {
      console.error("Error agregando insumo:", err)
      notifyError(err.response?.data?.error || "Error al agregar insumo")
    }
  }

  const handleEliminarInsumo = async (producto_insumo_id, nombreInsumo) => {
    if (!window.confirm(`¿Eliminar "${nombreInsumo}" de la receta?`)) return

    try {
      await recetasService.eliminarInsumo(producto_insumo_id)
      notifySuccess("Insumo eliminado de la receta")
      handleSeleccionarProducto(productoSeleccionado)
    } catch (err) {
      console.error("Error eliminando insumo:", err)
      notifyError("Error al eliminar insumo")
    }
  }

  const handleModificarCantidad = async (producto_insumo_id, cantidadActual, nombreInsumo) => {
    const nuevaCantidad = prompt(
      `Modificar cantidad de "${nombreInsumo}"\n\nCantidad actual: ${cantidadActual}\nNueva cantidad:`,
      cantidadActual
    )

    if (nuevaCantidad === null) return

    const cantidad = Number(nuevaCantidad)

    if (isNaN(cantidad) || cantidad <= 0) {
      notifyError("Ingresá una cantidad válida mayor a 0")
      return
    }

    try {
      await recetasService.modificarCantidad(producto_insumo_id, cantidad)
      notifySuccess("Cantidad actualizada")
      handleSeleccionarProducto(productoSeleccionado)
    } catch (err) {
      console.error("Error modificando cantidad:", err)
      notifyError("Error al modificar cantidad")
    }
  }

  if (loading) {
    return (
      <div className="recetas-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <>
      <div className="recetas-container">
        
        {/* Header */}
        <div className="recetas-header">
          <div>
            <h1>🧾 Gestión de Recetas</h1>
            <p className="recetas-subtitle">
              Asociá insumos a cada producto vendible
            </p>
          </div>
        </div>

        <div className="recetas-grid">
          
          {/* Panel de Productos */}
          <div className="recetas-panel productos-panel">
            <h3>📦 Productos</h3>
            <div className="productos-lista">
              {productos.length === 0 ? (
                <p className="lista-vacia">No hay productos disponibles</p>
              ) : (
                productos.map((producto) => {
                  const tieneReceta = producto.Receta && producto.Receta.length > 0
                  const estaSeleccionado = productoSeleccionado?.prod_cod === producto.prod_cod

                  return (
                    <div
                      key={producto.prod_cod}
                      className={`producto-item ${estaSeleccionado ? 'seleccionado' : ''}`}
                      onClick={() => handleSeleccionarProducto(producto)}
                    >
                      <div className="producto-info">
                        <strong>{producto.prod_nom}</strong>
                        <span className="producto-precio">${Number(producto.prod_pre).toFixed(2)}</span>
                      </div>
                      <div className="producto-estado">
                        {tieneReceta ? (
                          <span className="badge-tiene-receta">
                            ✅ {producto.Receta.length} insumos
                          </span>
                        ) : (
                          <span className="badge-sin-receta">
                            ❌ Sin receta
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Panel de Receta */}
          <div className="recetas-panel receta-panel">
            {!productoSeleccionado ? (
              <div className="receta-empty">
                <div className="empty-icon">👈</div>
                <p>Seleccioná un producto para ver o editar su receta</p>
              </div>
            ) : (
              <>
                <div className="receta-header">
                  <h3>🧾 Receta: {productoSeleccionado.prod_nom}</h3>
                  <button
                    className="btn-editar"
                    onClick={() => setEditando(!editando)}
                  >
                    {editando ? '❌ Cancelar' : '✏️ Editar'}
                  </button>
                </div>

                {/* Receta Actual */}
                {recetaActual.length === 0 ? (
                  <div className="sin-receta-info">
                    <p>Este producto no tiene receta asignada</p>
                    <small>Agregá insumos para crear la receta</small>
                  </div>
                ) : (
                  <div className="receta-tabla-container">
                    <table className="receta-tabla">
                      <thead>
                        <tr>
                          <th>Insumo</th>
                          <th>Cantidad</th>
                          <th>Unidad</th>
                          <th>Stock Actual</th>
                          {editando && <th>Acciones</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {recetaActual.map((item) => (
                          <tr key={item.producto_insumo_id}>
                            <td><strong>{item.Insumo.insumo_nombre}</strong></td>
                            <td>{Number(item.cantidad_requerida).toFixed(2)}</td>
                            <td>{item.Insumo.unidad_medida}</td>
                            <td>
                              <span className={`stock-badge ${
                                Number(item.Insumo.stock_actual) <= Number(item.Insumo.stock_minimo) 
                                  ? 'critico' 
                                  : 'normal'
                              }`}>
                                {Number(item.Insumo.stock_actual).toFixed(2)}
                              </span>
                            </td>
                            {editando && (
                              <td>
                                <div className="acciones-receta">
                                  <button
                                    className="btn-accion-mini editar"
                                    onClick={() => handleModificarCantidad(
                                      item.producto_insumo_id,
                                      item.cantidad_requerida,
                                      item.Insumo.insumo_nombre
                                    )}
                                    title="Modificar cantidad"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="btn-accion-mini eliminar"
                                    onClick={() => handleEliminarInsumo(
                                      item.producto_insumo_id,
                                      item.Insumo.insumo_nombre
                                    )}
                                    title="Eliminar"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Formulario para Agregar Insumo */}
                {editando && (
                  <form onSubmit={handleAgregarInsumo} className="agregar-insumo-form">
                    <h4>➕ Agregar Insumo</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Insumo</label>
                        <select
                          value={nuevoInsumo.insumo_id}
                          onChange={(e) => setNuevoInsumo({
                            ...nuevoInsumo,
                            insumo_id: e.target.value
                          })}
                          className="form-select"
                        >
                          <option value="">Seleccioná un insumo</option>
                          {insumos.map((insumo) => (
                            <option key={insumo.insumo_id} value={insumo.insumo_id}>
                              {insumo.insumo_nombre} ({insumo.unidad_medida})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Cantidad Requerida</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={nuevoInsumo.cantidad_requerida}
                          onChange={(e) => setNuevoInsumo({
                            ...nuevoInsumo,
                            cantidad_requerida: e.target.value
                          })}
                          className="form-input"
                          placeholder="0.00"
                        />
                      </div>

                      <button type="submit" className="btn-agregar">
                        ➕ Agregar
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

        </div>

      </div>

      <ToastContainer />
    </>
  )
}