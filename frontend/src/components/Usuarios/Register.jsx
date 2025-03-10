import React, { useRef, useState, useEffect } from 'react'
import {
  CButton,
  CCardBody,
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
  CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { cilLockLocked, cilUser, cilAperture, cilSave, cilPhone } from '@coreui/icons'
import { Modal, Card } from 'react-bootstrap'
import userService from '../../services/user.service'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import Users from './index'

const Register = (props) => {
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(true)

  const handleSubmitValidation = () => {
    setValidated(true)
  }

  // Cargar roles desde el backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true)
        const response = await userService.getRoles()
        setRoles(response.data)
        setLoadingRoles(false)
      } catch (error) {
        console.error("Error al cargar roles:", error)
        setLoadingRoles(false)
      }
    }

    fetchRoles()
  }, [])

  // Para validar el formulario con react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  // validate password
  const pass = useRef()
  const cPassword = useRef()
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [cPasswordClass, setCPasswordClass] = useState('form-control')
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false)
  const [passValidated, setPassValidated] = useState(false)

  const checkPasswords = (e) => {
    setIsCPasswordDirty(true)
    if (isCPasswordDirty) {
      if (pass.current.value === cPassword.current.value) {
        setShowErrorMessage(false)
        setCPasswordClass('form-control is-valid')
        setPassValidated(true)
        setValidated(true)
      } else {
        setShowErrorMessage(true)
        setCPasswordClass('form-control is-invalid')
        setPassValidated(false)
        setValidated(false)
      }
    }
  }

  const onSubmit = async (data) => {
    if (!passValidated || !validated) {
      return
    }
    
    setLoading(true)
    
    try {
      // Crear el objeto con todos los campos requeridos
      const formValue = {
        us_nomape: data.us_nomape,
        us_user: data.us_user, // Asegurarse de que este campo exista
        us_email: data.us_email,
        us_tel: data.us_tel || "", // Teléfono opcional
        roles_rol_cod: parseInt(data.roles_rol_cod), // Convertir a número el código de rol
        us_pass: pass.current.value
      }
      
      console.log("Enviando datos:", formValue)
      
      await userService.createUser(formValue)
      reset()
      setValidated(false)
      setPassValidated(false)
      setCPasswordClass('form-control')
      props.handleCloseModal()
      props.notifySuccess()
    } catch (error) {
      console.error("Error completo:", error)
      
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          props.notifyError(error.response.data)
        } else if (error.response.data.message) {
          props.notifyError(error.response.data.message)
        } else {
          props.notifyError("Error al crear usuario. Verifica los datos ingresados.")
        }
      } else {
        props.notifyError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  // *** EVENTO AL CERRAR MODAL CON X ***//
  const clearForm = useRef()
  const cierraModal = () => {
    reset()
    setValidated(false)
    setPassValidated(false)
    setCPasswordClass('form-control')
  }

  return (
    <Modal show={props.showUsersAdd} onHide={props.handleCloseModal} backdrop="static" size="xl" id="modal">
      <Modal.Header
        closeButton
        onClick={cierraModal}
      >
        <Modal.Title className="text-center text-primary" id="titulo">
          Nuevo registro
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CRow className="justify-content-center">
          <CCol>
            <Card className="mx-1">
              <CCardBody className="p-1">
                {loadingRoles ? (
                  <div className="text-center p-3">
                    <CSpinner color="primary" />
                    <p className="mt-2">Cargando roles...</p>
                  </div>
                ) : (
                  <CForm
                    className="row g-3 needs-validation"
                    ref={clearForm}
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit(onSubmit, handleSubmitValidation)}
                  >
                    <CCol md={4}>
                      <CFormLabel htmlFor="validationCustom01">Nombre y Apellido</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          required
                          placeholder="Nombre y Apellido"
                          {...register('us_nomape', {
                            required: { value: true, message: 'Se requiere un nombre' },
                            minLength: { value: 3, message: 'El nombre no puede tener menos de 3 caracteres' },
                          })}
                        />
                        <CFormFeedback invalid>
                          {errors.us_nomape && <span>{errors.us_nomape.message}</span>}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>
                    
                    <CCol md={4}>
                      <CFormLabel htmlFor="validationCustomUsername">Usuario</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          id="validationCustomUsername"
                          aria-describedby="inputGroupPrepend"
                          required
                          maxLength={20}
                          minLength={1}
                          {...register('us_user', {
                            required: { value: true, message: 'Se requiere un nombre de usuario' },
                            minLength: {
                              value: 3,
                              message: 'El nombre de usuario no puede tener menos de 3 caracteres',
                            },
                          })}
                          placeholder="Usuario"
                        />
                        <CFormFeedback invalid>
                          {errors.us_user && <span>{errors.us_user.message}</span>}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    <CCol md={4}>
                      <CFormLabel htmlFor="validationCustomTel">Teléfono</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilPhone} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder="Teléfono"
                          id="validationCustomTel"
                          {...register('us_tel')}
                        />
                      </CInputGroup>
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel htmlFor="validationCustom03">Email</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText id="inputGroupPrepend">@</CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Email"
                          id="validationCustom03"
                          required
                          {...register('us_email', {
                            required: { value: true, message: 'Se requiere una dirección de mail' },
                            pattern: { 
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                              message: "Ingrese un mail válido"
                            }
                          })}
                        />
                        <CFormFeedback invalid>
                          {errors.us_email && <span>{errors.us_email.message}</span>}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    <CCol md={3}>
                      <CFormLabel htmlFor="validationCustom04">Rol</CFormLabel>
                      <CInputGroup className="has-validation">
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilAperture} />
                        </CInputGroupText>
                        <CFormSelect 
                          id="validationCustom04" 
                          {...register('roles_rol_cod', {
                            required: { value: true, message: 'Se requiere seleccionar un rol' }
                          })} 
                          required
                        >
                          <option value="">Seleccione un rol</option>
                          {roles.map((rol) => (
                            <option key={rol.rol_cod} value={rol.rol_cod}>
                              {rol.rol_desc}
                            </option>
                          ))}
                        </CFormSelect>
                        <CFormFeedback invalid>
                          {errors.roles_rol_cod && <span>{errors.roles_rol_cod.message}</span>}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel htmlFor="pass">Password</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          id="pass"
                          required
                          ref={pass}
                          className="form-control"
                          onChange={checkPasswords}
                        />
                        <CFormFeedback invalid>
                          Se requiere una contraseña
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel htmlFor="confirmPassword">Repita password</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText id="inputGroupPrepend">
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Repita password"
                          id="confirmPassword"
                          ref={cPassword}
                          required
                          className={cPasswordClass}
                          onChange={checkPasswords}
                        />
                        <CFormFeedback invalid>
                          {showErrorMessage && isCPasswordDirty ? (
                            <div> Las contraseñas no coinciden </div>
                          ) : (
                            ''
                          )}
                        </CFormFeedback>
                      </CInputGroup>
                    </CCol>

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
  )
}

export default Register