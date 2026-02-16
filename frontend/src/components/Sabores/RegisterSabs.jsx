import React, { useEffect, useRef, useState } from 'react';
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CInputGroup,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave } from '@coreui/icons';
import { Modal } from 'react-bootstrap';
import SaboresService from '../../services/sabores.service.js';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import CategoriaSabService from "../../api/catsab.js";

const Register = (props) => {
  const [formObject, setFormObject] = useState({
    sab_nom: null,
    sab_disp: false,
    catsab_cod: null,
  });

  const [categorias, setCategorias] = useState([]);
  const clearForm = useRef();

  const fetchCategorias = async () => {
    try {
      const response = await CategoriaSabService.List(0, 50, '');
      setCategorias(response.data.items || []);
    } catch (error) {
      console.error('Error al obtener las categorías', error);
    }
  };

  const fetchSabor = async () => {
    try {
      let { data } = await SaboresService.getSabById(props.sab_cod);
      setFormObject({
        sab_nom: data.sab_nom,
        sab_disp: data.sab_disp,
        catsab_cod: data.catsab_cod,
      });
    } catch (e) {
      console.log('No se pudo cargar la info', e);
    }
  };

  useEffect(() => {
    fetchCategorias();
    if (props.sab_cod) {
      fetchSabor();
    }
  }, [props.sab_cod]);

  const save = async () => {
    if (!formObject.sab_nom || !formObject.catsab_cod) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      if (props.sab_cod) {
        await SaboresService.updateSab(props.sab_cod, formObject);
      } else {
        await SaboresService.createSab(formObject);
      }
      props.handleCloseModal();
      props.notifySuccess();
    } catch (error) {
      props.notifyError(error.response?.data?.message || "Error al guardar");
    }
  };

  const cierraModal = () => {
    setFormObject({ sab_nom: null, sab_disp: false, catsab_cod: null });
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
            max-width: 550px !important;
            --cui-modal-width: auto !important;
          }
          .custom-modal-centered .modal-content {
            border-radius: 12px !important;
            border: none !important;
            overflow: hidden !important;
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
          style={{ backgroundColor: '#b191ff' }}
          closeVariant="dark"
        >
          <Modal.Title className="text-center w-100 fw-bold py-2 text-dark">
            {props.sab_cod ? 'Modificar Sabor' : 'Nuevo Sabor'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4 bg-white">
          <CForm ref={clearForm} className="w-100">
            <div className="row g-4">
              
              <div className="col-md-12">
                <CFormLabel className="fw-semibold">Nombre del Sabor</CFormLabel>
                <CFormInput
                  type="text"
                  value={formObject.sab_nom || ''}
                  onChange={(e) => setFormObject({ ...formObject, sab_nom: e.target.value })}
                  placeholder="Ej: Chocolate con Almendras"
                  className="py-2"
                />
              </div>

              <div className="col-md-12">
                <CFormLabel className="fw-semibold">Categoría</CFormLabel>
                <CFormSelect
                  value={formObject.catsab_cod || ''}
                  onChange={(e) => setFormObject({ ...formObject, catsab_cod: e.target.value })}
                  className="py-2"
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.catsab_cod} value={cat.catsab_cod}>
                      {cat.catsab_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <div className="col-md-12">
                <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-light">
                  <span className="fw-medium">¿Está disponible actualmente?</span>
                  <CFormSwitch
                    size="xl"
                    checked={formObject.sab_disp || false}
                    onChange={(e) => setFormObject({ ...formObject, sab_disp: e.target.checked })}
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
                  {props.sab_cod ? 'Actualizar Sabor' : 'Guardar Sabor'}
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