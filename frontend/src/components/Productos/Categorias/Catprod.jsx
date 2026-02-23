import React, { useRef, useState } from 'react';
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
  CFormSwitch, // Importado para el borrado lógico
} from '@coreui/react';
import {
  BsFillPencilFill,
  BsPlus,
  BsFillTrashFill,
} from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import 'react-datepicker/dist/react-datepicker.css';
import Register from './Register.jsx'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import CategoriaProdService from '../../../services/catprod.service.js';

const CategoriaSab = () => {
  // *** ESTADOS *** //
  const [cliente, setCliente] = useState('');
  const [loadingList, setLoading] = useState(false);
  const [catprod_name, setCatprodName] = useState(null);
  const [categoriasProd, setCategoriasProd] = React.useState([]);

  // *** MODALES Y EDICIÓN *** //
  const [showUsersAdd, setShowUsersAdd] = React.useState(false);
  const [editing, setEditing] = React.useState(0);

  // *** PAGINACION *** //
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(20);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalSize, setTotalSize] = React.useState(0);

  // --- CARGAR LISTA ---
  const loadList = async (dataPage, dataPageSize) => {
    setLoading(true);
    CategoriaProdService.listCatProd(dataPage, dataPageSize, catprod_name)
      .then((response) => {
        if (response.data && response.data.items) {
          setCategoriasProd(response.data.items);
          setSize(response.data.size);
          setTotalSize(response.data.totalItems);
          setPageCount(response.data.totalPages);
        } else {
          setCategoriasProd([]);
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
  }, [page, size, catprod_name]);

  // --- LOGICA DE ELIMINACIÓN LÓGICA (SOFT DELETE) ---
  const handleSoftDelete = async (item) => {
    try {
      await CategoriaProdService.softDeleteCatProd(item.catprod_cod);
      toast.info(`Estado de "${item.catprod_name}" actualizado`, {
        position: 'top-right',
        autoClose: 2000,
      });
      // Recargamos la lista para reflejar los cambios en cascada
      loadList(page, size);
    } catch (error) {
      toast.error('Error al cambiar el estado de la categoría');
    }
  };

  // --- LOGICA DE ELIMINACIÓN FÍSICA (HARD DELETE) ---
  const handleHardDelete = async (item) => {
    if (window.confirm(`¿Desea eliminar PERMANENTEMENTE "${item.catprod_name}"? Solo podrá hacerlo si no tiene productos asignados.`)) {
      try {
        await CategoriaProdService.deleteCatProd(item.catprod_cod);
        toast.success('Categoría eliminada físicamente');
        loadList(0, 20);
      } catch (error) {
        // Captura el error 400 del backend (si tiene productos)
        const errorMsg = error.response?.data?.message || 'Error al eliminar';
        toast.error(errorMsg);
      }
    }
  };

  // *** HANDLERS *** //
  const handlePageClick = (event) => {
    setPage(event.selected);
    loadList(event.selected, size);
  };

  const handleShowUsersAdd = () => setShowUsersAdd(true);

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
          <h4 className="card-title mb-4 text-dark">Gestión de Categorías de Productos</h4>
        </CCol>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ paddingBottom: 20 }}>
          <CButton color="dark" onClick={() => { setEditing(1); handleShowUsersAdd(); }}>
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
                  {categoriasProd.length > 0 ? (
                    categoriasProd.map((item) => (
                      <CTableRow key={item.catprod_cod}>
                        <CTableDataCell className="text-center">
                          {item.catprod_name}
                        </CTableDataCell>
                        
                       <CTableDataCell className="text-center">
                            <div className="d-flex align-items-center justify-content-center">
                              <CFormSwitch
                                  id={`switch-${item.catprod_cod}`}
                                  // Convertimos el 0 o 1 de la DB a un true/false para React
                                  checked={Number(item.catprod_estado) === 1} 
                                  onChange={() => handleSoftDelete(item)}
                                  style={{ cursor: 'pointer' }}
                                />
                                <span 
                                  className={`ms-2 fw-semibold ${Number(item.catprod_estado) === 1 ? 'text-success' : 'text-secondary'}`}
                                >
                                  {Number(item.catprod_estado) === 1 ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                         </CTableDataCell>
                        
                        <CTableDataCell className="text-center">
                          <CButton color="link" onClick={() => { setCliente(item.catprod_cod); setEditing(2); handleShowUsersAdd(); }}>
                            <BsFillPencilFill size={15} color="blue" title="Editar" />
                          </CButton>

                          <CButton color="link" onClick={() => handleHardDelete(item)}>
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
                  containerClassName="pagination mb-0"
                  activeClassName="active"
                />
                <span className="text-muted">Total: {totalSize} registros</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Renderizado de Modales */}
        {showUsersAdd && (
          <Register
            catprod_cod={editing === 2 ? cliente : null}
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