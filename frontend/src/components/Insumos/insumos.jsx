import { useState, useEffect } from "react"
import insumosService from "../../services/insumos.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import { ToastContainer } from "react-toastify"
import InsumoFormModal from "./InsumoFormModal"
import AjustarStockModal from "./AjustarStockModal"
import HistorialStockModal from "./HistorialStockModal"
import "./Insumos.css"

export default function Insumos({ sucCod }) {
  const [insumos, setInsumos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showAjustar, setShowAjustar] = useState(false)
  const [showHistorial, setShowHistorial] = useState(false)
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null)
  const [incluirInactivos, setIncluirInactivos] = useState(false)

  useEffect(() => {
    cargarInsumos()
  }, [sucCod, incluirInactivos])

  const cargarInsumos = async () => {
    try {
      setLoading(true)
      const response = await insumosService.getInsumos(sucCod, incluirInactivos)
      setInsumos(response.data || []) // Asegurar que siempre sea un array
    } catch (err) {
      console.error("Error cargando insumos:", err)
      // Solo mostrar error si es un error real, no si simplemente no hay datos
      if (err.response?.status !== 404) {
        notifyError("Error al cargar los insumos")
      }
      setInsumos([]) // Asegurar array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  const handleNuevo = () => {
    setInsumoSeleccionado(null)
    setShowForm(true)
  }

  const handleEditar = (insumo) => {
    setInsumoSeleccionado(insumo)
    setShowForm(true)
  }

  const handleAjustarStock = (insumo) => {
    setInsumoSeleccionado(insumo)
    setShowAjustar(true)
  }

  const handleVerHistorial = (insumo) => {
    setInsumoSeleccionado(insumo)
    setShowHistorial(true)
  }

  const handleEliminar = async (insumo) => {
    if (!window.confirm(`¿Eliminar el insumo "${insumo.insumo_nombre}"?`)) return

    try {
      const response = await insumosService.deleteInsumo(insumo.insumo_id)
      
      if (response.data.desactivado) {
        notifySuccess("Insumo desactivado (está siendo usado en recetas)")
      } else {
        notifySuccess("Insumo eliminado correctamente")
      }
      
      cargarInsumos()
    } catch (err) {
      console.error("Error eliminando insumo:", err)
      notifyError(err.response?.data?.error || "Error al eliminar insumo")
    }
  }

  const onFormSuccess = () => {
    setShowForm(false)
    cargarInsumos()
  }

  const onAjusteSuccess = () => {
    setShowAjustar(false)
    cargarInsumos()
  }

  const getEstadoStock = (insumo) => {
    const actual = Number(insumo.stock_actual)
    const minimo = Number(insumo.stock_minimo)

    if (actual < 0) return { clase: 'negativo', texto: 'NEGATIVO' }
    if (actual <= minimo) return { clase: 'critico', texto: 'CRÍTICO' }
    if (actual <= minimo * 1.5) return { clase: 'bajo', texto: 'BAJO' }
    return { clase: 'normal', texto: 'OK' }
  }

  if (loading) {
    return (
      <div className="insumos-loading">
        <div className="spinner"></div>
        <p>Cargando insumos...</p>
      </div>
    )
  }

  return (
    <>
      <div className="insumos-container">
        
        {/* Header */}
        <div className="insumos-header">
          <div>
            <h1>📦 Gestión de Insumos</h1>
            <p className="insumos-subtitle">
              Control de stock e inventario
            </p>
          </div>
          <div className="header-actions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={incluirInactivos}
                onChange={(e) => setIncluirInactivos(e.target.checked)}
              />
              Incluir inactivos
            </label>
            <button className="btn-primary" onClick={handleNuevo}>
              ➕ Nuevo Insumo
            </button>
          </div>
        </div>

        {/* Tabla de Insumos */}
        {insumos.length === 0 ? (
          <div className="insumos-empty">
            <div className="empty-icon">📦</div>
            <h3>No hay insumos registrados</h3>
            <p>Comenzá agregando tu primer insumo</p>
            <button className="btn-primary" onClick={handleNuevo}>
              ➕ Crear Insumo
            </button>
          </div>
        ) : (
          <div className="insumos-tabla-container">
            <table className="insumos-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Unidad</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Estado</th>
                  <th>Estado General</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {insumos.map((insumo) => {
                  const estado = getEstadoStock(insumo)
                  
                  return (
                    <tr key={insumo.insumo_id} className={!insumo.insumo_activo ? 'inactivo' : ''}>
                      <td>
                        <strong>{insumo.insumo_nombre}</strong>
                      </td>
                      <td>{insumo.insumo_descripcion || '-'}</td>
                      <td>
                        <span className="badge-unidad">{insumo.unidad_medida}</span>
                      </td>
                      <td>
                        <span className={`stock-cantidad ${estado.clase}`}>
                          {Number(insumo.stock_actual).toFixed(2)}
                        </span>
                      </td>
                      <td>{Number(insumo.stock_minimo).toFixed(2)}</td>
                      <td>
                        <span className={`badge-estado ${estado.clase}`}>
                          {estado.texto}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-activo ${insumo.insumo_activo ? 'activo' : 'inactivo'}`}>
                          {insumo.insumo_activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="acciones-grupo">
                          <button
                            className="btn-accion ajustar"
                            onClick={() => handleAjustarStock(insumo)}
                            title="Ajustar stock"
                          >
                            ⚖️
                          </button>
                          <button
                            className="btn-accion historial"
                            onClick={() => handleVerHistorial(insumo)}
                            title="Ver historial"
                          >
                            📋
                          </button>
                          <button
                            className="btn-accion editar"
                            onClick={() => handleEditar(insumo)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-accion eliminar"
                            onClick={() => handleEliminar(insumo)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modales */}
      <InsumoFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={onFormSuccess}
        insumo={insumoSeleccionado}
        sucCod={sucCod}
      />

      <AjustarStockModal
        isOpen={showAjustar}
        onClose={() => setShowAjustar(false)}
        onSuccess={onAjusteSuccess}
        insumo={insumoSeleccionado}
      />

      <HistorialStockModal
        isOpen={showHistorial}
        onClose={() => setShowHistorial(false)}
        insumo={insumoSeleccionado}
      />

      <ToastContainer />
    </>
  )
}