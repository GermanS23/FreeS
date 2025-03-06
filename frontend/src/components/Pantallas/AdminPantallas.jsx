import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CFormTextarea,
  CFormCheck,
  CSpinner,
  CAlert,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilSettings, cilScreenDesktop, cilOptions } from '@coreui/icons';
import PantallasService from '../../services/pantalla.service';
import PlantillasService from '../../services/plantilla.service';
import { getAllComponents, getComponent } from './Registro';
import './AdminPantallas.css';

const AdminPantallas = () => {
  const navigate = useNavigate();
  const [pantallas, setPantallas] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPantalla, setCurrentPantalla] = useState(null);
  const [formData, setFormData] = useState({
    pan_nomb: '',
    pan_desc: '',
    pan_componente: '',
    plan_cod: '',
    pan_config: {},
    pan_activa: true
  });
  const [componentes, setComponentes] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedComponentPreview, setSelectedComponentPreview] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  // Función para obtener datos
  const fetchData = async () => {
    try {
      setLoading(true);
      const [pantallasRes, plantillasRes] = await Promise.all([
        PantallasService.getPantallas(),
        PlantillasService.getPlantillas()
      ]);
      
      setPantallas(pantallasRes.data);
      setPlantillas(plantillasRes.data);
      setComponentes(getAllComponents());
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Si cambia el componente, actualizar la previsualización
      if (name === 'pan_componente') {
        const componentInfo = getComponent(value);
        setSelectedComponentPreview(componentInfo);
        
        // Si el componente tiene configuración por defecto, usarla
        if (componentInfo && componentInfo.defaultConfig) {
          setFormData(prev => ({
            ...prev,
            pan_config: componentInfo.defaultConfig
          }));
        }
      }
      
      // Si cambia la plantilla, actualizar la configuración
      if (name === 'plan_cod' && value) {
        const selectedPlantilla = plantillas.find(p => p.plan_cod.toString() === value);
        if (selectedPlantilla && selectedPlantilla.plan_config) {
          // Combinar la configuración de la plantilla con la del componente
          setFormData(prev => ({
            ...prev,
            pan_config: {
              ...prev.pan_config,
              ...selectedPlantilla.plan_config
            }
          }));
        }
      }
    }
  };

  // Manejar cambios en la configuración
  const handleConfigChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      pan_config: {
        ...prev.pan_config,
        [key]: value
      }
    }));
  };

  // Abrir modal para crear/editar
  const openModal = (pantalla = null) => {
    if (pantalla) {
      // Modo edición
      setCurrentPantalla(pantalla);
      setFormData({
        pan_nomb: pantalla.pan_nomb,
        pan_desc: pantalla.pan_desc || '',
        pan_componente: pantalla.pan_componente || '',
        plan_cod: pantalla.plan_cod ? pantalla.plan_cod.toString() : '',
        pan_config: pantalla.pan_config || {},
        pan_activa: pantalla.pan_activa !== undefined ? pantalla.pan_activa : true
      });
      
      // Actualizar previsualización
      if (pantalla.pan_componente) {
        setSelectedComponentPreview(getComponent(pantalla.pan_componente));
      }
    } else {
      // Modo creación
      setCurrentPantalla(null);
      setFormData({
        pan_nomb: '',
        pan_desc: '',
        pan_componente: '',
        plan_cod: '',
        pan_config: {},
        pan_activa: true
      });
      setSelectedComponentPreview(null);
    }
    setActiveTab(1);
    setShowModal(true);
  };

  // Guardar pantalla (crear o actualizar)
  const savePantalla = async () => {
    try {
      if (currentPantalla) {
        // Actualizar
        await PantallasService.updatePantalla(currentPantalla.pan_cod, formData);
      } else {
        // Crear
        await PantallasService.createPantalla(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Error al guardar pantalla:', err);
      setError('Error al guardar la pantalla. Por favor, intente nuevamente.');
    }
  };

  // Eliminar pantalla
  const deletePantalla = async (pan_cod) => {
    if (window.confirm('¿Está seguro de eliminar esta pantalla? Esta acción no se puede deshacer.')) {
      try {
        await PantallasService.deletePantalla(pan_cod);
        fetchData();
      } catch (err) {
        console.error('Error al eliminar pantalla:', err);
        setError('Error al eliminar la pantalla. Por favor, intente nuevamente.');
      }
    }
  };

  // Navegar a la pantalla
  const navigateToPantalla = (pantalla) => {
    if (pantalla.pan_componente) {
      const componentInfo = getComponent(pantalla.pan_componente);
      if (componentInfo) {
        // Aquí deberías navegar a la ruta correspondiente
        // Por ahora, solo mostraremos un mensaje
        alert(`Navegando a: ${pantalla.pan_nomb}`);
        // navigate(`/pantalla/${pantalla.pan_cod}`);
      }
    }
  };

  // Renderizar campos de configuración según el componente seleccionado
  const renderConfigFields = () => {
    if (!selectedComponentPreview || !selectedComponentPreview.defaultConfig) {
      return <p>Seleccione un componente para ver su configuración</p>;
    }
    
    const config = selectedComponentPreview.defaultConfig;
    return (
      <div>
        {Object.keys(config).map(key => {
          const value = formData.pan_config[key] !== undefined 
            ? formData.pan_config[key] 
            : config[key];
          
          // Determinar el tipo de campo según el valor
          const fieldType = typeof value === 'boolean' ? 'checkbox' :
                           key.includes('color') ? 'color' :
                           key.includes('fuente') && !key.includes('tamano') ? 'select' :
                           'text';
          
          // Opciones para select
          const options = fieldType === 'select' 
            ? ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana']
            : [];
          
          // Renderizar el campo según su tipo
          switch (fieldType) {
            case 'checkbox':
              return (
                <div className="mb-3" key={key}>
                  <CFormCheck
                    id={`check-${key}`}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={(e) => handleConfigChange(key, e.target.checked)}
                  />
                </div>
              );
            case 'color':
              return (
                <div className="mb-3" key={key}>
                  <label className="form-label">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <CFormInput
                    type="color"
                    value={value}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                  />
                </div>
              );
            case 'select':
              return (
                <div className="mb-3" key={key}>
                  <label className="form-label">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <CFormSelect
                    value={value}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                  >
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </CFormSelect>
                </div>
              );
            default:
              return (
                <div className="mb-3" key={key}>
                  <label className="form-label">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <CFormInput
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                  />
                </div>
              );
          }
        })}
      </div>
    );
  };

  // Renderizar previsualización del componente
  const renderComponentPreview = () => {
    if (!selectedComponentPreview) {
      return (
        <div className="text-center p-4">
          <p>Seleccione un componente para ver la previsualización</p>
        </div>
      );
    }
    
    return (
      <div className="component-preview">
        <h5>{selectedComponentPreview.name}</h5>
        <p>{selectedComponentPreview.description}</p>
        <div className="preview-image-container">
          <img 
            src={selectedComponentPreview.previewImage || '/placeholder.png'} 
            alt={selectedComponentPreview.name}
            className="img-fluid preview-image"
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div className="admin-pantallas-container">
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle>Administración de Pantallas</CCardTitle>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          
          <CButton 
            color="primary" 
            className="mb-3"
            onClick={() => openModal()}
          >
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
                pantallas.map(pantalla => (
                  <CTableRow key={pantalla.pan_cod}>
                    <CTableDataCell>{pantalla.pan_cod}</CTableDataCell>
                    <CTableDataCell>{pantalla.pan_nomb}</CTableDataCell>
                    <CTableDataCell>
                      {pantalla.pan_componente ? (
                        getComponent(pantalla.pan_componente)?.name || pantalla.pan_componente
                      ) : (
                        <span className="text-muted">Sin componente</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {pantalla.plantilla ? (
                        pantalla.plantilla.plan_nomb
                      ) : (
                        <span className="text-muted">Sin plantilla</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className={`badge ${pantalla.pan_activa ? 'bg-success' : 'bg-danger'}`}>
                        {pantalla.pan_activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton 
                        color="info" 
                        size="sm" 
                        className="me-2"
                        onClick={() => openModal(pantalla)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton 
                        color="danger" 
                        size="sm"
                        className="me-2"
                        onClick={() => deletePantalla(pantalla.pan_cod)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                      {pantalla.pan_componente && (
                        <CButton 
                          color="success" 
                          size="sm"
                          onClick={() => navigateToPantalla(pantalla)}
                        >
                          <CIcon icon={cilScreenDesktop} />
                        </CButton>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal para crear/editar pantalla */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>
            {currentPantalla ? 'Editar Pantalla' : 'Nueva Pantalla'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
              >
                Información Básica
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
              >
                Componente
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 3}
                onClick={() => setActiveTab(3)}
                disabled={!formData.pan_componente}
              >
                Configuración
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent className="pt-3">
            <CTabPane visible={activeTab === 1}>
              <CForm>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
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
                  <label className="form-label">Descripción</label>
                  <CFormTextarea
                    name="pan_desc"
                    value={formData.pan_desc}
                    onChange={handleInputChange}
                    placeholder="Descripción de la pantalla"
                    rows={3}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Plantilla</label>
                  <CFormSelect
                    name="plan_cod"
                    value={formData.plan_cod}
                    onChange={handleInputChange}
                  >
                    <option value="">Sin plantilla</option>
                    {plantillas.map(plantilla => (
                      <option key={plantilla.plan_cod} value={plantilla.plan_cod}>
                        {plantilla.plan_nomb}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
                <div className="mb-3">
                  <CFormCheck
                    id="pan_activa"
                    name="pan_activa"
                    label="Pantalla Activa"
                    checked={formData.pan_activa}
                    onChange={handleInputChange}
                  />
                </div>
              </CForm>
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <label className="form-label">Componente</label>
                    <CFormSelect
                      name="pan_componente"
                      value={formData.pan_componente}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione un componente</option>
                      {componentes.map(comp => (
                        <option key={comp.id} value={comp.id}>
                          {comp.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  {renderComponentPreview()}
                </CCol>
              </CRow>
            </CTabPane>
            <CTabPane visible={activeTab === 3}>
              {renderConfigFields()}
            </CTabPane>
          </CTabContent>
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
  );
};

export default AdminPantallas;