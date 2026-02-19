import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CFormSwitch,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilAperture, cilEnvelopeClosed, cilCheckCircle } from '@coreui/icons';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import UserService from '../../services/user.service';
import sucursalService from '../../services/sucursales.service';

const Update = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [allSucursales, setAllSucursales] = useState([]);
  const [loadingSucursales, setLoadingSucursales] = useState(false);
  const [selectedSucursales, setSelectedSucursales] = useState([]);
  const [changePassword, setChangePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({ mode: 'onChange' });

  const newPassword = watch("us_pass", "");

  useEffect(() => {
    if (props.showUserUpdate) {
      fetchRoles();
      fetchAllSucursales();
      setChangePassword(false);
    }
  }, [props.showUserUpdate]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await UserService.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setFormError('Error al cargar los roles.');
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchAllSucursales = async () => {
    try {
      setLoadingSucursales(true);
      const response = await sucursalService.getSucursalAll();
      setAllSucursales(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      setAllSucursales([]);
    } finally {
      setLoadingSucursales(false);
    }
  };

  useEffect(() => {
    if (props.user) {
      setValue('us_user', props.user.us_user || '');
      setValue('us_nomape', props.user.us_nomape || '');
      setValue('us_email', props.user.us_email || '');
      setValue('us_tel', props.user.us_tel || '');
      setValue('roles_rol_cod', props.user.roles_rol_cod?.toString() || '');

      const assigned = props.user.sucursales && Array.isArray(props.user.sucursales)
        ? props.user.sucursales.map(s => s.suc_cod)
        : [];
      setSelectedSucursales(assigned);
      setValue('sucursales', assigned, { shouldValidate: false });
    }
  }, [props.user, setValue]);

  const toggleSucursal = (cod) => {
    const updated = selectedSucursales.includes(cod)
      ? selectedSucursales.filter(s => s !== cod)
      : [...selectedSucursales, cod];
    setSelectedSucursales(updated);
    setValue('sucursales', updated, { shouldValidate: true });
  };

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
        sucursales: selectedSucursales.map(s => parseInt(s)),
        ...(changePassword && data.us_pass ? { us_pass: data.us_pass } : {})
      };

      await UserService.updateUser(props.user.us_cod, formValue);
      props.notifySuccess('Usuario actualizado con éxito');
      handleCloseModal();
      if (typeof props.onUpdateSuccess === 'function') props.onUpdateSuccess();
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al actualizar el usuario';
      setFormError(msg);
      props.notifyError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    reset();
    setFormError(null);
    setSelectedSucursales([]);
    setChangePassword(false);
    props.handleCloseModalUpdate();
  };

  return (
    <Modal
      show={props.showUserUpdate}
      onHide={handleCloseModal}
      backdrop="static"
      size="xl"
      centered
      style={{ zIndex: 1060 }}
      contentClassName="shadow-lg"
      dialogClassName="modal-fullwidth-fix"
    >
      <style>{`
        .modal-fullwidth-fix {
          max-width: min(900px, 92vw) !important;
          margin: auto !important;
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        }
        .modal-fullwidth-fix .modal-content {
          border-radius: 14px !important;
          border: none !important;
          overflow: hidden;
        }
        .modal-backdrop { z-index: 1055 !important; }
      `}</style>

      <Modal.Header
        closeButton
        className="border-0"
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
          borderRadius: '12px 12px 0 0',
          padding: '20px 28px'
        }}
      >
        <Modal.Title className="fw-bold text-white fs-5">
          ✎ Editar usuario
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ background: '#fafbff' }}>
        {loadingRoles || loadingSucursales ? (
          <div className="text-center my-5"><CSpinner color="primary" /></div>
        ) : (
          <CForm onSubmit={handleSubmit(onSubmit)}>

            {formError && (
              <div className="alert alert-danger py-2 mb-3" role="alert">{formError}</div>
            )}

            {/* FILA 1: Nombre | Usuario | Teléfono */}
            <CRow className="mb-3 g-3">
              <CCol md={5}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">Nombre completo</CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none' }}>
                    <CIcon icon={cilUser} className="text-secondary" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Ej: Juan Pérez"
                    style={{ borderColor: '#d1d5db', borderLeft: 'none', background: '#fff' }}
                    className="shadow-none"
                    {...register('us_nomape', { required: true, minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
                  />
                </CInputGroup>
                {errors.us_nomape && <small className="text-danger">{errors.us_nomape.message || 'Campo requerido'}</small>}
              </CCol>
              <CCol md={3}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">Nombre de usuario</CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none' }}>
                    <CIcon icon={cilUser} className="text-secondary" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Ej: jperez"
                    style={{ borderColor: '#d1d5db', borderLeft: 'none', background: '#fff' }}
                    className="shadow-none"
                    {...register('us_user', { required: true, minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
                  />
                </CInputGroup>
                {errors.us_user && <small className="text-danger">{errors.us_user.message || 'Campo requerido'}</small>}
              </CCol>
              <CCol md={4}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">Teléfono <span className="text-muted fw-normal">(opcional)</span></CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none', fontSize: '0.9rem' }}>
                    📞
                  </CInputGroupText>
                  <CFormInput
                    type="tel"
                    placeholder="Ej: 3512345678"
                    style={{ borderColor: '#d1d5db', borderLeft: 'none', background: '#fff' }}
                    className="shadow-none"
                    {...register('us_tel')}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            {/* FILA 1b: Email */}
            <CRow className="mb-3 g-3">
              <CCol md={12}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">Email</CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none' }}>
                    <CIcon icon={cilEnvelopeClosed} className="text-secondary" />
                  </CInputGroupText>
                  <CFormInput
                    type="email"
                    placeholder="usuario@email.com"
                    style={{ borderColor: '#d1d5db', borderLeft: 'none', background: '#fff' }}
                    className="shadow-none"
                    {...register('us_email', {
                      required: true,
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email inválido' }
                    })}
                  />
                </CInputGroup>
                {errors.us_email && <small className="text-danger">{errors.us_email.message || 'Campo requerido'}</small>}
              </CCol>
            </CRow>

            {/* FILA 2: Rol | Sucursales chips */}
            <CRow className="mb-3 g-3">
              <CCol md={4}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">Rol asignado</CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none' }}>
                    <CIcon icon={cilAperture} className="text-secondary" />
                  </CInputGroupText>
                  <CFormSelect
                    style={{ borderColor: '#d1d5db', borderLeft: 'none', background: '#fff' }}
                    className="shadow-none"
                    {...register('roles_rol_cod', { required: true })}
                  >
                    <option value="">Seleccione un rol...</option>
                    {roles.map(r => <option key={r.rol_cod} value={r.rol_cod}>{r.rol_desc}</option>)}
                  </CFormSelect>
                </CInputGroup>
                {errors.roles_rol_cod && <small className="text-danger">Seleccione un rol</small>}
              </CCol>

              <CCol md={8}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">
                  Sucursales asignadas
                  {selectedSucursales.length > 0 && (
                    <CBadge color="primary" className="ms-2" style={{ background: '#0f766e' }}>
                      {selectedSucursales.length} seleccionada{selectedSucursales.length > 1 ? 's' : ''}
                    </CBadge>
                  )}
                </CFormLabel>
                <input type="hidden" {...register('sucursales')} />
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    background: '#fff',
                    minHeight: '46px',
                    alignItems: 'center'
                  }}
                >
                  {allSucursales.length === 0 ? (
                    <small className="text-muted">No hay sucursales disponibles</small>
                  ) : (
                    allSucursales.map(s => {
                      const isSelected = selectedSucursales.includes(s.suc_cod);
                      return (
                        <button
                          key={s.suc_cod}
                          type="button"
                          onClick={() => toggleSucursal(s.suc_cod)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            border: '1.5px solid',
                            borderColor: isSelected ? '#0f766e' : '#d1d5db',
                            background: isSelected ? '#ccfbf1' : '#f9fafb',
                            color: isSelected ? '#134e4a' : '#6b7280',
                            fontWeight: isSelected ? '600' : '400',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            outline: 'none'
                          }}
                        >
                          {isSelected && <CIcon icon={cilCheckCircle} style={{ width: '12px', height: '12px' }} />}
                          {s.suc_name}
                        </button>
                      );
                    })
                  )}
                </div>
              </CCol>
            </CRow>

            {/* Cambiar contraseña toggle */}
            <CRow className="mb-3 g-3">
              <CCol md={12}>
                <div
                  style={{
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setChangePassword(!changePassword)}
                >
                  <CIcon icon={cilLockLocked} className="text-secondary" />
                  <span className="fw-semibold text-secondary small">
                    {changePassword ? '▾ Cancelar cambio de contraseña' : '▸ Cambiar contraseña'}
                  </span>
                </div>
              </CCol>
            </CRow>

            {changePassword && (
              <CRow className="mb-3 g-3">
                <CCol md={6}>
                  <CFormLabel className="fw-semibold text-secondary small mb-1">Nueva contraseña</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none' }}>
                      <CIcon icon={cilLockLocked} className="text-secondary" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="••••••••"
                      style={{ borderColor: '#d1d5db', borderLeft: 'none', background: '#fff' }}
                      className="shadow-none"
                      {...register('us_pass', { minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                    />
                  </CInputGroup>
                  {errors.us_pass && <small className="text-danger">{errors.us_pass.message}</small>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="fw-semibold text-secondary small mb-1">Confirmar contraseña</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none' }}>
                      <CIcon icon={cilLockLocked} className="text-secondary" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="••••••••"
                      style={{ borderColor: '#d1d5db', borderLeft: 'none', background: '#fff' }}
                      className="shadow-none"
                      {...register('confirmPass', {
                        validate: value => !newPassword || value === newPassword || 'Las contraseñas no coinciden'
                      })}
                    />
                  </CInputGroup>
                  {errors.confirmPass && <small className="text-danger">{errors.confirmPass.message}</small>}
                </CCol>
              </CRow>
            )}

            {/* Switch y Botones */}
            <hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            <CRow className="align-items-center">
              <CCol md={6}>
                <CFormSwitch
                  label="Usuario habilitado"
                  id="habilitado-update"
                  defaultChecked
                  style={{ '--cui-form-switch-checked-bg': '#0f766e' }}
                  className="fw-semibold"
                />
              </CCol>
              <CCol md={6} className="d-flex justify-content-end gap-2">
                <CButton
                  color="light"
                  onClick={handleCloseModal}
                  className="px-4"
                  style={{ border: '1px solid #d1d5db', color: '#374151', borderRadius: '8px' }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </CButton>
                <CButton
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 fw-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    minWidth: '160px'
                  }}
                >
                  {isSubmitting ? <CSpinner size="sm" /> : '✎ Guardar cambios'}
                </CButton>
              </CCol>
            </CRow>

          </CForm>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Update;