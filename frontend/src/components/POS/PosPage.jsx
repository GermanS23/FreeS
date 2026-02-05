import { useEffect, useState } from "react"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { posApi } from "../../services/pos.service"
import cajasService from "../../services/cajas.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import ProductosPanel from "./ProductosPanel"
import VentaPanel from "./VentaPanel"
import AccionesPanel from "./AccionesPanel"
import AbrirCajaModal from "../Cajas/AbrirCajaModal"
import CerrarCajaModal from "../Cajas/CerrarCajaModal"
import ConfirmModal from "./ConfirmModal"
import "./POSPage.css"

export default function POSPage({ sucCod, usCod }) {
  const [caja, setCaja] = useState(null)
  const [venta, setVenta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modales
  const [showAbrirCaja, setShowAbrirCaja] = useState(false)
  const [showCerrarCaja, setShowCerrarCaja] = useState(false)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger"
  })

  // =========================
  // CARGA INICIAL
  // =========================
  useEffect(() => {
    const cargarEstado = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1. Verificar si hay caja abierta
        const responseCaja = await cajasService.getCajaAbierta(sucCod)
        const cajaAbierta = responseCaja.data

        if (cajaAbierta) {
          setCaja(cajaAbierta)

          // 2. Si hay caja, buscar venta abierta
          const responseVenta = await posApi.getVentaAbierta(sucCod)
          setVenta(responseVenta)
        } else {
          // No hay caja abierta
          setCaja(null)
          setVenta(null)
        }

      } catch (err) {
        console.error("Error cargando estado:", err)
        setError("No se pudo cargar el estado del POS")
        notifyError("Error al cargar el POS")
      } finally {
        setLoading(false)
      }
    }

    cargarEstado()
  }, [sucCod])

  // =========================
  // HANDLERS DE CAJA
  // =========================

  const handleCajaAbierta = (nuevaCaja) => {
    setCaja(nuevaCaja)
    notifySuccess("Caja abierta. Ya podés comenzar a vender.")
  }

  const handleCajaCerrada = () => {
    setCaja(null)
    setVenta(null)
    notifySuccess("Turno finalizado correctamente")
  }

  const handleSolicitarCerrarCaja = () => {
    // Verificar si hay venta abierta
    if (venta && venta.venta_estado === 'ABIERTA') {
      notifyError("Debés cerrar o cancelar la venta actual antes de cerrar la caja")
      return
    }

    setShowCerrarCaja(true)
  }

  // =========================
  // HANDLERS DE VENTA
  // =========================

  const crearVenta = async () => {
    try {
      const nuevaVenta = await posApi.crearVenta(sucCod)
      setVenta(nuevaVenta)
      notifySuccess("Nueva venta creada")
    } catch (err) {
      console.error("Error creando venta:", err)
      notifyError(err.response?.data?.error || "Error al crear la venta")
    }
  }

  const onVentaUpdate = (ventaActualizada) => {
    setVenta(ventaActualizada)
  }

  const onVentaCerrada = () => {
    setVenta(null)
  }

  const onVentaCancelada = () => {
    setVenta(null)
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
        } catch (err) {
          console.error("Error eliminando item:", err)
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
      console.error("Error modificando cantidad:", err)
      notifyError("Error al modificar cantidad")
    }
  }

  // =========================
  // RENDER
  // =========================

  if (loading) {
    return (
      <div className="pos-loading">
        <div className="spinner"></div>
        <p>Cargando POS...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pos-error">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )
  }

  // 🔴 NO HAY CAJA ABIERTA
  if (!caja) {
    return (
      <>
        <div className="pos-empty">
          <div className="empty-state">
            <div className="empty-icon">🏦</div>
            <h2>No hay caja abierta</h2>
            <p>Debés abrir caja para comenzar a operar</p>
            <button 
              className="btn-primary-large" 
              onClick={() => setShowAbrirCaja(true)}
            >
              🏦 Abrir Caja
            </button>
          </div>
        </div>

        <AbrirCajaModal
          isOpen={showAbrirCaja}
          onClose={() => setShowAbrirCaja(false)}
          onCajaAbierta={handleCajaAbierta}
          sucCod={sucCod}
          usCod={usCod}
        />

        <ToastContainer />
      </>
    )
  }

  // 🟡 HAY CAJA PERO NO HAY VENTA
  if (!venta) {
    return (
      <>
        <div className="pos-empty">
          <div className="empty-state">
            <div className="caja-info">
              <h3>✅ Caja Abierta</h3>
              <p>Cajero: {caja.Usuario?.us_nomape}</p>
              <p>Monto inicial: ${Number(caja.caja_monto_inicial).toFixed(2)}</p>
            </div>

            <div className="empty-icon">🛒</div>
            <h2>No hay venta activa</h2>
            <p>Comenzá una nueva venta para empezar a registrar productos</p>
            
            <div className="empty-actions">
              <button className="btn-primary-large" onClick={crearVenta}>
                ➕ Nueva venta
              </button>
              
              <button 
                className="btn-secondary-large" 
                onClick={handleSolicitarCerrarCaja}
              >
                🔒 Cerrar Caja
              </button>
            </div>
          </div>
        </div>

        <CerrarCajaModal
          isOpen={showCerrarCaja}
          onClose={() => setShowCerrarCaja(false)}
          onCajaCerrada={handleCajaCerrada}
          caja={caja}
        />

        <ToastContainer />
      </>
    )
  }

  // 🟢 VENTA ACTIVA
  return (
    <>
      <div className="pos-layout">
        {/* Header con info de caja */}
        <div className="pos-header">
          <div className="caja-status">
            <span className="caja-badge">✅ Caja Abierta</span>
            <span className="caja-cajero">{caja.Usuario?.us_nomape}</span>
          </div>
          <button 
            className="btn-cerrar-caja-header"
            onClick={handleSolicitarCerrarCaja}
          >
            🔒 Cerrar Caja
          </button>
        </div>

        {/* Grid principal */}
        <div className="pos-grid">
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
              onVentaCancelada={onVentaCancelada}
            />
          </div>
        </div>
      </div>

      <CerrarCajaModal
        isOpen={showCerrarCaja}
        onClose={() => setShowCerrarCaja(false)}
        onCajaCerrada={handleCajaCerrada}
        caja={caja}
      />

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