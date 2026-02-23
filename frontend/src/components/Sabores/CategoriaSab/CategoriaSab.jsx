import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSwitch,
  CSpinner,
} from '@coreui/react';
import {
  BsFillPencilFill,
  BsPlus,
  BsFillTrashFill,
} from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import { Modal } from 'react-bootstrap';
import AddCategoriaSabForm from './registercatsab.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoriaSabService from '../../../api/catsab.js';

const CategoriaSab = () => {
  const [cliente, setCliente] = useState('');
  const [loadingList, setLoading] = useState(false);
  const [catsab_name, setCatsabName] = useState(null);
  const [categoriasSab, setCategoriasSab] = useState([]);
  const [showUsersAdd, setShowUsersAdd] = useState(false);
  const [editing, setEditing] = useState(0);

  // Paginación
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  // Modal hard delete — igual que CategoriaProd
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // --- CARGAR LISTA --- idéntico a CategoriaProd
  const loadList = async (dataPage, dataPageSize) => {
    setLoading(true);
    CategoriaSabService.List(dataPage, dataPageSize, catsab_name)
      .then((response) => {
        if (response.data && response.data.items) {
          setCategoriasSab(response.data.items);
          setSize(response.data.size);
          setTotalSize(response.data.totalItems);
          setPageCount(response.data.totalPages);
        } else {
          setCategoriasSab([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    loadList(page, size);
  }, [page, size, catsab_name]);

  // --- SOFT DELETE — usa la respuesta del servidor para actualizar estado, sin loadList ---
  const handleSoftDelete = async (item) => {
    try {
      const response = await CategoriaSabService.softDeleteCategoriaSab(item.catsab_cod);
      // El servidor devuelve { estado: true/false } — usamos ESE valor para actualizar
      const nuevoEstado = Number(response.data.estado) // normaliza true→1, false→0, 1→1, 0→0
      
      setCategoriasSab(prev => prev.map(c => 
  c.catsab_cod === item.catsab_cod ? { ...c, catsab_estado: nuevoEstado } : c
))
console.log('Estado actual raw:', item.catsab_estado, typeof item.catsab_estado)
console.log('Nuevo estado:', nuevoEstado)
      toast.info(`Estado de "${item.catsab_name}" actualizado`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      toast.error('Error al cambiar el estado de la categoría');
    }
  };

  // --- HARD DELETE — idéntico a CategoriaProd ---
  const abrirConfirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const cancelarDelete = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmarDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      await CategoriaSabService.deleteCategoriaSab(itemToDelete.catsab_cod);
      toast.success('Categoría eliminada físicamente');
      setShowDeleteModal(false);
      setItemToDelete(null);
      loadList(0, size);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al eliminar';
      toast.error(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected);
    loadList(event.selected, size);
  };

  const handleCloseModal = () => {
    setCliente('');
    setShowUsersAdd(false);
    setEditing(0);
    loadList(page, size);
  };

  const notifySuccess = () => toast.success('Operación exitosa');
  const notifyError = (msg) => toast.error(msg);

  return (
    <CCard style={{ padding: 50, borderRadius: 10 }}>
      <CRow>
        <CCol xs={12}>
          <h4 className="card-title mb-4 text-dark">Gestión de Categorías de Sabores</h4>
        </CCol>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ paddingBottom: 20 }}>
          <CButton color="dark" onClick={() => { setEditing(1); setShowUsersAdd(true); }}>
            <BsPlus size={20} /> Nueva Categoría
          </CButton>
        </div>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CTable align="middle" responsive hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Nombre</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Estado / Visibilidad</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {categoriasSab.length > 0 ? (
                    categoriasSab.map((item) => (
                      <CTableRow key={item.catsab_cod}>
                        <CTableDataCell className="text-center">
                          {item.catsab_name}
                        </CTableDataCell>

                        {/* ✅ Mismo patrón que CategoriaProd: Number() === 1 */}
                        <CTableDataCell className="text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <CFormSwitch
                              id={`switch-${item.catsab_cod}`}
                              checked={Number(item.catsab_estado) === 1}
                              onChange={() => handleSoftDelete(item)}
                              style={{ cursor: 'pointer' }}
                            />
                            <span
                              className={`ms-2 fw-semibold ${Number(item.catsab_estado) === 1 ? 'text-success' : 'text-secondary'}`}
                            >
                              {Number(item.catsab_estado) === 1 ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </CTableDataCell>

                        <CTableDataCell className="text-center">
                          <CButton
                            color="link"
                            onClick={() => {
                              setCliente(item.catsab_cod);
                              setEditing(2);
                              setShowUsersAdd(true);
                            }}
                          >
                            <BsFillPencilFill size={15} color="blue" title="Editar" />
                          </CButton>

                          <CButton color="link" onClick={() => abrirConfirmDelete(item)}>
                            <BsFillTrashFill size={15} color="red" title="Eliminar Físicamente" />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">No hay registros</CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              <div className="d-flex justify-content-between align-items-center mt-3">
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
                />
                <span className="text-muted">Total: {totalSize} registros</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Modal confirmación hard delete — idéntico a CategoriaProd */}
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
              🗑 Eliminar categoría
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 text-center" style={{ background: '#fafbff' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <p className="fw-semibold text-dark mb-1">¿Estás seguro?</p>
            <p className="text-muted small">
              Estás por eliminar <strong>"{itemToDelete?.catsab_name}"</strong>. Solo es posible si no tiene sabores asignados. Esta acción no se puede deshacer.
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

        {/* Modal registro/edición */}
        {showUsersAdd && (
          <AddCategoriaSabForm
            catsab_cod={editing === 2 ? cliente : null}
            showUsersAdd={showUsersAdd}
            handleCloseModal={handleCloseModal}
            notifySuccess={notifySuccess}
            notifyError={notifyError}
          />
        )}
      </CRow>

      <ToastContainer />
    </CCard>
  );
};

export default CategoriaSab;