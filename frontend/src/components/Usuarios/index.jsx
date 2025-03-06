import React, { useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { BsFillPencilFill, BsSearch, BsArrowClockwise, BsPlus } from 'react-icons/bs'
import ReactPaginate from 'react-paginate'
import userService from '../../services/user.service'
import AddUsersForm from './Register'
import UpdateUserForm from './Update'
import authService from '../../services/auth.service'
import { toast, ToastContainer } from 'react-toastify'
import { cilSave } from '@coreui/icons'

const Users = () => {
  // *** BUSQUEDA *** // Se usa antes del listar porque usamos title en useEffect

  const [title, setTitle] = React.useState('')
  const valorBusqueda = document.querySelector('#buscador')
  const [user, setUser] = useState('')
  const [userRoot, setUserRoot] = useState(false)

  const searchingUsuarios = () => {
    setTitle(valorBusqueda.value)
    if (title.length === 1) {
      getUsuarios(page, size)
    } else getUsuarios(page, size, valorBusqueda.value)
  }

  // PAGINACION

  const [page, setPage] = React.useState(0)
  const [size, setSize] = React.useState(5)
  const [pageCount, setPageCount] = React.useState(0)
  const [totalSize, setTotalSize] = React.useState(0)
  const [roles, setRoles] = useState([])

  const getUsuarios = async (page, size, title) => {
    try {
      const response = await userService.getListUser(page, size, title)
      setPage(0)
      setUsuarios(response.data.items)
      setSize(response.data.size)
      setTotalSize(response.data.totalItems)
      setPageCount(response.data.totalPages)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePageClick = (event) => {
    const newOffset = (event.selected * size) % users.length
    setTotalSize(newOffset)
    getUsuarios(event.selected, size, title)
  }

  // *** MODAL ADD REGISTRO *** //
  const [showUsersAdd, setShowUsersAdd] = React.useState(false)
  const handleShowUsersAdd = () => setShowUsersAdd(true)
  const [editing, setEditing] = React.useState(0)

  async function abrirNuevoUsuario() {
    try {
      setUser('')
      handleShowUsersAdd()
      setEditing(1)
    } catch (error) {
      console.log(error)
    }
  }
  // *** MODAL UPDATE REGISTRO *** //
  const [showUserUpdate, setShowUserUpdate] = React.useState(false)
  const handleShowUserUpdate = () => setShowUserUpdate(true)

  const handleCloseModalUpdate = () => {
    setUser('')
    setShowUserUpdate()
    getUsuarios(0, 5, '')
  }

  // *** LISTAR REGISTROS *** //
  const [users, setUsuarios] = React.useState([])

  React.useEffect(() => {
    getUsuarios(page, size, title)
    getRoles()
    getUser()
  }, [page, size, title])

  const getRoles = async () => {
    try {
      const response = await authService.getRoles()
      setRoles(response.data.rows)
    } catch (error) {
      console.log(error)
    }
  }

  const getUser = async () => {
    try {
      const response = await authService.getCurrentUser()
      if (response.data.body.rol === 'SUPER_ADMIN') {
        setUserRoot(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseModal = () => {
    setUser('')
    setShowUsersAdd()
    getUsuarios(0, 5, '')
  }
  // *** BOTON RESET DEL BUSCADOR *** //
  const buscador = useRef('')
  const refresh = () => {
    buscador.current.value = ''
    setPage(0)
    setSize(5)
    searchingUsuarios()
  }

  // *** Notificaciones *** //
  // Registro exitoso en create/update
  const notifySuccess = () => {
    toast.success('Registro con éxito!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
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

  return (
    <CCard style={{ padding: 50, borderRadius: 10 }}>
      <CRow>
        <CCol xs={12}>
          <h4 id="traffic" className="card-title mb-0 text-primary">
            Usuarios
          </h4>
          <CInputGroup className="mb-3 mt-3">
            <CFormInput
              placeholder="Buscar usuario..."
              aria-label="Buscar usuario..."
              aria-describedby="button-addon2"
              style={{ borderRadius: 10 }}
              id="buscador"
              ref={buscador}
              className="form-control"
            />
            <CRow>
              <BsSearch
                className="mt-2 btn-buscar"
                title={'Buscar'}
                id="botonBuscar"
                onClick={searchingUsuarios}
              />
            </CRow>
            <CRow>
              <BsArrowClockwise
                className="mt-2 btn-refresh"
                title={'Limpiar'}
                id="botonLimpiar"
                onClick={refresh}
              />
            </CRow>
          </CInputGroup>
        </CCol>

        {userRoot && (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ padding: 20 }}>
            <CButton onClick={abrirNuevoUsuario} title={'Crear nuevo registro'}>
              <BsPlus />
              Nuevo Usuario
            </CButton>
          </div>
        )}
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody className="text-medium-emphasis small">
              <CCol xs={12} md={12}>
                <CTable align="middle" responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Usuario</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Apellido</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Rol</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Activo</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Acción</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.length > 0 ? (
                      users.map((users) => (
                        // Pasamos la key porque sino da error en la consola avisando que no tiene key
                        <CTableRow key={users.us_cod}>
                          <CTableDataCell>{users.us_cod}</CTableDataCell>
                          <CTableDataCell>{users.us_user}</CTableDataCell>
                          <CTableDataCell>{users.us_nomape}</CTableDataCell>
                          <CTableDataCell>{users?.us_email}</CTableDataCell>
                          <CTableDataCell>{users?.roles?.rol_desc}</CTableDataCell>
                          <CTableDataCell>{users.us_tel}</CTableDataCell>
                          {users.enabled === true && (
                            <CTableDataCell>
                              <strong className="text-success">HABILITADO</strong>
                            </CTableDataCell>
                          )}
                          {users.enabled === false && (
                            <CTableDataCell>
                              <strong className="text-danger">NO HABILITADO</strong>
                            </CTableDataCell>
                          )}
                          <CTableDataCell>
                            <BsFillPencilFill
                              className="btn-dell"
                              title={'Editar registro'}
                              onClick={() => {
                                setUser(users)
                                handleShowUserUpdate()
                                setEditing(2)
                              }}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <tr>
                        <CTableDataCell colSpan={3}>No hay Usuarios Registrados</CTableDataCell>
                      </tr>
                    )}
                  </CTableBody>
                </CTable>
                {/* paginación */}
                <ReactPaginate
                  nextLabel="Sig. >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={pageCount}
                  previousLabel="< Ant."
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  activeClassName="active"
                  renderOnZeroPageCount={null}
                />
                <span># Usuarios: {totalSize}</span>
              </CCol>
              <CInputGroup>
                {/* Notificaciones */}
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </CInputGroup>
            </CCardBody>
          </CCard>
          {editing === 1 ? (
            <AddUsersForm
              showUsersAdd={showUsersAdd}
              roles={roles}
              handleCloseModal={handleCloseModal}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          ) : editing === 2 ? (
            <UpdateUserForm
              showUserUpdate={showUserUpdate}
              roles={roles}
              user={user}
              handleCloseModalUpdate={handleCloseModalUpdate}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          ) : (
            <div></div>
          )}
        </CCol>
      </CRow>
    </CCard>
  )
}

export default Users
