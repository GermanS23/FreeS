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
  CFormCheck,
  CBadge,
  CFormLabel,
  CFormSwitch
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilPlus, cilPencil, cilTrash, cilScreenDesktop } from "@coreui/icons"
import PantallasService from "../../services/pantalla.service"
import PlantillasService from "../../services/plantilla.service"
import CategoriaSabService from "../../api/catsab"
import { getAvailableComponents } from "./Registro"

const AdminPantallas = () => {
  const [pantallas, setPantallas] = useState([])
  const [plantillas, setPlantillas] = useState([])
  const [catsabList, setCatsabList] = useState([])
  const [loading, setLoading] = useState(true)
  const [catsabLoading, setCatsabLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPantalla, setCurrentPantalla] = useState(null)
  const [formData, setFormData] = useState({
    pan_nomb: "",
    pan_desc: "",
    pan_componente: "SaboresMenu",
    pan_activa: true,
    plan_cod: "",
    pan_config: {},
    pan_catsab_cod: [],
  })

  useEffect(() => {
    fetchData()
    loadCategorias()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pantallasRes, plantillasRes] = await Promise.all([
        PantallasService.getPantallas(),
        PlantillasService.getPlantillas(),
      ])
      setPantallas(pantallasRes.data)
      setPlantillas(plantillasRes.data)
      setLoading(false)
    } catch (err) {
      setError("Error al cargar los datos.")
      setLoading(false)
    }
  }

  const loadCategorias = async () => {
    try {
      setCatsabLoading(true)
      const res = await CategoriaSabService.getCategoriasSab()
      const list = Array.isArray(res.data) ? res.data : (res.data?.items || [])
      setCatsabList(list)
    } catch (err) {
      setCatsabList([])
    } finally {
      setCatsabLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const openModal = (pantalla = null) => {
    if (pantalla) {
      const catsFromResponse =
        (pantalla.Categorias && pantalla.Categorias.map((c) => c.catsab_cod)) ||
        (pantalla.CategoriaSabs && pantalla.CategoriaSabs.map((c) => c.catsab_cod)) ||
        (pantalla.Categoria && pantalla.Categoria.catsab_cod ? [pantalla.Categoria.catsab_cod] : []) ||
        []

      setCurrentPantalla(pantalla)
      setFormData({
        pan_nomb: pantalla.pan_nomb,
        pan_desc: pantalla.pan_desc || "",
        pan_componente: pantalla.pan_componente || "SaboresMenu",
        pan_activa: pantalla.pan_activa !== undefined ? pantalla.pan_activa : true,
        plan_cod: pantalla.plan_cod || "",
        pan_config: pantalla.pan_config || {},
        pan_catsab_cod: catsFromResponse,
      })
    } else {
      setCurrentPantalla(null)
      setFormData({
        pan_nomb: "",
        pan_desc: "",
        pan_componente: "SaboresMenu",
        pan_activa: true,
        plan_cod: "",
        pan_config: {},
        pan_catsab_cod: [],
      })
    }
    setShowModal(true)
  }

  const savePantalla = async () => {
    try {
      if (!formData.pan_nomb || !formData.pan_componente) {
        setError("Complete los campos obligatorios")
        return
      }
      if (currentPantalla) {
        await PantallasService.updatePantalla(currentPantalla.pan_cod, formData)
      } else {
        await PantallasService.createPantalla(formData)
      }
      await fetchData()
      setShowModal(false)
    } catch (err) {
      setError("Error al guardar la pantalla.")
    }
  }

  const deletePantalla = async (pan_cod) => {
    if (window.confirm("¿Está seguro de eliminar esta pantalla?")) {
      try {
        await PantallasService.deletePantalla(pan_cod)
        fetchData()
      } catch (err) {
        setError("Error al eliminar.")
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
      setError("Error al actualizar estado.")
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="admin-pantallas-container">
      {/* TRUCO CSS PARA FORZAR EL CENTRADO */}
      <style>
        {`
          .modal.fade.show {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .modal-dialog {
            margin: auto !important;
          }
        `}
      </style>

      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="bg-white py-3">
          <CCardTitle className="mb-0">
            <CIcon icon={cilScreenDesktop} className="me-2 text-primary" />
            Administración de Pantallas
          </CCardTitle>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger" dismissible onClose={() => setError(null)}>{error}</CAlert>}

          <CButton color="primary" className="mb-4 shadow-sm" onClick={() => openModal()}>
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Pantalla
          </CButton>

          <CTable hover responsive align="middle" className="border-top">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Componente</CTableHeaderCell>
                <CTableHeaderCell>Plantilla</CTableHeaderCell>
                <CTableHeaderCell>Categorías</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {pantallas.map((pantalla) => {
                const plantilla = pantalla.Plantilla || pantalla.Plantillum || null
                const categorias = pantalla.Categorias || pantalla.CategoriaSabs || []
                return (
                  <CTableRow key={pantalla.pan_cod}>
                    <CTableDataCell>
                      <div className="fw-bold">{pantalla.pan_nomb}</div>
                      <div className="text-muted small">{pantalla.pan_desc}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info" shape="rounded-pill">
                        {getAvailableComponents().find((c) => c.id === pantalla.pan_componente)?.name || pantalla.pan_componente}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {plantilla ? <CBadge color="secondary" variant="outline">{plantilla.plan_nomb}</CBadge> : <span className="text-muted small">Sin plantilla</span>}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex flex-wrap gap-1">
                        {categorias.map((c) => (
                          <CBadge color="dark" key={c.catsab_cod} style={{fontSize: '10px'}}>{c.catsab_name || c.name}</CBadge>
                        ))}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CFormSwitch
                        checked={pantalla.pan_activa}
                        onChange={() => toggleActiva(pantalla)}
                        size="lg"
                      />
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton color="link" onClick={() => openModal(pantalla)}><CIcon icon={cilPencil} className="text-info" size="lg"/></CButton>
                      <CButton color="link" onClick={() => deletePantalla(pantalla.pan_cod)}><CIcon icon={cilTrash} className="text-danger" size="lg"/></CButton>
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* MODAL CON PORTAL DESACTIVADO Y ALIGNMENT CENTER */}
      <CModal 
        visible={showModal} 
        onClose={() => setShowModal(false)} 
        size="lg" 
        alignment="center" 
        backdrop="static"
        portal={false} // Importante: renderiza dentro del DOM del componente
      >
        <CModalHeader className="bg-light">
          <CModalTitle className="fw-bold">{currentPantalla ? "Editar Pantalla" : "Nueva Pantalla"}</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <CForm>
            <div className="mb-3">
              <CFormLabel className="fw-bold">Nombre *</CFormLabel>
              <CFormInput name="pan_nomb" value={formData.pan_nomb} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <CFormLabel className="fw-bold">Descripción</CFormLabel>
              <CFormTextarea name="pan_desc" value={formData.pan_desc} onChange={handleInputChange} rows={2} />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormLabel className="fw-bold">Componente *</CFormLabel>
                <CFormSelect name="pan_componente" value={formData.pan_componente} onChange={handleInputChange} required>
                  {getAvailableComponents().map((comp) => (<option key={comp.id} value={comp.id}>{comp.name}</option>))}
                </CFormSelect>
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel className="fw-bold">Plantilla</CFormLabel>
                <CFormSelect name="plan_cod" value={formData.plan_cod} onChange={handleInputChange}>
                  <option value="">Sin plantilla</option>
                  {plantillas.map((p) => (<option key={p.plan_cod} value={p.plan_cod}>{p.plan_nomb}</option>))}
                </CFormSelect>
              </div>
            </div>

            <div className="mb-4">
              <CFormLabel className="fw-bold d-block mb-2">Categorías de Sabores</CFormLabel>
              <div className="border rounded p-3 bg-light d-flex flex-wrap gap-2">
                {catsabLoading ? <CSpinner size="sm" /> : catsabList.map((c) => {
                  const isSelected = formData.pan_catsab_cod.includes(c.catsab_cod);
                  return (
                    <CBadge
                      key={c.catsab_cod}
                      color={isSelected ? "dark" : "secondary"}
                      shape="rounded-pill"
                      style={{ cursor: 'pointer', padding: '8px 12px', opacity: isSelected ? 1 : 0.6 }}
                      onClick={() => {
                        const current = [...formData.pan_catsab_cod];
                        const idx = current.indexOf(c.catsab_cod);
                        idx > -1 ? current.splice(idx, 1) : current.push(c.catsab_cod);
                        setFormData({ ...formData, pan_catsab_cod: current });
                      }}
                    >
                      {c.catsab_name} {isSelected ? '✕' : '+'}
                    </CBadge>
                  );
                })}
              </div>
            </div>

            <div className="border-top pt-3">
              <CFormCheck type="switch" label="Pantalla activa" checked={formData.pan_activa} onChange={handleInputChange} name="pan_activa" />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter className="border-0">
          <CButton color="secondary" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</CButton>
          <CButton color="primary" className="px-4 shadow-sm" onClick={savePantalla}>Guardar Cambios</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AdminPantallas