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
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { cilUser, cilAperture, cilSave } from '@coreui/icons'
import { Modal, Card } from 'react-bootstrap'
import userService from '../../services/user.service'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const Update = (props) => {
  // Validación de los campos
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
    setValue,
  } = useForm()

  React.useEffect(() => {

    if (props.user !== null || props.user !== undefined) {
      setValue('nombre', props.user.nombre)
      setValue('apellido', props.user.apellido)
      setValue('username', props.user.username)
      setValue('email', props.user.email)
      setValue('rol', props.user.rol)
      setValue('enabled', props.user.enabled)
    }
  }, [props.roles, props.user, setValue, reset])

  const onSubmit = async (data, e) => {
    let formValue = {};
    formValue = {
      nombre: data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1).toLowerCase(),
      apellido: data.apellido.charAt(0).toUpperCase() + data.apellido.slice(1).toLowerCase(),
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      rol: data.rol,
      enabled: data.enabled,
    }
    try {
      await userService.updateUser(props.user.id, formValue)
      reset();
      props.handleCloseModalUpdate()
      props.notifySuccess()
    } catch (errors) {
      notifyError(errors.response.data.message)
      console.log(errors)
    }
  }

  // // *** Notificaciones *** //
  // Error
  const notifyError = (data) => {
    toast.error(data, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  // *** EVENTO AL CERRAR MODAL CON X ***//
  const clearForm = useRef();
  const cierraModal = () => {
    reset()
    setValidated(false)
  }

  return (
    <Modal show={props.showUserUpdate} onHide={props.handleCloseModalUpdate} backdrop="static" size="xl">
      <Modal.Header closeButton onClick={cierraModal}>
        <Modal.Title className="text-center text-primary" id="titulo">
          Actualización de registro
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
                        placeholder="Nombre"
                        required
                        // pattern='/[A-Za-z]/'
                        maxLength={20}
                        minLength={1}

                        {...register('nombre', {
                          required: { value: true, message: 'Se requiere un nombre' },
                          minLength: {
                            value: 3,
                            message: 'El nombre no puede tener menos de 3 caracteres',
                          },
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
                        maxLength={100}
                        minLength={1}
                        // pattern='/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i'
                        {...register('email', {
                          required: { value: true, message: 'Se requiere una dirección de mail' },
                          minLength: {
                            value: 3,
                            message: 'El email no puede tener menos de 3 caracteres',
                          },
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

                  <CCol xs={12}>
                    <CFormSwitch
                      {...register('enabled')}
                      label="Habilitado"
                      id="Switch"
                      valid={props.user.enabled}
                      invalid={!props.user.enabled}
                      defaultChecked
                    />
                  </CCol>
                  <div className="d-grid">
                    <CButton type="submit" color="success" className="mx-auto">
                      <CIcon className="btn-icon mx-2" icon={cilSave} />
                      Actualizar usuario
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
export default Update
