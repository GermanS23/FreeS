import React, { useEffect, useRef, useState } from 'react';
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave } from '@coreui/icons';
import { Modal } from 'react-bootstrap';
import ProductosService from '../../services/productos.service.js';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import CategoriaSProdService from "../../services/catprod.service.js";
import productosService from '../../services/productos.service.js';

const Register = (props) => {
  const [formObject, setFormObject] = useState({
    prod_nom: null,
    prod_pre: null,
    prod_dis: false,
    catprod_cod: null,
  });

  const [categorias, setCategorias] = useState([]);
  const clearForm = useRef();

  const fetchCategorias = async () => {
    try {
      const response = await CategoriaSProdService.listCatProd(0, 50, '');
      setCategorias(response.data.items || []);
    } catch (error) {
      console.error('Error al obtener las categorías', error);
    }
  };

  const fetchProductos = async () => {
    try {
      let { data } = await productosService.getProdById(props.prod_cod);
      setFormObject({
        prod_nom: data.prod_nom,
        prod_pre: data.prod_pre,
        prod_dis: data.prod_dis,
        catprod_cod: data.catprod_cod,
      });
    } catch (e) {
      console.log('No se pudo cargar la info', e);
    }
  };

  useEffect(() => {
    fetchCategorias();
    if (props.prod_cod) {
      fetchProductos();
    }
  }, [props.prod_cod]);

  const save = async () => {
    if (!formObject.prod_nom || !formObject.prod_pre || !formObject.catprod_cod) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      if (props.prod_cod) {
        await ProductosService.updateProd(props.prod_cod, formObject);
      } else {
        await ProductosService.createProd(formObject);
      }
      props.handleCloseModal();
      props.notifySuccess();
    } catch (error) {
      props.notifyError(error.response?.data?.message || "Error al guardar");
    }
  };

  const cierraModal = () => {
    setFormObject({ prod_nom: null, prod_pre: null, prod_dis: false, catprod_cod: null });
    props.handleCloseModal();
  };

  return (
    <>
      <style>
        {`
          /* Centrado absoluto */
          .custom-modal-centered {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .custom-modal-centered .modal-dialog {
            margin: auto !important;
            max-width: 600px !important;
            width: 90% !important;
          }
          /* Estilo del botón de cerrar para que resalte */
          .btn-close-custom {
            filter: brightness(0) saturate(100%) invert(0%) !important; /* Fuerza color negro */
            opacity: 0.8 !important;
            z-index: 1060 !important;
          }
          .btn-close-custom:hover {
            opacity: 1 !important;
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
        {/* Agregamos una clase al Header para controlar el botón de cerrar */}
        <Modal.Header 
          closeButton 
          className="border-0 pb-0" 
          style={{ backgroundColor: '#000000', position: 'relative' }}
          closeVariant="dark" // Indica a Bootstrap que use la versión oscura
        >
          <Modal.Title className="text-center w-100 fw-bold py-2 text-dark">
            {props.prod_cod ? 'Modificar Producto' : 'Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4 bg-white">
          <CForm ref={clearForm} className="w-100">
            <div className="row g-3">
              
              <div className="col-md-8">
                <CFormLabel className="fw-semibold">Nombre del Producto</CFormLabel>
                <CFormInput
                  type="text"
                  value={formObject.prod_nom || ''}
                  onChange={(e) => setFormObject({ ...formObject, prod_nom: e.target.value })}
                  placeholder="Ej: Balde Free Shop"
                />
              </div>

              <div className="col-md-4">
                <CFormLabel className="fw-semibold">Precio</CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-light">$</CInputGroupText>
                  <CFormInput
                    type="number"
                    value={formObject.prod_pre || ''}
                    onChange={(e) => setFormObject({ ...formObject, prod_pre: e.target.value })}
                    placeholder="0.00"
                  />
                </CInputGroup>
              </div>

              <div className="col-md-12">
                <CFormLabel className="fw-semibold">Seleccionar Categoría</CFormLabel>
                <CFormSelect
                  value={formObject.catprod_cod || ''}
                  onChange={(e) => setFormObject({ ...formObject, catprod_cod: e.target.value })}
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.catprod_cod} value={cat.catprod_cod}>
                      {cat.catprod_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <div className="col-md-12 mt-4">
                <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-light">
                  <span className="fw-medium">¿Está disponible para la venta?</span>
                  <CFormSwitch
                    size="xl"
                    checked={formObject.prod_dis || false}
                    onChange={(e) => setFormObject({ ...formObject, prod_dis: e.target.checked })}
                  />
                </div>
              </div>

              <div className="col-md-12 text-center mt-4">
                <CButton 
                  color="dark" 
                  onClick={save} 
                  size="lg" 
                  className="px-5 fw-bold"
                >
                  <CIcon className="me-2" icon={cilSave} />
                  {props.prod_cod ? 'Actualizar Producto' : 'Guardar Producto'}
                </CButton>
              </div>
            </div>
          </CForm>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Register;