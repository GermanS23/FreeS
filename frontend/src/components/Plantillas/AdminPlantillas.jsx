import React, { useState, useEffect } from 'react';
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
  CFormCheck
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilSettings } from '@coreui/icons';
import PlantillasService from '../../services/plantilla.service';
import "./AdminPlantilla.css"

const TIPOS_PLANTILLA = [
  { value: 'menu', label: 'Menú' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'lista', label: 'Lista' },
  { value: 'detalle', label: 'Detalle' }
];

const AdminPlantillas = () => {
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPlantilla, setCurrentPlantilla] = useState(null);
  const [formData, setFormData] = useState({
    plan_nomb: '',
    plan_tipo: '',
    plan_config: {}
  });
  const [configFields, setConfigFields] = useState([
    { key: 'colorFondo', label: 'Color de Fondo', type: 'color', value: '#ffffff' },
    { key: 'colorTexto', label: 'Color de Texto', type: 'color', value: '#000000' },
    { key: 'fuenteTitulo', label: 'Fuente del Título', type: 'select', value: 'Arial', options: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana'] },
    { key: 'fuenteTexto', label: 'Fuente del Texto', type: 'select', value: 'Arial', options: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana'] },
    { key: 'tamanoFuenteTitulo', label: 'Tamaño de Fuente del Título', type: 'text', value: '24px' },
    { key: 'tamanoFuenteTexto', label: 'Tamaño de Fuente del Texto', type: 'text', value: '16px' },
    { key: 'mostrarLogo', label: 'Mostrar Logo', type: 'checkbox', value: true },
    { key: 'mostrarFooter', label: 'Mostrar Pie de Página', type: 'checkbox', value: true }
  ]);

  // Cargar plantillas al iniciar
  useEffect(() => {
    fetchPlantillas();
  }, []);

  // Función para obtener plantillas
  const fetchPlantillas = async () => {
    try {
      setLoading(true);
      const response = await PlantillasService.getPlantillas();
      setPlantillas(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar plantillas:', err);
      setError('Error al cargar las plantillas. Por favor, intente nuevamente.');
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario básico
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar cambios en los campos de configuración
  const handleConfigChange = (key, value) => {
    setConfigFields(prevFields => 
      prevFields.map(field => 
        field.key === key ? { ...field, value } : field
      )
    );
  };

  // Abrir modal para crear/editar
  const openModal = (plantilla = null) => {
    if (plantilla) {
      // Modo edición
      setCurrentPlantilla(plantilla);
      setFormData({
        plan_nomb: plantilla.plan_nomb,
        plan_tipo: plantilla.plan_tipo || '',
        plan_config: plantilla.plan_config || {}
      });
      
      // Actualizar campos de configuración con los valores de la plantilla
      if (plantilla.plan_config) {
        setConfigFields(prevFields => 
          prevFields.map(field => ({
            ...field,
            value: plantilla.plan_config[field.key] !== undefined 
              ? plantilla.plan_config[field.key] 
              : field.value
          }))
        );
      }
    } else {
      // Modo creación
      setCurrentPlantilla(null);
      setFormData({
        plan_nomb: '',
        plan_tipo: '',
        plan_config: {}
      });
      
      // Resetear campos de configuración a valores por defecto
      setConfigFields(prevFields => 
        prevFields.map(field => ({
          ...field,
          value: field.type === 'checkbox' ? true : 
                 field.type === 'color' ? (field.key === 'colorFondo' ? '#ffffff' : '#000000') :
                 field.type === 'select' ? field.options[0] : 
                 field.key.includes('tamanoFuente') ? (field.key.includes('Titulo') ? '24px' : '16px') : ''
        }))
      );
    }
    setShowModal(true);
  };

  // Guardar plantilla (crear o actualizar)
  const savePlantilla = async () => {
    try {
      // Construir objeto de configuración a partir de los campos
      const config = {};
      configFields.forEach(field => {
        config[field.key] = field.value;
      });
      
      const dataToSave = {
        ...formData,
        plan_config: config
      };
      
      if (currentPlantilla) {
        // Actualizar
        await PlantillasService.updatePlantilla(currentPlantilla.plan_cod, dataToSave);
      } else {
        // Crear
        await PlantillasService.createPlantilla(dataToSave);
      }
      setShowModal(false);
      fetchPlantillas();
    } catch (err) {
      console.error('Error al guardar plantilla:', err);
      setError('Error al guardar la plantilla. Por favor, intente nuevamente.');
    }
  };

  // Eliminar plantilla
  const deletePlantilla = async (plan_cod) => {
    if (window.confirm('¿Está seguro de eliminar esta plantilla? Esta acción no se puede deshacer.')) {
      try {
        await PlantillasService.deletePlantilla(plan_cod);
        fetchPlantillas();
      } catch (err) {
        console.error('Error al eliminar plantilla:', err);
        if (err.response && err.response.status === 400) {
          setError('No se puede eliminar la plantilla porque tiene pantallas asociadas.');
        } else {
          setError('Error al eliminar la plantilla. Por favor, intente nuevamente.');
        }
      }
    }
  };

  // Renderizar campos de configuración según su tipo
  const renderConfigField = (field) => {
    switch (field.type) {
      case 'color':
        return (
          <CInputGroup className="mb-3" key={field.key}>
            <CInputGroupText>{field.label}</CInputGroupText>
            <CFormInput
              type="color"
              value={field.value}
              onChange={(e) => handleConfigChange(field.key, e.target.value)}
            />
          </CInputGroup>
        );
      case 'select':
        return (
          <CInputGroup className="mb-3" key={field.key}>
            <CInputGroupText>{field.label}</CInputGroupText>
            <CFormSelect
              value={field.value}
              onChange={(e) => handleConfigChange(field.key, e.target.value)}
            >
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </CFormSelect>
          </CInputGroup>
        );
      case 'checkbox':
        return (
          <div className="mb-3" key={field.key}>
            <CFormCheck
              id={`check-${field.key}`}
              label={field.label}
              checked={field.value}
              onChange={(e) => handleConfigChange(field.key, e.target.checked)}
            />
          </div>
        );
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
        );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div className="admin-plantillas-container">
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle>Administración de Plantillas</CCardTitle>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          
          <CButton 
            color="primary" 
            className="mb-3"
            onClick={() => openModal()}
          >
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Plantilla
          </CButton>

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Código</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Pantallas Asociadas</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {plantillas.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    No hay plantillas disponibles
                  </CTableDataCell>
                </CTableRow>
              ) : (
                plantillas.map(plantilla => (
                  <CTableRow key={plantilla.plan_cod}>
                    <CTableDataCell>{plantilla.plan_cod}</CTableDataCell>
                    <CTableDataCell>{plantilla.plan_nomb}</CTableDataCell>
                    <CTableDataCell>
                      {TIPOS_PLANTILLA.find(t => t.value === plantilla.plan_tipo)?.label || plantilla.plan_tipo}
                    </CTableDataCell>
                    <CTableDataCell>
                      {plantilla.pantallas ? plantilla.pantallas.length : 0}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton 
                        color="info" 
                        size="sm" 
                        className="me-2"
                        onClick={() => openModal(plantilla)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton 
                        color="danger" 
                        size="sm"
                        onClick={() => deletePlantilla(plantilla.plan_cod)}
                      >
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

      {/* Modal para crear/editar plantilla */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>
            {currentPlantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6}>
                <h5>Información Básica</h5>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
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
                  <label className="form-label">Tipo</label>
                  <CFormSelect
                    name="plan_tipo"
                    value={formData.plan_tipo}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione un tipo</option>
                    {TIPOS_PLANTILLA.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>
              <CCol md={6}>
                <h5>Configuración</h5>
                {configFields.map(field => renderConfigField(field))}
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
  );
};

export default AdminPlantillas;