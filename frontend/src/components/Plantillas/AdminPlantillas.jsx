"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
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
  CSpinner,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
  CFormLabel,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilPlus, cilPencil, cilTrash, cilImage, cilCloudUpload } from "@coreui/icons"
import PlantillasService from "../../services/plantilla.service"
import { getPlantillaDefault } from "../Pantallas/PlantillasDefault"
import "./AdminPlantilla.css"

const TIPOS_PLANTILLA = [
  { value: "menuSabores", label: "Menú de Sabores" },
  { value: "menuProductos", label: "Menú de Productos" },
  { value: "dashboard", label: "Dashboard" },
  { value: "lista", label: "Lista" },
]

const AdminPlantillas = () => {
  const [plantillas, setPlantillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPlantilla, setCurrentPlantilla] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [imagenFile, setImagenFile] = useState(null)
  const [formData, setFormData] = useState({
    plan_nomb: "",
    plan_tipo: "",
    plan_imagen: "",
    plan_config: {},
  })

  const [configFields, setConfigFields] = useState([
    { key: "colorFondo", label: "Color de Fondo", type: "color", value: "#ffffff" },
    { key: "colorTitulo", label: "Color del Título", type: "color", value: "#000000" },
    { key: "colorTexto", label: "Color de Sabores (Texto)", type: "color", value: "#000000" },
    {
      key: "fuenteTitulo",
      label: "Fuente del Título",
      type: "select",
      value: "Arial",
      options: ["Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana"],
    },
    {
      key: "fuenteTexto",
      label: "Fuente del Texto",
      type: "select",
      value: "Arial",
      options: ["Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana"],
    },
    { key: "tamanoFuenteTitulo", label: "Tamaño Fuente Título", type: "text", value: "24px" },
    { key: "tamanoFuenteTexto", label: "Tamaño Fuente Texto", type: "text", value: "16px" },
    { key: "mostrarLogo", label: "Mostrar Logo", type: "checkbox", value: true },
    { key: "mostrarFooter", label: "Mostrar Pie de Página", type: "checkbox", value: true },
  ])

  useEffect(() => {
    fetchPlantillas()
  }, [])

  const fetchPlantillas = async () => {
    try {
      setLoading(true)
      const response = await PlantillasService.getPlantillas()
      setPlantillas(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error al cargar plantillas:", err)
      setError("Error al cargar las plantillas.")
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagenFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagenPreview(previewUrl)
    }
  }

  const removeImage = () => {
    setImagenPreview(null)
    setImagenFile(null)
  }

  const handleConfigChange = (key, value) => {
    setConfigFields((prevFields) => prevFields.map((field) => (field.key === key ? { ...field, value } : field)))
  }

  const openModal = (plantilla = null) => {
    setError(null);
    if (plantilla) {
      setCurrentPlantilla(plantilla)
      setFormData({
        plan_nomb: plantilla.plan_nomb,
        plan_tipo: plantilla.plan_tipo || "",
        plan_imagen: plantilla.plan_imagen || "",
        plan_config: plantilla.plan_config || {},
      })
      setImagenPreview(plantilla.plan_imagen ? `http://localhost:3000${plantilla.plan_imagen}` : null)
      
      if (plantilla.plan_config) {
        setConfigFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            value: plantilla.plan_config[field.key] !== undefined ? plantilla.plan_config[field.key] : field.value,
          })),
        )
      }
    } else {
      setCurrentPlantilla(null)
      setImagenPreview(null)
      setImagenFile(null)
      setFormData({ plan_nomb: "", plan_tipo: "", plan_imagen: "", plan_config: {} })
    }
    setShowModal(true)
  }

  const savePlantilla = async () => {
    try {
      const config = {}
      configFields.forEach((field) => { config[field.key] = field.value })

      const formDataToSend = new FormData()
      formDataToSend.append("plan_nomb", formData.plan_nomb)
      formDataToSend.append("plan_tipo", formData.plan_tipo)
      formDataToSend.append("plan_config", JSON.stringify(config))

      if (imagenFile) {
        formDataToSend.append("imagen", imagenFile)
      }

      if (currentPlantilla) {
        await PlantillasService.updatePlantilla(currentPlantilla.plan_cod, formDataToSend)
      } else {
        await PlantillasService.createPlantilla(formDataToSend)
      }

      setShowModal(false)
      fetchPlantillas()
    } catch (err) {
      setError("Error al guardar la plantilla.")
    }
  }

  const renderConfigField = (field) => {
    return (
      <CCol md={6} key={field.key} className="mb-3">
        {field.type === "checkbox" ? (
          <div className="p-2 border rounded bg-light mt-4">
            <CFormCheck
              id={`check-${field.key}`}
              label={field.label}
              checked={field.value}
              onChange={(e) => handleConfigChange(field.key, e.target.checked)}
            />
          </div>
        ) : (
          <>
            <CFormLabel className="small fw-bold">{field.label}</CFormLabel>
            {field.type === "select" ? (
              <CFormSelect value={field.value} onChange={(e) => handleConfigChange(field.key, e.target.value)}>
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </CFormSelect>
            ) : (
              <CFormInput
                type={field.type}
                value={field.value}
                onChange={(e) => handleConfigChange(field.key, e.target.value)}
              />
            )}
          </>
        )}
      </CCol>
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CCard style={{ padding: 50, borderRadius: 10 }}>
      <style>
        {`
          .custom-modal-centered .modal-dialog {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: auto !important;
          }
          .custom-modal-centered .modal-content {
            border-radius: 12px !important;
            overflow: hidden !important;
          }
        `}
      </style>

      <CRow>
        <CCol xs={12}>
          <h4 className="card-title mb-0 text-dark">Administración de Plantillas</h4>
        </CCol>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ padding: 20 }}>
          <CButton color="dark" onClick={() => openModal()}>
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Plantilla
          </CButton>
        </div>

        <CCol xs={12}>
          {error && <CAlert color="danger">{error}</CAlert>}
          <CCard className="mb-4">
            <CCardBody className="text-medium-emphasis small">
              <CTable align="middle" responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell align="center">Nombre</CTableHeaderCell>
                    <CTableHeaderCell align="center">Tipo</CTableHeaderCell>
                    <CTableHeaderCell align="center">Imagen</CTableHeaderCell>
                    <CTableHeaderCell align="center">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {plantillas.map((plantilla) => (
                    <CTableRow key={plantilla.plan_cod}>
                      <CTableDataCell align="center">{plantilla.plan_nomb}</CTableDataCell>
                      <CTableDataCell align="center">
                        {TIPOS_PLANTILLA.find((t) => t.value === plantilla.plan_tipo)?.label || plantilla.plan_tipo}
                      </CTableDataCell>
                      <CTableDataCell align="center">
                        {plantilla.plan_imagen && (
                          <img
                            src={`http://localhost:3000${plantilla.plan_imagen}`}
                            alt="thumb"
                            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        )}
                      </CTableDataCell>
                      <CTableDataCell align="center">
                        <CButton color="link" onClick={() => openModal(plantilla)}>
                          <CIcon icon={cilPencil} className="text-info" />
                        </CButton>
                        <CButton color="link" onClick={() => {/* logic delete */}}>
                          <CIcon icon={cilTrash} className="text-danger" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal 
        visible={showModal} 
        onClose={() => setShowModal(false)} 
        size="xl" 
        backdrop="static"
        className="custom-modal-centered"
      >
        <CModalHeader style={{ backgroundColor: '#b191ff' }} className="border-0">
          <CModalTitle className="text-center w-100 fw-bold text-dark">
            {currentPlantilla ? "Editar Plantilla" : "Nueva Plantilla"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 bg-white">
          <CForm>
            <CRow>
              <CCol md={5} className="border-end">
                <h6 className="fw-bold mb-3 text-primary">Información Básica</h6>
                <div className="mb-3">
                  <CFormLabel>Nombre</CFormLabel>
                  <CFormInput name="plan_nomb" value={formData.plan_nomb} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <CFormLabel>Tipo</CFormLabel>
                  <CFormSelect name="plan_tipo" value={formData.plan_tipo} onChange={handleInputChange}>
                    <option value="">Seleccione tipo</option>
                    {TIPOS_PLANTILLA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </CFormSelect>
                </div>
                <div className="mb-3">
                  <CFormLabel>Imagen de Fondo</CFormLabel>
                  <div className="text-center border p-3 rounded bg-light">
                    {imagenPreview ? (
                      <>
                        <img src={imagenPreview} alt="preview" className="img-fluid mb-2 rounded" style={{maxHeight: '150px'}} />
                        <CButton size="sm" color="danger" variant="ghost" onClick={removeImage}>Cambiar</CButton>
                      </>
                    ) : (
                      <CFormInput type="file" onChange={handleImageChange} />
                    )}
                  </div>
                </div>
              </CCol>
              <CCol md={7}>
                <h6 className="fw-bold mb-3 text-primary">Configuración de Estilo</h6>
                <CRow>
                  {configFields.map(field => renderConfigField(field))}
                </CRow>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="border-0 justify-content-center pb-4">
          <CButton color="secondary" className="px-4" onClick={() => setShowModal(false)}>Cancelar</CButton>
          <CButton color="dark" className="px-4" onClick={savePlantilla}>Guardar Cambios</CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default AdminPlantillas