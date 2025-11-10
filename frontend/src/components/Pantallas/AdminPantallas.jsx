"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
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
import { getPlantillaDefault } from "./PlantillasDefault"
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
    { key: "colorTexto", label: "Color de Texto", type: "color", value: "#000000" },
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
    { key: "tamanoFuenteTitulo", label: "Tamaño de Fuente del Título", type: "text", value: "24px" },
    { key: "tamanoFuenteTexto", label: "Tamaño de Fuente del Texto", type: "text", value: "16px" },
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
      setError("Error al cargar las plantillas. Por favor, intente nuevamente.")
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Por favor seleccione un archivo de imagen válido")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB")
        return
      }

      // Guardar el archivo directamente sin convertir a base64
      setImagenFile(file)

      // Crear preview usando URL.createObjectURL (más eficiente)
      const previewUrl = URL.createObjectURL(file)
      setImagenPreview(previewUrl)
    }
  }

  const removeImage = () => {
    // Liberar la URL del preview
    if (imagenPreview && imagenPreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagenPreview)
    }
    setImagenPreview(null)
    setImagenFile(null)
  }

  const handleConfigChange = (key, value) => {
    setConfigFields((prevFields) => prevFields.map((field) => (field.key === key ? { ...field, value } : field)))
  }

  const cargarPlantillaDefault = (tipo) => {
    const plantillaDefault = getPlantillaDefault(tipo)

    if (plantillaDefault) {
      setFormData({
        ...formData,
        plan_nomb: plantillaDefault.nombre,
        plan_tipo: tipo,
      })

      const newConfigFields = Object.entries(plantillaDefault.config).map(([key, value]) => {
        const existingField = configFields.find((f) => f.key === key)
        if (existingField) {
          return { ...existingField, value }
        }
        return {
          key,
          label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
          type: typeof value === "boolean" ? "checkbox" : typeof value === "number" ? "number" : "text",
          value,
        }
      })

      setConfigFields(newConfigFields)
    }
  }

  const openModal = (plantilla = null) => {
    if (plantilla) {
      setCurrentPlantilla(plantilla)
      setFormData({
        plan_nomb: plantilla.plan_nomb,
        plan_tipo: plantilla.plan_tipo || "",
        plan_imagen: plantilla.plan_imagen || "",
        plan_config: plantilla.plan_config || {},
      })

      if (plantilla.plan_imagen) {
        setImagenPreview(plantilla.plan_imagen)
      }

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
      setFormData({
        plan_nomb: "",
        plan_tipo: "",
        plan_imagen: "",
        plan_config: {},
      })

      setConfigFields((prevFields) =>
        prevFields.map((field) => ({
          ...field,
          value:
            field.type === "checkbox"
              ? true
              : field.type === "color"
                ? field.key === "colorFondo"
                  ? "#ffffff"
                  : "#000000"
                : field.type === "select"
                  ? field.options[0]
                  : field.key.includes("tamanoFuente")
                    ? field.key.includes("Titulo")
                      ? "24px"
                      : "16px"
                    : "",
        })),
      )
    }
    setShowModal(true)
  }

  const savePlantilla = async () => {
    try {
      const config = {}
      configFields.forEach((field) => {
        config[field.key] = field.value
      })

      const dataToSave = {
        plan_nomb: formData.plan_nomb,
        plan_tipo: formData.plan_tipo,
        plan_config: config,
      }

      if (currentPlantilla) {
        // Actualizar: enviar el archivo solo si se seleccionó uno nuevo
        await PlantillasService.updatePlantilla(currentPlantilla.plan_cod, dataToSave, imagenFile)
      } else {
        // Crear: enviar el archivo
        await PlantillasService.createPlantilla(dataToSave, imagenFile)
      }
      setShowModal(false)
      fetchPlantillas()
    } catch (err) {
      console.error("Error al guardar plantilla:", err)
      setError("Error al guardar la plantilla. Por favor, intente nuevamente.")
    }
  }

  const deletePlantilla = async (plan_cod) => {
    if (window.confirm("¿Está seguro de eliminar esta plantilla? Esta acción no se puede deshacer.")) {
      try {
        await PlantillasService.deletePlantilla(plan_cod)
        fetchPlantillas()
      } catch (err) {
        console.error("Error al eliminar plantilla:", err)
        if (err.response && err.response.status === 400) {
          setError("No se puede eliminar la plantilla porque tiene pantallas asociadas.")
        } else {
          setError("Error al eliminar la plantilla. Por favor, intente nuevamente.")
        }
      }
    }
  }

  const renderConfigField = (field) => {
    switch (field.type) {
      case "color":
        return (
          <CInputGroup className="mb-3" key={field.key}>
            <CInputGroupText>{field.label}</CInputGroupText>
            <CFormInput
              type="color"
              value={field.value}
              onChange={(e) => handleConfigChange(field.key, e.target.value)}
            />
          </CInputGroup>
        )
      case "select":
        return (
          <CInputGroup className="mb-3" key={field.key}>
            <CInputGroupText>{field.label}</CInputGroupText>
            <CFormSelect value={field.value} onChange={(e) => handleConfigChange(field.key, e.target.value)}>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </CFormSelect>
          </CInputGroup>
        )
      case "checkbox":
        return (
          <div className="mb-3" key={field.key}>
            <CFormCheck
              id={`check-${field.key}`}
              label={field.label}
              checked={field.value}
              onChange={(e) => handleConfigChange(field.key, e.target.checked)}
            />
          </div>
        )
      default:
        return (
          <CInputGroup className="mb-3" key={field.key}>
            <CInputGroupText>{field.label}</CInputGroupText>
            <CFormInput
              type="text"
              value={field.value}
              onChange={(e) => handleConfigChange(field.key, e.target.value)}
            />
          </CInputGroup>
        )
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
    <div className="admin-plantillas-container">
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle>Administración de Plantillas</CCardTitle>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

          <CButton color="primary" className="mb-3" onClick={() => openModal()}>
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Plantilla
          </CButton>

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Código</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Imagen</CTableHeaderCell>
                <CTableHeaderCell>Pantallas Asociadas</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {plantillas.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-center">
                    No hay plantillas disponibles
                  </CTableDataCell>
                </CTableRow>
              ) : (
                plantillas.map((plantilla) => (
                  <CTableRow key={plantilla.plan_cod}>
                    <CTableDataCell>{plantilla.plan_cod}</CTableDataCell>
                    <CTableDataCell>{plantilla.plan_nomb}</CTableDataCell>
                    <CTableDataCell>
                      {TIPOS_PLANTILLA.find((t) => t.value === plantilla.plan_tipo)?.label || plantilla.plan_tipo}
                    </CTableDataCell>
                    <CTableDataCell>
                      {plantilla.plan_imagen ? (
                        <img
                          src={plantilla.plan_imagen || "/placeholder.svg"}
                          alt={plantilla.plan_nomb}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          onError={(e) => {
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "inline"
                          }}
                        />
                      ) : null}
                      <CIcon
                        icon={cilImage}
                        size="xl"
                        className="text-muted"
                        style={{ display: plantilla.plan_imagen ? "none" : "inline" }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{plantilla.Pantallas ? plantilla.Pantallas.length : 0}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" size="sm" className="me-2" onClick={() => openModal(plantilla)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" onClick={() => deletePlantilla(plantilla.plan_cod)}>
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

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="xl">
        <CModalHeader>
          <CModalTitle>{currentPlantilla ? "Editar Plantilla" : "Nueva Plantilla"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6}>
                <h5>Información Básica</h5>
                <div className="mb-3">
                  <CFormLabel>Nombre</CFormLabel>
                  <CFormInput
                    type="text"
                    name="plan_nomb"
                    value={formData.plan_nomb}
                    onChange={handleInputChange}
                    placeholder="Nombre de la plantilla"
                    required
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Tipo</CFormLabel>
                  <CFormSelect
                    name="plan_tipo"
                    value={formData.plan_tipo}
                    onChange={(e) => {
                      handleInputChange(e)
                      cargarPlantillaDefault(e.target.value)
                    }}
                  >
                    <option value="">Seleccione un tipo</option>
                    {TIPOS_PLANTILLA.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </CFormSelect>
                  <small className="text-muted">
                    Al seleccionar un tipo, se cargarán valores predeterminados que puedes personalizar
                  </small>
                </div>

                <div className="mb-3">
                  <CFormLabel>Imagen de Fondo</CFormLabel>
                  <div className="border rounded p-3">
                    {imagenPreview ? (
                      <div className="text-center">
                        <img
                          src={imagenPreview || "/placeholder.svg"}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            objectFit: "contain",
                            marginBottom: "10px",
                          }}
                        />
                        <div>
                          <CButton color="danger" size="sm" onClick={removeImage}>
                            <CIcon icon={cilTrash} className="me-1" />
                            Eliminar Imagen
                          </CButton>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CIcon icon={cilCloudUpload} size="3xl" className="text-muted mb-2" />
                        <CFormInput type="file" accept="image/*" onChange={handleImageChange} />
                        <small className="text-muted">Formatos: JPG, PNG, GIF, WEBP. Máximo 5MB</small>
                      </div>
                    )}
                  </div>
                </div>
              </CCol>
              <CCol md={6}>
                <h5>Configuración de Estilo</h5>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {configFields.map((field) => renderConfigField(field))}
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={savePlantilla}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AdminPlantillas
