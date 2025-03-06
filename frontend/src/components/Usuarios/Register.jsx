import React, { useRef, useState } from 'react'
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
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { cilLockLocked, cilUser, cilAperture, cilSave } from '@coreui/icons'
import { Modal, Card } from 'react-bootstrap'
import userService from '../../services/user.service'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import Users from './index'

const Register = (props) => {

  const [validated, setValidated] = useState(false)
  const handleSubmitValidation = () => {
    setValidated(true)
  }

  const [roles, setRoles] = useState([{ nombre: "USER" }, { nombre: "ADMIN" }, { nombre: "SUPER_ADMIN" }])

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
    
    let formValue = {};

    try { if (passValidated && validated)
      formValue = {
        nombre: data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1).toLowerCase(),
        apellido: data.apellido.charAt(0).toUpperCase() + data.apellido.slice(1).toLowerCase(),
        username: data.username.toLowerCase(),
        email: data.email.toLowerCase(),
        rol: data.rol,
        password: pass.current.value,
        enabled: data.enabled
      }
      await userService.createUser(formValue)
      reset();
      setValidated(false)
      setPassValidated(false)
      setCPasswordClass('form-control')
      props.handleCloseModal()
      props.notifySuccess()
      
    } catch (error) {
      props.notifyError(error.response.data.message)
    }
  }

  // *** EVENTO AL CERRAR MODAL CON X ***//
  const clearForm = useRef();
  const cierraModal = () => {
    reset();
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
                <CForm
                  className="row g-3 needs-validation"
                  ref={clearForm}
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit(onSubmit, handleSubmitValidation)}
                >
                  <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom01">Nombre</CFormLabel>
                    <CInputGroup className="has-validation">
                      <CInputGroupText id="inputGroupPrepend">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        required
                        placeholder="Nombre"
                        name="nombre"
                        {...register('nombre', {
                          required: { value: true, message: 'Se requiere un nombre' },
                          minLength: { value: 3, message: 'El nombre no puede tener menos de 3 caracteres' },
                          // pattern: { value: /[A-Za-z]/, message: 'Solo se admiten letras' },
                        })}
                      />
                      <CFormFeedback invalid>
                        {errors.nombre && <span>{errors.nombre.message}</span>}
                      </CFormFeedback>
                    </CInputGroup>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom02">Apellido</CFormLabel>

                    <CInputGroup className="has-validation">
                      <CInputGroupText id="inputGroupPrepend">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        id="validationCustom02"
                        required
                        maxLength={20}
                        minLength={1}
                        // pattern='/[A-Za-z]/'

                        {...register('apellido', {
                          required: { value: true, message: 'Se requiere un apellido' },
                          minLength: {
                            value: 3,
                            message: 'El apellido no puede tener menos de 3 caracteres',
                          },
                          // pattern: { value: /[A-Za-z]/, message: 'Solo se admiten letras' }
                        })}
                        placeholder="Apellido"
                      />
                      {/* <CFormFeedback valid>Correcto!</CFormFeedback> */}
                      <CFormFeedback invalid>
                        {errors.apellido && <span> {errors.apellido.message}</span>}
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
                        {...register('username', {
                          required: { value: true, message: 'Se requiere un nombre de usuario' },
                          minLength: {
                            value: 3,
                            message: 'El nombre de usuario no puede tener menos de 3 caracteres',
                          },
                        })}
                        placeholder="Usuario"
                      />
                      <CFormFeedback invalid>Usuario no disponible.</CFormFeedback>
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="validationCustom03">Email</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText id="inputGroupPrepend">@</CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Email"
                        id="validationCustom03"
                        required
                        minLength={1}
                        // pattern='/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i'
                        {...register('email', {
                          required: { value: true, message: 'Se requiere una dirección de mail' },
                          minLength: { value: 3, message: 'El email no puede tener menos de 3 caracteres' },
                          // pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Ingrese un mail válido"}
                        })}
                      />
                      <CFormFeedback invalid>
                        {errors.email && <span> {errors.email.message}</span>}
                      </CFormFeedback>
                    </CInputGroup>
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="validationCustom04">Rol</CFormLabel>
                    <CInputGroup className="has-validation">
                      <CInputGroupText id="inputGroupPrepend">
                        <CIcon icon={cilAperture} />
                      </CInputGroupText>
                      <CFormSelect id="validationCustom04" {...register('rol')} placeholder="rol">
                        {roles.map((roles) => (
                          <option key={roles.nombre}>{roles.nombre}</option>
                        ))}
                      </CFormSelect>
                      <CFormFeedback invalid>Seleccione un elemento de la lista.</CFormFeedback>
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
                        // id="validationCustom06"
                        id="confirmPassword"
                        ref={cPassword}
                        required
                        // enabled={pass ===""||pass === undefined}
                        disabled={false}
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
                  <CCol xs={12}>
                    <CFormSwitch
                      {...register('enabled')}
                      label="Habilitado"
                      id="Switch"
                      valid={(Users.enabled = true)}
                      invalid={(Users.enabled = false)}
                      defaultChecked
                    />
                  </CCol>
                  <div className="d-grid gap-2 col-2 mx-auto mb-2">
                    <CButton
                    type="submit" 
                    class="btn btn-outline-primary">
                      Crear usuario
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </Card>
          </CCol>
        </CRow>
      </Modal.Body>
    </Modal>
  )
}
export default Register
