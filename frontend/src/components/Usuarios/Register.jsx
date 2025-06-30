import React, { useRef, useState, useEffect } from 'react';
import {
  CButton,
  CCardBody,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

import { cilLockLocked, cilUser, cilAperture, cilPhone } from '@coreui/icons';
import { Modal, Card } from 'react-bootstrap';
import userService from '../../services/user.service';
import sucursalService from '../../services/sucursales.service'; 
import { useForm } from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';

const Register = (props) => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [loadingSucursales, setLoadingSucursales] = useState(true);

  // Cargar roles desde el backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const response = await userService.getRoles();
        setRoles(response.data);
        setLoadingRoles(false);
      } catch (error) {
        console.error("Error al cargar roles:", error);
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Cargar sucursales desde el backend
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        setLoadingSucursales(true);
        // Aquí llamas a tu nuevo método en el servicio que usa getAllSucursales()
        const response = await sucursalService.getSucursalAll(); 
        
        // *** EL CAMBIO CLAVE ESTÁ AQUÍ ***
        // Ahora, asume que 'response.data' es DIRECTAMENTE el array de sucursales
        if (Array.isArray(response.data)) { // Verifica si response.data es un array
          setSucursales(response.data); // Actualiza el estado directamente con response.data
        } else {
          console.error("La respuesta de sucursalService no es un array como se esperaba:", response.data);
          setSucursales([]); // Establece sucursales como un array vacío para evitar el error
        }
        // *** FIN DEL CAMBIO CLAVE ***

        setLoadingSucursales(false);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
        setLoadingSucursales(false);
        setSucursales([]); // Establece sucursales como un array vacío en caso de error
      }
    };

    fetchSucursales();
  }, []);

  // Para validar el formulario con react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // validate password
  const pass = useRef();
  const cPassword = useRef();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState('form-control');
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);
  const [passValidated, setPassValidated] = useState(false);

  const checkPasswords = () => {
    setIsCPasswordDirty(true);
    if (pass.current && cPassword.current) {
      if (pass.current.value === cPassword.current.value) {
        setShowErrorMessage(false);
        setCPasswordClass('form-control is-valid');
        setPassValidated(true);
        setValidated(true);
      } else {
        setShowErrorMessage(true);
        setCPasswordClass('form-control is-invalid');
        setPassValidated(false);
        setValidated(false);
      }
    }
  };

  const onSubmit = async (data) => {
    if (!passValidated) {
      props.notifyError("Las contraseñas no coinciden o están vacías.");
      return;
    }

    setLoading(true);

    try {
      const formValue = {
        us_nomape: data.us_nomape,
        us_user: data.us_user,
        us_email: data.us_email,
        us_tel: data.us_tel || "",
        roles_rol_cod: parseInt(data.roles_rol_cod),
        us_pass: pass.current.value,
        // Mapear las sucursales seleccionadas a un array de números (suc_cod)
        sucursales: data.sucursales ? data.sucursales.map(s => parseInt(s)) : []
      };

      console.log("Enviando datos:", formValue);

      await userService.createUser(formValue);
      
      reset();
      setValidated(false);
      setPassValidated(false);
      setCPasswordClass('form-control');
      setShowErrorMessage(false);

      props.handleCloseModal();
      props.notifySuccess();
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          props.notifyError(error.response.data);
        } else if (error.response.data.message) {
          props.notifyError(error.response.data.message);
        } else {
          props.notifyError("Error al crear usuario. Verifica los datos ingresados.");
        }
      } else {
        props.notifyError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cierraModal = () => {
    reset();
    setValidated(false);
    setPassValidated(false);
    setCPasswordClass('form-control');
    setShowErrorMessage(false);
    props.handleCloseModal();
  };

  return (
    <Modal show={props.showUsersAdd} onHide={cierraModal} backdrop="static" size="xl" id="modal">
      <Modal.Header closeButton>
        <Modal.Title className="text-center text-primary" id="titulo">
          Nuevo registro
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CRow className="justify-content-center">
          <CCol>
            <Card className="mx-1">
              <CCardBody className="p-1">
                {loadingRoles || loadingSucursales ? (
                  <div className="text-center p-3">
                    <CSpinner color="primary" />
                    <p className="mt-2">Cargando datos...</p>
                  </div>
                ) : (
                  <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    {/* Nombre y Apellido */}
                    <CCol md={4}>
                      <CFormLabel htmlFor="us_nomape">Nombre y Apellido</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          id="us_nomape"
                          required
                          placeholder="Nombre y Apellido"
                          {...register('us_nomape', {
                            required: { value: true, message: 'Se requiere un nombre y apellido' },
                            minLength: { value: 3, message: 'El nombre no puede tener menos de 3 caracteres' },
                          })}
                        />
                        <CFormFeedback invalid>
                          {errors.us_nomape && <span>{errors.us_nomape.message}</span>}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    {/* Usuario */}
                    <CCol md={4}>
                      <CFormLabel htmlFor="us_user">Usuario</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          id="us_user"
                          aria-describedby="inputGroupPrepend"
                          required
                          maxLength={20}
                          minLength={1}
                          placeholder="Usuario"
                          {...register('us_user', {
                            required: { value: true, message: 'Se requiere un nombre de usuario' },
                            minLength: {
                              value: 3,
                              message: 'El nombre de usuario no puede tener menos de 3 caracteres',
                            },
                          })}
                        />
                        <CFormFeedback invalid>
                          {errors.us_user && <span>{errors.us_user.message}</span>}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    {/* Teléfono */}
                    <CCol md={4}>
                      <CFormLabel htmlFor="us_tel">Teléfono</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilPhone} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder="Teléfono"
                          id="us_tel"
                          {...register('us_tel')}
                        />
                      </CInputGroup>
                    </CCol>

                    {/* Email */}
                    <CCol md={4}>
                      <CFormLabel htmlFor="us_email">Email</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">@</CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Email"
                          id="us_email"
                          required
                          {...register('us_email', {
                            required: { value: true, message: 'Se requiere una dirección de email' },
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Ingrese un email válido"
                            }
                          })}
                        />
                        <CFormFeedback invalid>
                          {errors.us_email && <span>{errors.us_email.message}</span>}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    {/* Sucursales (selección múltiple) */}
                    <CCol md={4}>
                      <CFormLabel htmlFor="sucursales">Sucursales</CFormLabel>
                      {loadingSucursales ? (
                        <p>Cargando sucursales...</p>
                      ) : (
                        <CFormSelect
                          id="sucursales"
                          multiple
                          aria-label="Seleccione sucursales"
                          {...register('sucursales')}
                        >
                          {sucursales.length > 0 ? (
                            sucursales.map((sucursal) => (
                              <option key={sucursal.suc_cod} value={sucursal.suc_cod}>
                                {sucursal.suc_name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No hay sucursales disponibles</option>
                          )}
                        </CFormSelect>
                      )}
                    </CCol>

                    {/* Rol */}
                    <CCol md={4}>
                      <CFormLabel htmlFor="roles_rol_cod">Rol</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilAperture} />
                        </CInputGroupText>
                        <CFormSelect
                          id="roles_rol_cod"
                          required
                          {...register('roles_rol_cod', {
                            required: { value: true, message: 'Se requiere seleccionar un rol' }
                          })}
                        >
                          <option value="">Seleccione un rol</option>
                          {roles.length > 0 ? (
                            roles.map((rol) => (
                              <option key={rol.rol_cod} value={rol.rol_cod}>
                                {rol.rol_desc}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No hay roles disponibles</option>
                          )}
                        </CFormSelect>
                        <CFormFeedback invalid>
                          {errors.roles_rol_cod && <span>{errors.roles_rol_cod.message}</span>}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    {/* Contraseña */}
                    <CCol md={6}>
                      <CFormLabel htmlFor="pass">Contraseña</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Contraseña"
                          id="pass"
                          required
                          ref={pass}
                          className="form-control"
                          onChange={checkPasswords}
                        />
                        <CFormFeedback invalid>
                            Se requiere una contraseña.
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    {/* Repetir Contraseña */}
                    <CCol md={6}>
                      <CFormLabel htmlFor="confirmPassword">Repita Contraseña</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Repita Contraseña"
                          id="confirmPassword"
                          ref={cPassword}
                          required
                          className={cPasswordClass}
                          onChange={checkPasswords}
                        />
                        <CFormFeedback invalid>
                          {showErrorMessage && isCPasswordDirty ? (
                            <div>Las contraseñas no coinciden.</div>
                          ) : (
                            ''
                          )}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    {/* Botón de envío */}
                    <div className="d-grid gap-2 col-2 mx-auto mb-2">
                      <CButton
                        type="submit"
                        color="primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <CSpinner size="sm" className="me-2" />
                            Creando...
                          </>
                        ) : (
                          'Crear usuario'
                        )}
                      </CButton>
                    </div>
                  </CForm>
                )}
              </CCardBody>
            </Card>
          </CCol>
        </CRow>
      </Modal.Body>
    </Modal>
  );
};

export default Register;