import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  CSpinner,
} from '@coreui/react';
import { BsFillPencilFill, BsSearch, BsArrowClockwise, BsPlus, BsTrashFill } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import { Modal } from 'react-bootstrap';
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

  // Estado para modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const buscadorRef = useRef('');

  const getUsuarios = useCallback(async (currentPage, currentSize, currentTitle) => {
    try {
      const response = await userService.getListUser(currentPage, currentSize, currentTitle);
      setUsuarios(response.data.items || []);
      setPageCount(response.data.totalPages || 0);
      setTotalSize(response.data.totalItems || 0);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("Error al cargar la lista de usuarios");
    }
  }, []);

  useEffect(() => {
    getUsuarios(page, size, title);
  }, [page, size, title, getUsuarios]);

  useEffect(() => {
    const initData = async () => {
      await getRoles();
      await getCurrentUserInfo();
    };
    initData();
  }, []);

  const getRoles = async () => {
    try {
      const response = await authService.getRoles();
      setRoles(response.data.rows);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const response = await authService.getCurrentUser();
      const userRole = response.data.body.roles.rol_desc;
      if (userRole === 'ADMIN' || userRole === 'DUEÑO') {
        setUserRoot(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchingUsuarios = () => {
    setTitle(buscadorRef.current.value);
    setPage(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchingUsuarios();
  };

  const refresh = () => {
    buscadorRef.current.value = '';
    setTitle('');
    setPage(0);
  };

  const handlePageClick = (event) => setPage(event.selected);

  const abrirNuevoUsuario = () => {
    setUser(null);
    setEditing(1);
    setShowUsersAdd(true);
  };

  const handleCloseModal = () => {
    setShowUsersAdd(false);
    setEditing(0);
    getUsuarios(page, size, title);
  };

  const handleCloseModalUpdate = () => {
    setShowUserUpdate(false);
    setEditing(0);
    getUsuarios(page, size, title);
  };

  // Handlers para eliminar
  const abrirConfirmDelete = (u) => {
    setUserToDelete(u);
    setShowDeleteModal(true);
  };

  const cancelarDelete = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmarDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await userService.removeUser(userToDelete.us_cod);
      toast.success(`Usuario "${userToDelete.us_user}" eliminado correctamente`);
      setShowDeleteModal(false);
      setUserToDelete(null);
      getUsuarios(page, size, title);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error(error.response?.data?.message || 'Error al eliminar el usuario');
    } finally {
      setDeleting(false);
    }
  };

  const notifySuccess = () => toast.success('Operación exitosa!');
  const notifyError = (msg) => toast.error(msg || 'Ocurrió un error');

  return (
    <CCard className="p-4" style={{ borderRadius: 15 }}>
      <CRow className="align-items-center mb-4">
        <CCol md={4}>
          <h4 className="text-primary mb-0">Gestión de Usuarios</h4>
        </CCol>
        <CCol md={8}>
          <CInputGroup>
            <CFormInput
              ref={buscadorRef}
              placeholder="Buscar por nombre, apellido o usuario..."
              onKeyDown={handleKeyDown}
              className="shadow-sm"
              style={{ borderRadius: '10px 0 0 10px' }}
            />
            <CButton color="primary" type="button" onClick={searchingUsuarios} className="d-flex align-items-center">
              <BsSearch className="me-1" /> Buscar
            </CButton>
            <CButton color="secondary" variant="outline" type="button" onClick={refresh} className="d-flex align-items-center">
              <BsArrowClockwise className="me-1" /> Limpiar
            </CButton>
          </CInputGroup>
        </CCol>
      </CRow>

      {userRoot && (
        <div className="d-flex justify-content-end mb-3">
          <CButton onClick={abrirNuevoUsuario} color="dark" className="shadow-sm">
            <BsPlus size={20} /> Nuevo Usuario
          </CButton>
        </div>
      )}

      <CCard className="border-0 shadow-sm">
        <CCardBody>
          <CTable align="middle" responsive hover striped>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Usuario</CTableHeaderCell>
                <CTableHeaderCell>Nombre y Apellido</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Teléfono</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acción</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.length > 0 ? (
                users.map((u) => (
                  <CTableRow key={u.us_cod}>
                    <CTableDataCell className="fw-bold">{u.us_user}</CTableDataCell>
                    <CTableDataCell>{u.us_nomape}</CTableDataCell>
                    <CTableDataCell>{u.us_email}</CTableDataCell>
                    <CTableDataCell>{u.us_tel || '—'}</CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-info text-dark">{u.roles?.rol_desc}</span>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <CButton
                          color="link"
                          title="Editar usuario"
                          onClick={() => {
                            setUser(u);
                            setEditing(2);
                            setShowUserUpdate(true);
                          }}
                        >
                          <BsFillPencilFill className="text-warning" size={17} />
                        </CButton>
                        {userRoot && (
                          <CButton
                            color="link"
                            title="Eliminar usuario"
                            onClick={() => abrirConfirmDelete(u)}
                          >
                            <BsTrashFill className="text-danger" size={17} />
                          </CButton>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center py-5 text-muted">
                    No se encontraron usuarios con el criterio "{title}"
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>Total: <strong>{totalSize}</strong> usuarios</span>
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
              containerClassName="pagination mb-0"
              activeClassName="active"
              forcePage={page}
            />
          </div>
        </CCardBody>
      </CCard>

      {/* Modal de confirmación de eliminación */}
      <Modal
        show={showDeleteModal}
        onHide={cancelarDelete}
        centered
        size="sm"
        style={{ zIndex: 1070 }}
      >
        <Modal.Header
          closeButton
          className="border-0"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            borderRadius: '12px 12px 0 0',
            padding: '16px 20px'
          }}
        >
          <Modal.Title className="fw-bold text-white" style={{ fontSize: '1rem' }}>
            🗑 Eliminar usuario
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center" style={{ background: '#fafbff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
          <p className="fw-semibold text-dark mb-1">¿Estás seguro?</p>
          <p className="text-muted small">
            Estás por eliminar al usuario <strong>"{userToDelete?.us_user}"</strong>. Esta acción no se puede deshacer.
          </p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <CButton
              color="light"
              onClick={cancelarDelete}
              style={{ border: '1px solid #d1d5db', borderRadius: '8px', minWidth: '90px' }}
              disabled={deleting}
            >
              Cancelar
            </CButton>
            <CButton
              onClick={confirmarDelete}
              disabled={deleting}
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                minWidth: '110px'
              }}
            >
              {deleting ? <CSpinner size="sm" /> : '🗑 Eliminar'}
            </CButton>
          </div>
        </Modal.Body>
      </Modal>

      <ToastContainer />

      {editing === 1 && (
        <AddUsersForm
          showUsersAdd={showUsersAdd}
          roles={roles}
          handleCloseModal={handleCloseModal}
          notifySuccess={notifySuccess}
          notifyError={notifyError}
          createUser={async (data) => {
            await userService.createUser(data);
            getUsuarios(page, size, title);
          }}
        />
      )}
      {editing === 2 && (
        <UpdateUserForm
          showUserUpdate={showUserUpdate}
          roles={roles}
          user={user}
          handleCloseModalUpdate={handleCloseModalUpdate}
          notifySuccess={notifySuccess}
          notifyError={notifyError}
        />
      )}
    </CCard>
  );
};

export default Users;