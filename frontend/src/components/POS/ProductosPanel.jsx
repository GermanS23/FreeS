import { useState, useEffect } from "react"
import ProductoCard from "./ProductoCard"
import { posApi } from "../../services/pos.service"
import productosService from "../../services/productos.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import "./ProductosPanel.css"

export default function ProductosPanel({ venta, onVentaUpdate }) {
  const [productos, setProductos] = useState([])
  const [filtro, setFiltro] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await productosService.listProductosPublic()
        const data = response.data?.items || response.data?.productos || response.data || []
        
        if (Array.isArray(data)) {
          setProductos(data)
        } else {
          console.error("La respuesta no es un array:", data)
          setProductos([])
        }
        
      } catch (err) {
        console.error("Error cargando productos:", err)
        setError("No se pudieron cargar los productos")
        setProductos([])
        notifyError("No se pudieron cargar los productos")
      } finally {
        setLoading(false)
      }
    }

    cargarProductos()
  }, [])

  const agregar = async (prod_cod, prod_nom) => {
    try {
      const ventaActualizada = await posApi.agregarProducto(
        venta.venta_id,
        prod_cod,
        1
      )
      onVentaUpdate(ventaActualizada)
      notifySuccess(`✓ ${prod_nom} agregado`)
    } catch (err) {
      console.error("Error agregando producto:", err)
      notifyError("Error al agregar producto")
    }
  }

  const productosFiltrados = productos.filter((p) =>
    p.prod_nom.toLowerCase().includes(filtro.toLowerCase())
  )

  if (loading) {
    return (
      <div className="productos-loading">
        <div className="mini-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="productos-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )
  }

  return (
    <section className="productos-panel">
      <div className="productos-header">
        <h3>🛍️ Productos</h3>
        <span className="productos-count">
          {productosFiltrados.length} disponibles
        </span>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="search-input"
          autoFocus
        />
      </div>

      <div className="productos-grid">
        {productosFiltrados.length === 0 ? (
          <div className="no-productos">
            <p>😕 No se encontraron productos</p>
          </div>
        ) : (
          productosFiltrados.map((p) => (
            <ProductoCard 
              key={p.prod_cod} 
              producto={p} 
              onAgregar={() => agregar(p.prod_cod, p.prod_nom)} 
            />
          ))
        )}
      </div>
    </section>
  )
}