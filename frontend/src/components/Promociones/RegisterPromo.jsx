import React, { useEffect, useRef, useState } from 'react';
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave } from '@coreui/icons';
import { Modal } from 'react-bootstrap';
import PromocionesService from '../../services/promociones.service.js';
import 'react-toastify/dist/ReactToastify.css';

// 🔹 Importamos DatePicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RegisterPromo = (props) => {
  const [formObject, setFormObject] = useState({
    prom_nom: '',
    prom_importe: '',
    prom_fechaini: new Date(),
    prom_fechafin: new Date(),
  });

  const clearForm = useRef();

  useEffect(() => {
    if (props.prom_cod) {
      const fetchPromo = async () => {
        try {
          let { data } = await PromocionesService.getPromoById(props.prom_cod);
          setFormObject({
            prom_nom: data.prom_nom,
            prom_importe: data.prom_importe,
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

  const save = async () => {
    if (!formObject.prom_nom || !formObject.prom_importe) {
      props.notifyError('Por favor complete todos los campos');
      return;
    }

    try {
      if (props.prom_cod) {
        await PromocionesService.updatePromo(props.prom_cod, formObject);
      } else {
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
    props.handleCloseModal();
  };

  return (
    <>
      <style>
        {`
          .custom-modal-centered .modal-dialog {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: auto !important;
            max-width: 600px !important;
            --cui-modal-width: auto !important; 
          }
          .custom-modal-centered .modal-content {
            border: none !important;
            border-radius: 12px !important;
            overflow: hidden !important;
          }
          /* Ajuste para que el DatePicker ocupe todo el ancho */
          .react-datepicker-wrapper {
            width: 100%;
          }
        `}
      </style>

      <Modal 
        show={props.showUsersAdd} 
        onHide={cierraModal} 
        backdrop="static" 
        centered
        className="custom-modal-centered"
      >
        <Modal.Header 
          closeButton 
          className="border-0 pb-0" 
          style={{ backgroundColor: '#000000' }}
          closeVariant="dark"
        >
          <Modal.Title className="text-center w-100 fw-bold py-2 text-dark">
            {props.prom_cod ? 'Modificar Promoción' : 'Nueva Promoción'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4 bg-white">
          <CForm ref={clearForm} className="w-100">
            <div className="row g-3">
              
              {/* Nombre de la Promoción */}
              <div className="col-md-12">
                <CFormLabel className="fw-semibold">Nombre de la Promoción</CFormLabel>
                <CFormInput
                  type="text"
                  value={formObject.prom_nom || ''}
                  onChange={(e) => setFormObject({ ...formObject, prom_nom: e.target.value })}
                  placeholder="Ej: 2x1 en Cafés"
                  className="py-2"
                />
              </div>

              {/* Importe */}
              <div className="col-md-6">
                <CFormLabel className="fw-semibold">Importe</CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-light">$</CInputGroupText>
                  <CFormInput
                    type="number"
                    value={formObject.prom_importe || ''}
                    onChange={(e) => setFormObject({ ...formObject, prom_importe: e.target.value })}
                    placeholder="0.00"
                    className="py-2"
                  />
                </CInputGroup>
              </div>

              <div>
                
              </div>

              {/* Fechas */}
              <div className="col-md-6">
                <CFormLabel className="fw-semibold">Fecha de Inicio</CFormLabel>
                <DatePicker
                  selected={formObject.prom_fechaini}
                  onChange={(date) => setFormObject({ ...formObject, prom_fechaini: date })}
                  className="form-control py-2"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className="col-md-6">
                <CFormLabel className="fw-semibold">Fecha de Fin</CFormLabel>
                <DatePicker
                  selected={formObject.prom_fechafin}
                  onChange={(date) => setFormObject({ ...formObject, prom_fechafin: date })}
                  className="form-control py-2"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              {/* Botón Guardar */}
              <div className="col-md-12 text-center mt-4">
                <CButton 
                  color="dark" 
                  onClick={save} 
                  size="lg" 
                  className="px-5 fw-bold shadow-sm"
                >
                  <CIcon className="me-2" icon={cilSave} />
                  {props.prom_cod ? 'Actualizar' : 'Guardar Promoción'}
                </CButton>
              </div>

            </div>
          </CForm>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterPromo;