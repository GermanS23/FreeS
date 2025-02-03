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
import ProductosService from '../../services/productos.service.js';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import CategoriaSProdService from "../../services/catprod.service.js"
const Register = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [closeModal, setCloseModal] = useState(true);
  const [showModalDeta, setShowModalDeta] = useState(false);
  const [formObject, setFormObject] = useState({
    prod_nom: null,
    prod_pre: null,
    prod_dis: false,
    catprod_cod: null,
  });

  const [categorias, setCategorias] = useState([]);

  const fetchCategorias = async () => {
    try {
      const response = await CategoriaSProdService.listCatProd(0, 50, ''); // Ajusta los parámetros según tu API
      setCategorias(response.data.items); // Ajusta según la estructura de la respuesta
    } catch (error) {
      console.error('Error al obtener las categorías', error);
    }
  };
  

  useEffect(() => {
    fetchCategorias();
  }, []);

  const save = async () => {
    if (formObject.prod_nom === null || formObject.prod_pre === null || formObject.prod_pre === null) {
      toast.error('Por favor complete todos los campos', {
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
      if (props.prod_cod) {
        const res = await ProductosService.updateProd(props.prod_cod, formObject);
        setFormObject({ 
          prod_nom: null,
          prod_pre: null,
          prod_dis: false,
          catprod_cod: null,
        });
        props.handleCloseModal();
        props.notifySuccess();
      } else {
        const res = await ProductosService.createProd(formObject);
        setFormObject({
          prod_nom: null,
          prod_pre: null,
          prod_dis: false,
          catprod_cod: null,
        });
        props.handleCloseModal();
        props.notifySuccess();
      }
    } catch (error) {
      props.notifyError(error.response.data.message);
    }
  };

  const clearForm = useRef();

  const cierraModal = () => {
    setFormObject({
      prod_nom: null,
      prod_pre: null,
      prod_dis: false,
      catprod_cod: null,
    });
    setCloseModal(false);
  };

  const fetchProducto = async () => {
    try {
      let { data } = await ProductosService.getProdById(props.prod_cod);
      setFormObject({
        prod_nom: null,
        prod_pre: null,
        prod_dis: false,
        catprod_cod: null,
      });
    } catch (e) {
      console.log('No se pudo cargar la info', e);
    }
  };

  useEffect(() => {
    if (props.prod_cod) {
      fetchProducto();
    }
  }, [props.prod_cod]);

  return (
    <Modal show={props.showUsersAdd} onHide={props.handleCloseModal} backdrop="static" size="xl" id="modal">
      <Modal.Header closeButton onClick={cierraModal}>
        <Modal.Title className="text-center text-primary  text-dark" id="titulo">
          {props && !props.prod_cod ? 'Nuevo Producto' : 'Modificar Producto'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CRow className="justify-content-center">
          <CCol>
            <Card className="mx-1">
              <CCardBody className="p-1">
                <CForm className="row g-3 needs-validation" ref={clearForm}>
                  <CCol md={6}>
                    <CFormLabel htmlFor="validationCustom01">Nombre del Producto</CFormLabel>
                    <CInputGroup className="has-validation">
                      <CFormInput
                        type="text"
                        id="validationCustomTipo"
                        aria-describedby="inputGroupPrepend"
                        required
                        value={formObject.prod_nom || ''}
                        onChange={(e) => {
                          let temp = formObject;
                          setFormObject({ ...temp, prod_nom: e.target.value });
                        }}
                        placeholder="Nombre del Producto"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="validationCustom01">Precio</CFormLabel>
                    <CInputGroup className="has-validation">
                      <CFormInput
                        type="number"
                        id="validationCustomTipo"
                        aria-describedby="inputGroupPrepend"
                        required
                        value={formObject.prod_pre || ''}
                        onChange={(e) => {
                          let temp = formObject;
                          setFormObject({ ...temp, prod_pre: e.target.value });
                        }}
                        placeholder="$"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                  <CFormLabel>Seleccionar Categoría</CFormLabel>
                      <CFormSelect
                        value={formObject.catprod_cod || ''}
                        onChange={(e) => setFormObject({ ...formObject, catprod_cod: e.target.value })}
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((prod) => (
                          <option key={prod.catprod_cod} value={prod.catprod_cod}>
                            {prod.catprod_name}
                          </option>
                        ))}
                      </CFormSelect>
                    <CFormFeedback invalid>Por favor seleccione una categoría.</CFormFeedback>
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom02">Disponible</CFormLabel>
                    <CFormSwitch
                      id="sab_disp"
                      label="¿Está disponible?"
                      checked={formObject.prod_dis || false}
                      onChange={(e) => {
                        let temp = formObject;
                        setFormObject({ ...temp, prod_dis: e.target.checked });
                      }}
                    />
                  </CCol>
                  <div className="d-grid">
                    <CButton color="dark" onClick={save} className="mx-auto">
                      <CIcon className="btn-icon mx-2" icon={cilSave} />
                      {props?.prod_cod ? 'Modificar' : 'Guardar'}
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