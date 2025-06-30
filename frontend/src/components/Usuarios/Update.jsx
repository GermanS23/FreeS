import React, { useEffect, useState } from 'react';
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
import { cilUser, cilAperture, cilSave, cilX, cilPhone } from '@coreui/icons'; // Añadir cilPhone para el teléfono
import { Modal, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';
import UserService from '../../services/user.service';
import sucursalService from '../../services/sucursales.service'; // Importar el servicio de sucursales

const Update = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [allSucursales, setAllSucursales] = useState([]); // Estado para todas las sucursales
  const [loadingSucursales, setLoadingSucursales] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      us_user: '',
      us_nomape: '',
      us_email: '',
      us_tel: '',
      roles_rol_cod: '',
      sucursales: [] // Añadir el campo para las sucursales
    }
  });

  // Cargar roles y sucursales cuando se abre el modal
  useEffect(() => {
    if (props.showUserUpdate) {
      fetchRoles();
      fetchAllSucursales(); // Cargar todas las sucursales disponibles
    }
  }, [props.showUserUpdate]);

  // Función para cargar los roles
  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await UserService.getRoles();
      setRoles(response.data);
      setLoadingRoles(false);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setFormError('Error al cargar los roles. Por favor, intente nuevamente.');
      setLoadingRoles(false);
    }
  };

  // Función para cargar TODAS las sucursales disponibles
  const fetchAllSucursales = async () => {
    try {
      setLoadingSucursales(true);
      const response = await sucursalService.getSucursalAll(); // Usar tu servicio para obtener todas las sucursales
      if (Array.isArray(response.data)) {
        setAllSucursales(response.data);
      } else {
        console.error("La respuesta de sucursalService.getSucursalAll no es un array:", response.data);
        setAllSucursales([]);
      }
      setLoadingSucursales(false);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      setFormError('Error al cargar las sucursales. Por favor, intente nuevamente.');
      setLoadingSucursales(false);
      setAllSucursales([]);
    }
  };

  // Cargar datos del usuario seleccionado y pre-seleccionar sucursales
  useEffect(() => {
    if (props.user) {
      setValue('us_user', props.user.us_user || '');
      setValue('us_nomape', props.user.us_nomape || '');
      setValue('us_email', props.user.us_email || '');
      setValue('us_tel', props.user.us_tel || '');
      setValue('roles_rol_cod', props.user.roles_rol_cod?.toString() || '');

      // Pre-seleccionar las sucursales asignadas al usuario
      // props.user.sucursales debe ser un array de objetos de sucursal con `suc_cod`
      if (props.user.sucursales && Array.isArray(props.user.sucursales)) {
        const assignedSucursalCodes = props.user.sucursales.map(s => s.suc_cod.toString());
        setValue('sucursales', assignedSucursalCodes);
      } else {
        setValue('sucursales', []);
      }
    }
  }, [props.user, setValue]);

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const formValue = {
        us_user: data.us_user,
        us_nomape: data.us_nomape,
        us_email: data.us_email,
        us_tel: data.us_tel,
        roles_rol_cod: parseInt(data.roles_rol_cod),
        // Mapear las sucursales seleccionadas a un array de números (suc_cod)
        sucursales: data.sucursales ? data.sucursales.map(s => parseInt(s)) : []
      };

      await UserService.updateUser(props.user.us_cod, formValue);

      if (typeof props.notifySuccess === 'function') {
        props.notifySuccess('Usuario actualizado con éxito');
      }

      handleCloseModal();

      if (typeof props.onUpdateSuccess === 'function') {
        props.onUpdateSuccess();
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el usuario';
      setFormError(errorMessage);

      if (typeof props.notifyError === 'function') {
        props.notifyError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para cerrar el modal y limpiar el formulario
  const handleCloseModal = () => {
    reset();
    setFormError(null);
    props.handleCloseModalUpdate();
  };

  const rolesToDisplay = roles.length > 0 ? roles : props.roles || [];

  return (
    <Modal
      show={props.showUserUpdate}
      onHide={handleCloseModal}
      backdrop="static"
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">Actualizar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formError && (
          <div className="alert alert-danger" role="alert">
            {formError}
          </div>
        )}

        <CRow className="justify-content-center">
          <CCol>
            <Card className="mx-1 shadow-sm">
              <CCardBody className="p-4">
                <CForm
                  className="row g-3 needs-validation"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* Nombre y Apellido */}
                  <CCol md={4}>
                    <CFormLabel htmlFor="us_nomape">Nombre y Apellido</CFormLabel>
                    <CInputGroup className={errors.us_nomape ? "has-validation is-invalid" : ""}>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        id="us_nomape"
                        placeholder="Nombre y Apellido"
                        invalid={!!errors.us_nomape}
                        {...register('us_nomape', {
                          required: 'El nombre y apellido es obligatorio',
                          minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                        })}
                      />
                    </CInputGroup>
                    {errors.us_nomape && (
                      <CFormFeedback invalid>{errors.us_nomape.message}</CFormFeedback>
                    )}
                  </CCol>

                  {/* Usuario */}
                  <CCol md={4}>
                    <CFormLabel htmlFor="us_user">Usuario</CFormLabel>
                    <CInputGroup className={errors.us_user ? "has-validation is-invalid" : ""}>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        id="us_user"
                        placeholder="Usuario"
                        invalid={!!errors.us_user}
                        {...register('us_user', {
                          required: 'El usuario es obligatorio',
                          minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                        })}
                      />
                    </CInputGroup>
                    {errors.us_user && (
                      <CFormFeedback invalid>{errors.us_user.message}</CFormFeedback>
                    )}
                  </CCol>

                  {/* Email */}
                  <CCol md={4}>
                    <CFormLabel htmlFor="us_email">Email</CFormLabel>
                    <CInputGroup className={errors.us_email ? "has-validation is-invalid" : ""}>
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="email"
                        id="us_email"
                        placeholder="Email"
                        invalid={!!errors.us_email}
                        {...register('us_email', {
                          required: 'El email es obligatorio',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email inválido'
                          }
                        })}
                      />
                    </CInputGroup>
                    {errors.us_email && (
                      <CFormFeedback invalid>{errors.us_email.message}</CFormFeedback>
                    )}
                  </CCol>

                  {/* Teléfono */}
                  <CCol md={4}>
                    <CFormLabel htmlFor="us_tel">Teléfono</CFormLabel>
                    <CInputGroup className={errors.us_tel ? "has-validation is-invalid" : ""}>
                      <CInputGroupText>
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        id="us_tel"
                        placeholder="Teléfono"
                        invalid={!!errors.us_tel}
                        {...register('us_tel')} // No requerido en el registro
                      />
                    </CInputGroup>
                    {errors.us_tel && (
                      <CFormFeedback invalid>{errors.us_tel.message}</CFormFeedback>
                    )}
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
                        invalid={!!errors.sucursales}
                        {...register('sucursales')}
                      >
                        {allSucursales.length > 0 ? (
                          allSucursales.map((sucursal) => (
                            <option key={sucursal.suc_cod} value={sucursal.suc_cod}>
                              {sucursal.suc_name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No hay sucursales disponibles</option>
                        )}
                      </CFormSelect>
                    )}
                    {errors.sucursales && (
                      <CFormFeedback invalid>{errors.sucursales.message}</CFormFeedback>
                    )}
                  </CCol>

                  {/* Rol */}
                  <CCol md={4}>
                    <CFormLabel htmlFor="roles_rol_cod">Rol</CFormLabel>
                    <CInputGroup className={errors.roles_rol_cod ? "has-validation is-invalid" : ""}>
                      <CInputGroupText>
                        <CIcon icon={cilAperture} />
                      </CInputGroupText>
                      {loadingRoles ? (
                        <CFormInput
                          placeholder="Cargando roles..."
                          disabled
                        />
                      ) : (
                        <CFormSelect
                          id="roles_rol_cod"
                          invalid={!!errors.roles_rol_cod}
                          {...register('roles_rol_cod', {
                            required: 'Debe seleccionar un rol'
                          })}
                        >
                          <option value="">Seleccione un rol</option>
                          {rolesToDisplay.map((role) => (
                            <option key={role.rol_cod} value={role.rol_cod}>
                              {role.rol_desc}
                            </option>
                          ))}
                        </CFormSelect>
                      )}
                    </CInputGroup>
                    {errors.roles_rol_cod && (
                      <CFormFeedback invalid>{errors.roles_rol_cod.message}</CFormFeedback>
                    )}
                  </CCol>

                  <CCol xs={12} className="d-flex justify-content-center mt-4">
                    <CButton
                      type="button"
                      color="secondary"
                      className="me-2"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                    >
                      <CIcon icon={cilX} className="me-2" />
                      Cancelar
                    </CButton>
                    <CButton
                      type="submit"
                      color="success"
                      disabled={isSubmitting || !isValid || loadingRoles || loadingSucursales}
                    >
                      {isSubmitting ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilSave} className="me-2" />
                          Actualizar Usuario
                        </>
                      )}
                    </CButton>
                  </CCol>
                </CForm>
              </CCardBody>
            </Card>
          </CCol>
        </CRow>
      </Modal.Body>
    </Modal>
  );
};

export default Update;