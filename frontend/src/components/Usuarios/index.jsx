import React, { useRef, useState } from 'react';
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
} from '@coreui/react';
import { BsFillPencilFill, BsSearch, BsArrowClockwise, BsPlus } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import userService from '../../services/user.service';
import AddUsersForm from './Register';
import UpdateUserForm from './Update';
import authService from '../../services/auth.service';
import { toast, ToastContainer } from 'react-toastify';

const Users = () => {
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const [userRoot, setUserRoot] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [roles, setRoles] = useState([]);
  const [users, setUsuarios] = useState([]);
  const [showUsersAdd, setShowUsersAdd] = useState(false);
  const [showUserUpdate, setShowUserUpdate] = useState(false);
  const [editing, setEditing] = useState(0);

  const buscador = useRef('');

  const getUsuarios = async (page, size, title) => {
    try {
      const response = await userService.getListUser(page, size, title);
      setUsuarios(response.data.items);
      setSize(response.data.size);
      setTotalSize(response.data.totalItems);
      setPageCount(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * size) % users.length;
    setTotalSize(newOffset);
    getUsuarios(event.selected, size, title);
  };

  const searchingUsuarios = () => {
    const valorBusqueda = buscador.current.value;
    setTitle(valorBusqueda);
    getUsuarios(page, size, valorBusqueda);
  };

  const refresh = () => {
    buscador.current.value = '';
    setPage(0);
    setSize(5);
    searchingUsuarios();
  };

  const abrirNuevoUsuario = () => {
    setUser(null);
    setShowUsersAdd(true);
    setEditing(1);
  };

  const handleCloseModal = () => {
    setUser(null);
    setShowUsersAdd(false);
    getUsuarios(page, size, title);
  };

  const handleCloseModalUpdate = () => {
    setUser(null);
    setShowUserUpdate(false);
    getUsuarios(page, size, title);
  };

  const createUser = async (userData) => {
    try {
      await userService.createUser(userData);
      getUsuarios(page, size, title); // Refrescar la lista de usuarios
    } catch (error) {
      throw error; // Propagar el error para manejarlo en el componente Register
    }
  };

  React.useEffect(() => {
    getUsuarios(page, size, title);
    getRoles();
    getUser();
  }, [page, size, title]);

  const getRoles = async () => {
    try {
      const response = await authService.getRoles();
      setRoles(response.data.rows);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data.body.roles.rol_desc === 'ADMIN' || response.data.body.roles.rol_desc === 'DUEÑO') {
        setUserRoot(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const notifySuccess = () => {
    toast.success('Registro con éxito!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const notifyError = (data) => {
    toast.error(data, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

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
              <BsSearch className="mt-2 btn-buscar" title={'Buscar'} id="botonBuscar" onClick={searchingUsuarios} />
            </CRow>
            <CRow>
              <BsArrowClockwise className="mt-2 btn-refresh" title={'Limpiar'} id="botonLimpiar" onClick={refresh} />
            </CRow>
          </CInputGroup>
        </CCol>

        {userRoot && (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ padding: 20 }}>
            <CButton onClick={abrirNuevoUsuario} title={'Crear nuevo registro'} color="dark">
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
                      <CTableHeaderCell scope="col">Nombre y Apellido</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Rol</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Acción</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <CTableRow key={user.us_cod}>
                          <CTableDataCell>{user.us_cod}</CTableDataCell>
                          <CTableDataCell>{user.us_user}</CTableDataCell>
                          <CTableDataCell>{user.us_nomape}</CTableDataCell>
                          <CTableDataCell>{user.us_email}</CTableDataCell>
                          <CTableDataCell>{user.us_tel}</CTableDataCell>
                          <CTableDataCell>{user.roles?.rol_desc}</CTableDataCell>
                          <CTableDataCell>
                            <BsFillPencilFill
                              className="btn-dell"
                              title={'Editar registro'}
                              onClick={() => {
                                setUser(user);
                                setShowUserUpdate(true);
                                setEditing(2);
                              }}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <tr>
                        <CTableDataCell colSpan={7}>No hay Usuarios Registrados</CTableDataCell>
                      </tr>
                    )}
                  </CTableBody>
                </CTable>
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
              createUser={createUser} // Pasar la función createUser
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
  );
};

export default Users;