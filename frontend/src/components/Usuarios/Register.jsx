import React, { useState, useEffect } from 'react';
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
import { cilLockLocked, cilUser, cilAperture, cilEnvelopeClosed, cilBuilding, cilCheckCircle } from '@coreui/icons';
import { Modal } from 'react-bootstrap';
import userService from '../../services/user.service';
import sucursalService from '../../services/sucursales.service';
import { useForm, Controller } from 'react-hook-form';

const Register = (props) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [loadingSucursales, setLoadingSucursales] = useState(true);
  const [selectedSucursales, setSelectedSucursales] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset, watch, control, setValue } = useForm();
  const password = watch("us_pass", "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingRoles(true);
        const [resRoles, resSucs] = await Promise.all([
          userService.getRoles(),
          sucursalService.getSucursalAll()
        ]);
        setRoles(resRoles.data || []);
        setSucursales(Array.isArray(resSucs.data) ? resSucs.data : []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoadingRoles(false);
        setLoadingSucursales(false);
      }
    };
    if (props.showUsersAdd) fetchData();
  }, [props.showUsersAdd]);

  const toggleSucursal = (cod) => {
    const updated = selectedSucursales.includes(cod)
      ? selectedSucursales.filter(s => s !== cod)
      : [...selectedSucursales, cod];
    setSelectedSucursales(updated);
    setValue('sucursales', updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formValue = {
        ...data,
        roles_rol_cod: parseInt(data.roles_rol_cod),
        sucursales: selectedSucursales.map(s => parseInt(s))
      };
      await userService.createUser(formValue);
      props.notifySuccess();
      cierraModal();
    } catch (error) {
      props.notifyError("Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  const cierraModal = () => {
    reset();
    setSelectedSucursales([]);
    props.handleCloseModal();
  };

  return (
    <Modal
      show={props.showUsersAdd}
      onHide={cierraModal}
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
        .modal-backdrop {
          z-index: 1055 !important;
        }
      `}</style>
      <Modal.Header
        closeButton
        className="border-0"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          borderRadius: '12px 12px 0 0',
          padding: '20px 28px'
        }}
      >
        <Modal.Title className="fw-bold text-white fs-5">
          ✦ Nuevo registro de usuario
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ background: '#fafbff' }}>
        {loadingRoles || loadingSucursales ? (
          <div className="text-center my-5"><CSpinner color="primary" /></div>
        ) : (
          <CForm onSubmit={handleSubmit(onSubmit)}>

            {/* FILA 1: Nombre | Usuario | Teléfono | Email */}
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
                    {...register('us_nomape', { required: true })}
                  />
                </CInputGroup>
                {errors.us_nomape && <small className="text-danger">Campo requerido</small>}
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
                    {...register('us_user', { required: true })}
                  />
                </CInputGroup>
                {errors.us_user && <small className="text-danger">Campo requerido</small>}
              </CCol>
              <CCol md={4}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">Teléfono</CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none', fontSize: '0.9rem' }}>
                    📞
                  </CInputGroupText>
                  <CFormInput
                    type="tel"
                    placeholder="Ej: 3482123456"
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
                    {...register('us_email', { required: true })}
                  />
                </CInputGroup>
                {errors.us_email && <small className="text-danger">Campo requerido</small>}
              </CCol>
            </CRow>

            {/* FILA 2: Rol | Sucursales como chips */}
            <CRow className="mb-3 g-3">
              <CCol md={5}>
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

              <CCol md={6}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">
                  Sucursales asignadas
                  {selectedSucursales.length > 0 && (
                    <CBadge color="primary" className="ms-2" style={{ background: '#7c3aed' }}>
                      {selectedSucursales.length} seleccionada{selectedSucursales.length > 1 ? 's' : ''}
                    </CBadge>
                  )}
                </CFormLabel>
                <input type="hidden" {...register('sucursales', { validate: v => (v && v.length > 0) || 'Seleccione al menos una sucursal' })} />
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    padding: '10px 12px',
                    border: '1px solid',
                    borderColor: errors.sucursales ? '#dc3545' : '#d1d5db',
                    borderRadius: '6px',
                    background: '#fff',
                    minHeight: '46px',
                    alignItems: 'center'
                  }}
                >
                  {sucursales.length === 0 ? (
                    <small className="text-muted">No hay sucursales disponibles</small>
                  ) : (
                    sucursales.map(s => {
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
                            borderColor: isSelected ? '#7c3aed' : '#d1d5db',
                            background: isSelected ? '#ede9fe' : '#f9fafb',
                            color: isSelected ? '#5b21b6' : '#6b7280',
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
                {errors.sucursales && <small className="text-danger">{errors.sucursales.message}</small>}
              </CCol>
            </CRow>

            {/* FILA 3: Passwords */}
            <CRow className="mb-3 g-3">
              <CCol md={6}>
                <CFormLabel className="fw-semibold text-secondary small mb-1">Contraseña</CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="bg-white" style={{ borderColor: '#d1d5db', borderRight: 'none' }}>
                    <CIcon icon={cilLockLocked} className="text-secondary" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="••••••••"
                    style={{ borderColor: '#d1d5db', borderLeft: 'none', background: '#fff' }}
                    className="shadow-none"
                    {...register('us_pass', { required: true, minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                  />
                </CInputGroup>
                {errors.us_pass && <small className="text-danger">{errors.us_pass.message || 'Campo requerido'}</small>}
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
                      required: true,
                      validate: value => value === password || 'Las contraseñas no coinciden'
                    })}
                  />
                </CInputGroup>
                {errors.confirmPass && <small className="text-danger">{errors.confirmPass.message || 'Campo requerido'}</small>}
              </CCol>
            </CRow>

            {/* Switch y Botones */}
            <hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            <CRow className="align-items-center">
              <CCol md={6}>
                <CFormSwitch
                  label="Usuario habilitado"
                  id="habilitado"
                  defaultChecked
                  style={{ '--cui-form-switch-checked-bg': '#7c3aed' }}
                  className="fw-semibold"
                />
              </CCol>
              <CCol md={6} className="d-flex justify-content-end gap-2">
                <CButton
                  color="light"
                  onClick={cierraModal}
                  className="px-4"
                  style={{ border: '1px solid #d1d5db', color: '#374151', borderRadius: '8px' }}
                >
                  Cancelar
                </CButton>
                <CButton
                  type="submit"
                  disabled={loading}
                  className="px-4 fw-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    minWidth: '140px'
                  }}
                >
                  {loading ? <CSpinner size="sm" /> : '✦ Crear usuario'}
                </CButton>
              </CCol>
            </CRow>

          </CForm>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Register;