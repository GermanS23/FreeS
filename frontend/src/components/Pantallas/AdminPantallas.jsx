"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CSpinner,
  CAlert,
  CFormLabel,
  CFormCheck,
  CBadge,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilPlus, cilPencil, cilTrash, cilScreenDesktop } from "@coreui/icons"
import PantallasService from "../../services/pantalla.service"
import PlantillasService from "../../services/plantilla.service"
import { getAvailableComponents } from "./Registro"

const AdminPantallas = () => {
  const [pantallas, setPantallas] = useState([])
  const [plantillas, setPlantillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPantalla, setCurrentPantalla] = useState(null)
  const [formData, setFormData] = useState({
    pan_nomb: "",
    pan_desc: "",
    pan_componente: "SaboresMenu",
    pan_activa: true,
    plan_cod: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pantallasRes, plantillasRes] = await Promise.all([
        PantallasService.getPantallas(),
        PlantillasService.getPlantillas(),
      ])
      console.log("[v0] Pantallas cargadas:", pantallasRes.data)
      console.log("[v0] Plantillas cargadas:", plantillasRes.data)
      setPantallas(pantallasRes.data)
      setPlantillas(plantillasRes.data)
      setLoading(false)
    } catch (err) {
      console.error("[v0] Error al cargar datos:", err)
      setError("Error al cargar los datos. Por favor, intente nuevamente.")
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const openModal = (pantalla = null) => {
    if (pantalla) {
      setCurrentPantalla(pantalla)
      setFormData({
        pan_nomb: pantalla.pan_nomb,
        pan_desc: pantalla.pan_desc || "",
        pan_componente: pantalla.pan_componente || "SaboresMenu",
        pan_activa: pantalla.pan_activa !== undefined ? pantalla.pan_activa : true,
        plan_cod: pantalla.plan_cod || "",
      })
    } else {
      setCurrentPantalla(null)
      setFormData({
        pan_nomb: "",
        pan_desc: "",
        pan_componente: "SaboresMenu",
        pan_activa: true,
        plan_cod: "",
      })
    }
    setShowModal(true)
  }

  const savePantalla = async () => {
    try {
      if (!formData.pan_nomb || !formData.pan_componente) {
        setError("Por favor complete todos los campos requeridos")
        return
      }

      const dataToSave = {
        ...formData,
        plan_cod: formData.plan_cod || null,
      }

      console.log("[v0] Guardando pantalla:", dataToSave)

      if (currentPantalla) {
        await PantallasService.updatePantalla(currentPantalla.pan_cod, dataToSave)
      } else {
        await PantallasService.createPantalla(dataToSave)
      }
      setShowModal(false)
      fetchData()
      setError(null)
    } catch (err) {
      console.error("[v0] Error al guardar pantalla:", err)
      setError("Error al guardar la pantalla. Por favor, intente nuevamente.")
    }
  }

  const deletePantalla = async (pan_cod) => {
    if (window.confirm("¿Está seguro de eliminar esta pantalla? Esta acción no se puede deshacer.")) {
      try {
        await PantallasService.deletePantalla(pan_cod)
        fetchData()
      } catch (err) {
        console.error("[v0] Error al eliminar pantalla:", err)
        setError("Error al eliminar la pantalla. Por favor, intente nuevamente.")
      }
    }
  }

  const toggleActiva = async (pantalla) => {
    try {
      await PantallasService.updatePantalla(pantalla.pan_cod, {
        ...pantalla,
        pan_activa: !pantalla.pan_activa,
      })
      fetchData()
    } catch (err) {
      console.error("[v0] Error al actualizar estado:", err)
      setError("Error al actualizar el estado de la pantalla.")
    }
  }

  const availableComponents = getAvailableComponents()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="admin-pantallas-container">
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle>
            <CIcon icon={cilScreenDesktop} className="me-2" />
            Administración de Pantallas
          </CCardTitle>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

          <CButton color="primary" className="mb-3" onClick={() => openModal()}>
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Pantalla
          </CButton>

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Código</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Componente</CTableHeaderCell>
                <CTableHeaderCell>Plantilla</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {pantallas.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-center">
                    No hay pantallas disponibles
                  </CTableDataCell>
                </CTableRow>
              ) : (
                pantallas.map((pantalla) => (
                  <CTableRow key={pantalla.pan_cod}>
                    <CTableDataCell>{pantalla.pan_cod}</CTableDataCell>
                    <CTableDataCell>
                      <strong>{pantalla.pan_nomb}</strong>
                      {pantalla.pan_desc && <div className="text-muted small">{pantalla.pan_desc}</div>}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">
                        {availableComponents.find((c) => c.id === pantalla.pan_componente)?.name ||
                          pantalla.pan_componente}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {pantalla.Plantillum ? (
                        <CBadge color="secondary">{pantalla.Plantillum.plan_nomb}</CBadge>
                      ) : (
                        <span className="text-muted">Sin plantilla</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormCheck
                        type="switch"
                        id={`switch-${pantalla.pan_cod}`}
                        checked={pantalla.pan_activa}
                        onChange={() => toggleActiva(pantalla)}
                        label={pantalla.pan_activa ? "Activa" : "Inactiva"}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" size="sm" className="me-2" onClick={() => openModal(pantalla)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" onClick={() => deletePantalla(pantalla.pan_cod)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>{currentPantalla ? "Editar Pantalla" : "Nueva Pantalla"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nombre *</CFormLabel>
              <CFormInput
                type="text"
                name="pan_nomb"
                value={formData.pan_nomb}
                onChange={handleInputChange}
                placeholder="Nombre de la pantalla"
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Descripción</CFormLabel>
              <CFormTextarea
                name="pan_desc"
                value={formData.pan_desc}
                onChange={handleInputChange}
                placeholder="Descripción de la pantalla"
                rows={3}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Componente *</CFormLabel>
              <CFormSelect name="pan_componente" value={formData.pan_componente} onChange={handleInputChange} required>
                <option value="">Seleccione un componente</option>
                {availableComponents.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} - {comp.description}
                  </option>
                ))}
              </CFormSelect>
              <small className="text-muted">El componente determina cómo se mostrará el contenido en la pantalla</small>
            </div>

            <div className="mb-3">
              <CFormLabel>Plantilla (Fondo)</CFormLabel>
              <CFormSelect name="plan_cod" value={formData.plan_cod} onChange={handleInputChange}>
                <option value="">Sin plantilla</option>
                {plantillas.map((plantilla) => (
                  <option key={plantilla.plan_cod} value={plantilla.plan_cod}>
                    {plantilla.plan_nomb} {plantilla.plan_tipo && `(${plantilla.plan_tipo})`}
                  </option>
                ))}
              </CFormSelect>
              <small className="text-muted">La plantilla define el fondo y estilos visuales de la pantalla</small>
            </div>

            <div className="mb-3">
              <CFormCheck
                id="pan_activa"
                name="pan_activa"
                checked={formData.pan_activa}
                onChange={handleInputChange}
                label="Pantalla activa (visible en el display)"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={savePantalla}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AdminPantallas
