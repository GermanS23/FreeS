// components/Promociones/RegisterPromo.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  CButton, CCardBody, CCol, CForm, CFormInput, CFormLabel,
  CFormSwitch, CInputGroup, CRow,CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave } from '@coreui/icons';
import { Modal, Card } from 'react-bootstrap';
import PromocionesService from '../../services/promociones.service.js';
import 'react-toastify/dist/ReactToastify.css';

// 🔹 Importamos DatePicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RegisterPromo = (props) => {
  const [formObject, setFormObject] = useState({
    prom_nom: '',
    prom_importe: '',
    prom_fechaini: new Date(), // Usamos objetos Date
    prom_fechafin: new Date(),
  });
  
  // Cargar datos si estamos editando
  useEffect(() => {
    if (props.prom_cod) {
      const fetchPromo = async () => {
        try {
          let { data } = await PromocionesService.getPromoById(props.prom_cod);
          setFormObject({
            prom_nom: data.prom_nom,
            prom_importe: data.prom_importe,
            // Convertimos los strings de fecha a objetos Date
            prom_fechaini: new Date(data.prom_fechaini), 
            prom_fechafin: new Date(data.prom_fechafin),
          });
        } catch (e) {
          console.log('No se pudo cargar la info', e);
        }
      };
      fetchPromo();
    }
  }, [props.prom_cod]);
  
  // Guardar (Crear o Actualizar)
  const save = async () => {
    if (!formObject.prom_nom || !formObject.prom_importe) {
      props.notifyError('Por favor complete todos los campos');
      return;
    }

    try {
      if (props.prom_cod) {
        // Actualizar
        await PromocionesService.updatePromo(props.prom_cod, formObject);
      } else {
        // Crear
        await PromocionesService.createPromo(formObject);
      }
      props.handleCloseModal();
      props.notifySuccess('Promoción guardada con éxito');
    } catch (error) {
      props.notifyError(error.response?.data?.message || 'Error al guardar');
    }
  };

  const cierraModal = () => {
    setFormObject({ prom_nom: '', prom_importe: '', prom_fechaini: new Date(), prom_fechafin: new Date() });
    props.handleCloseModal(); // Llama a la función del padre para cerrar
  };

  return (
    <Modal show={props.showUsersAdd} onHide={cierraModal} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-dark">
          {props && !props.prom_cod ? 'Nueva Promoción' : 'Modificar Promoción'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CRow className="justify-content-center">
          <CCol>
            <Card className="mx-1">
              <CCardBody className="p-4">
                <CForm className="row g-3 needs-validation">
                  
                  <CCol md={12}>
                    <CFormLabel>Nombre de la Promoción</CFormLabel>
                    <CInputGroup className="has-validation">
                      <CFormInput
                        type="text"
                        value={formObject.prom_nom || ''}
                        onChange={(e) => setFormObject({ ...formObject, prom_nom: e.target.value })}
                        placeholder="Ej: 2x1 en Cafés"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  
                  <CCol md={6}>
                    <CFormLabel>Importe</CFormLabel>
                    <CInputGroup className="has-validation">
                      <CFormInput
                        type="number"
                        value={formObject.prom_importe || ''}
                        onChange={(e) => setFormObject({ ...formObject, prom_importe: e.target.value })}
                        placeholder="$"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                  
                  <CCol md={6}>
                    <CFormLabel>Tipo de Descuento (Próximamente)</CFormLabel>
                    <CFormSelect disabled>
                      <option>Descuento por Monto Fijo</option>
                    </CFormSelect>
                  </CCol>
                  
                  <CCol md={6}>
                    <CFormLabel>Fecha de Inicio</CFormLabel>
                    <DatePicker
                      selected={formObject.prom_fechaini}
                      onChange={(date) => setFormObject({ ...formObject, prom_fechaini: date })}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                  </CCol>
                  
                  <CCol md={6}>
                    <CFormLabel>Fecha de Fin</CFormLabel>
                    <DatePicker
                      selected={formObject.prom_fechafin}
                      onChange={(date) => setFormObject({ ...formObject, prom_fechafin: date })}
className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                  </CCol>

                  <div className="d-grid mt-4">
                    <CButton color="dark" onClick={save}>
                      <CIcon className="btn-icon mx-2" icon={cilSave} />
                      {props?.prom_cod ? 'Modificar' : 'Guardar'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </Card>
          </CCol>
        </CRow>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterPromo;