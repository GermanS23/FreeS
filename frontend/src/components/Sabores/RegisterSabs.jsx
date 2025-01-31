import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CModal,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilAperture, cilSave, cilBook, cilMoney, cilSearch } from '@coreui/icons';
import { Modal, Card, Button } from 'react-bootstrap';
import SaboresService from '../../services/sabores.service.js';// Importar el servicio de sabores
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const Register = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [closeModal, setCloseModal] = useState(true);
  const [showModalDeta, setShowModalDeta] = useState(false);
  const [formObject, setFormObject] = useState({
    sab_nom: null,
    sab_disp: false, // Nuevo campo para la disponibilidad
  });

  //Modal Paciente
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const save = async () => {
    if (formObject.sab_nom === null) {
      toast.error('Ingrese el nombre del sabor', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      if (props.sab_cod) {
        const res = await SaboresService.updateSab(props.sab_cod, formObject);
        setFormObject({
          sab_nom: null,
          sab_disp: false,
        });
        props.handleCloseModal();
        props.notifySuccess();
      } else {
        const res = await SaboresService.createSab(formObject);
        setFormObject({
          sab_nom: null,
          sab_disp: false,
        });
        props.handleCloseModal();
        props.notifySuccess();
      }
    } catch (error) {
      props.notifyError(error.response.data.message);
    }
  };

  // *** EVENTO AL CERRAR MODAL CON X ***//
  const clearForm = useRef();

  const cierraModal = () => {
    setFormObject({
      sab_nom: null,
      sab_disp: false,
    });
    setCloseModal(false);
  };

  const fetchSabor = async () => {
    try {
      let { data } = await SaboresService.getSabById(props.sab_cod);
      setFormObject({
        sab_nom: data.sab_nom,
        sab_disp: data.sab_disp,
      });
    } catch (e) {
      console.log('No se pudo cargar la info', e);
    }
  };

  React.useEffect(() => {
    if (props.sab_cod) {
      fetchSabor();
    }
  }, [props.sab_cod]);

  return (
    <Modal show={props.showUsersAdd} onHide={props.handleCloseModal} backdrop="static" size="xl" id="modal">
      <Modal.Header closeButton onClick={cierraModal}>
        <Modal.Title className="text-center text-primary" id="titulo">
          {props && !props.sab_cod ? 'Nuevo Sabor' : 'Modificar Sabor'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CRow className="justify-content-center">
          <CCol>
            <Card className="mx-1">
              <CCardBody className="p-1">
                <CForm className="row g-3 needs-validation" ref={clearForm}>
                  <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom01">Nombre del Sabor</CFormLabel>
                    <CInputGroup className="has-validation">
                      <CFormInput
                        type="text"
                        id="validationCustomTipo"
                        aria-describedby="inputGroupPrepend"
                        required
                        value={formObject.sab_nom || ''}
                        onChange={(e) => {
                          let temp = formObject;
                          setFormObject({ ...temp, sab_nom: e.target.value });
                        }}
                        placeholder="Nombre del Sabor"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom02">Disponible</CFormLabel>
                    <CFormSwitch
                      id="sab_disp"
                      label="¿Está disponible?"
                      checked={formObject.sab_disp || false}
                      onChange={(e) => {
                        let temp = formObject;
                        setFormObject({ ...temp, sab_disp: e.target.checked });
                      }}
                    />
                  </CCol>
                  <div className="d-grid">
                    <CButton onClick={save} className="mx-auto">
                      <CIcon className="btn-icon mx-2" icon={cilSave} />
                      {props?.sab_cod ? 'Modificar' : 'Guardar'}
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

export default Register;