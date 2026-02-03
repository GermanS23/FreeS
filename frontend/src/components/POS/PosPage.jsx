import { useEffect, useState } from "react"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { posApi } from "../../services/pos.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import ProductosPanel from "./ProductosPanel"
import VentaPanel from "./VentaPanel"
import AccionesPanel from "./AccionesPanel"
import ConfirmModal from "./ConfirmModal"
import "./POSPage.css"

export default function POSPage({ sucCod }) {
  const [venta, setVenta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger"
  })

  useEffect(() => {
    const cargarVenta = async () => {
      try {
        setLoading(true)
        setError(null)
        const ventaAbierta = await posApi.getVentaAbierta(sucCod)
        setVenta(ventaAbierta)
      } catch (err) {
        console.error("Error cargando venta:", err)
        setError("No se pudo cargar la venta")
        notifyError("No se pudo cargar la venta")
      } finally {
        setLoading(false)
      }
    }
    cargarVenta()
  }, [sucCod])

  const crearVenta = async () => {
    try {
      const nuevaVenta = await posApi.crearVenta(sucCod)
      setVenta(nuevaVenta)
      notifySuccess("Nueva venta creada")
    } catch (err) {
      notifyError("Error al crear la venta")
    }
  }

  const onVentaUpdate = (ventaActualizada) => setVenta(ventaActualizada)

  const onVentaCerrada = () => {
    setVenta(null)
    notifySuccess("✅ Venta cerrada exitosamente")
  }

  // Nueva función para cancelar con confirmación
  const handleRequestCancelar = () => {
    setConfirmModal({
      isOpen: true,
      title: "Cancelar Venta",
      message: "¿Estás seguro de que deseas cancelar la venta actual?",
      type: "danger",
      onConfirm: async () => {
        try {
          await posApi.cancelarVenta(venta.venta_id)
          setVenta(null)
          notifySuccess("Venta cancelada")
          setConfirmModal(prev => ({ ...prev, isOpen: false }))
        } catch (err) {
          notifyError("Error al cancelar la venta")
        }
      }
    })
  }

  const handleEliminarItem = (ventaItemsId, nombreProducto) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar producto",
      message: `¿Querés eliminar "${nombreProducto}" de la venta?`,
      type: "warning",
      onConfirm: async () => {
        try {
          const ventaActualizada = await posApi.eliminarItem(ventaItemsId)
          setVenta(ventaActualizada)
          notifySuccess("Producto eliminado")
          setConfirmModal(prev => ({ ...prev, isOpen: false }))
        } catch (err) {
          notifyError("Error al eliminar producto")
        }
      }
    })
  }

  const handleModificarCantidad = async (ventaItemsId, cantidad) => {
    try {
      const ventaActualizada = await posApi.modificarCantidad(ventaItemsId, cantidad)
      setVenta(ventaActualizada)
      notifySuccess("Cantidad actualizada")
    } catch (err) {
      notifyError("Error al modificar cantidad")
    }
  }

  if (loading) return <div className="pos-loading"><div className="spinner"></div><p>Cargando POS...</p></div>

  if (error) return <div className="pos-error"><h2>❌ Error</h2><p>{error}</p><button onClick={() => window.location.reload()}>Reintentar</button></div>

  return (
    <>
      {!venta ? (
        <div className="pos-empty">
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h2>No hay venta activa</h2>
            <p>Comenzá una nueva venta para empezar a registrar productos</p>
            <button className="btn-primary-large" onClick={crearVenta}>➕ Nueva venta</button>
          </div>
        </div>
      ) : (
        <div className="pos-layout">
          <div className="pos-productos">
            <ProductosPanel venta={venta} onVentaUpdate={onVentaUpdate} />
          </div>
          <div className="pos-resumen">
            <VentaPanel 
              venta={venta} 
              onEliminarItem={handleEliminarItem}
              onModificarCantidad={handleModificarCantidad}
            />
          </div>
          <div className="pos-acciones">
            <AccionesPanel
              venta={venta}
              onVentaUpdate={onVentaUpdate}
              onVentaCerrada={onVentaCerrada}
              onVentaCancelada={handleRequestCancelar} 
            />
          </div>
        </div>
      )}

      {/* Los elementos globales van FUERA del condicional de la venta */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
      <ToastContainer />
    </>
  )
}