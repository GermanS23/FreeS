import { useState, useEffect } from "react"
import insumosService from "../../services/insumos.service"
import { notifySuccess, notifyError } from "../../utils/toast"
import "./InsumoFormModal.css"

export default function InsumoFormModal({
  isOpen,
  onClose,
  onSuccess,
  insumo,
  sucCod,
}) {
  const [formData, setFormData] = useState({
    insumo_nombre: "",
    insumo_descripcion: "",
    unidad_medida: "unidad",
    stock_actual: "0",
    stock_minimo: "0",
    insumo_activo: true,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (insumo) {
      setFormData({
        insumo_nombre: insumo.insumo_nombre,
        insumo_descripcion: insumo.insumo_descripcion || "",
        unidad_medida: insumo.unidad_medida,
        stock_actual: insumo.stock_actual,
        stock_minimo: insumo.stock_minimo,
        insumo_activo: insumo.insumo_activo,
      })
    } else {
      setFormData({
        insumo_nombre: "",
        insumo_descripcion: "",
        unidad_medida: "unidad",
        stock_actual: "0",
        stock_minimo: "0",
        insumo_activo: true,
      })
    }
  }, [insumo, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.insumo_nombre.trim()) {
      notifyError("El nombre es obligatorio")
      return
    }

    try {
      setLoading(true)

      const payload = {
        ...formData,
        suc_cod: sucCod,
        stock_actual: Number(formData.stock_actual),
        stock_minimo: Number(formData.stock_minimo),
      }

      if (insumo) {
        await insumosService.updateInsumo(insumo.insumo_id, payload)
        notifySuccess("Insumo actualizado correctamente")
      } else {
        await insumosService.createInsumo(payload)
        notifySuccess("Insumo creado correctamente")
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      notifyError("Error al guardar insumo")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <h3>{insumo ? "✏️ Editar Insumo" : "➕ Nuevo Insumo"}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {/* FORM CON ALTURA */}
        <form
          onSubmit={handleSubmit}
          className="modal-form"
        >
          {/* BODY SCROLL */}
          <div className="modal-body">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                name="insumo_nombre"
                value={formData.insumo_nombre}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="insumo_descripcion"
                value={formData.insumo_descripcion}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Unidad de medida</label>
                <select
                  name="unidad_medida"
                  value={formData.unidad_medida}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                  <option value="unidad">unidad</option>
                  <option value="bocha">bocha</option>
                  <option value="pote">pote</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stock actual</label>
                <input
                  type="number"
                  name="stock_actual"
                  value={formData.stock_actual}
                  onChange={handleChange}
                  className="form-input"
                  disabled={!!insumo}
                />
              </div>

              <div className="form-group">
                <label>Stock mínimo</label>
                <input
                  type="number"
                  name="stock_minimo"
                  value={formData.stock_minimo}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {insumo && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="insumo_activo"
                  checked={formData.insumo_activo}
                  onChange={handleChange}
                />
                Insumo activo
              </label>
            )}
          </div>

          {/* FOOTER FIJO */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : insumo ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
