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
} from '@coreui/react';
import {
  BsFillPencilFill,
  BsPlus,
  BsFillTrashFill,
} from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import RegisterPromo from './RegisterPromo.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PromocionesService from '../../services/promociones.service.js';

const Promociones = () => {
  const [promoId, setPromoId] = useState('');
  const [loadingList, setLoading] = useState(false);
  const [promociones, setPromociones] = useState([]);
  const [showUsersAdd, setShowUsersAdd] = useState(false);
  const handleShowUsersAdd = () => setShowUsersAdd(true);
  const [editing, setEditing] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
 const user = JSON.parse(localStorage.getItem('user'));
  const isEncargado = user?.rol === 2;  

  const loadList = async (dataPage, dataPageSize) => {
    setPromociones([]);
    setLoading(true);
    PromocionesService.listPromosAdmin(dataPage, dataPageSize, "")
      .then((response) => {
        if (response.data && response.data.items) {
          setPromociones(response.data.items);
          setSize(response.data.size);
          setTotalSize(response.data.totalItems);
          setPageCount(response.data.totalPages);
        } else {
          setPromociones([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handlePageClick = (event) => {
    loadList(event.selected, size);
  };

  React.useEffect(() => {
    loadList(page, size);
  }, [page, size]);

  const notifySuccess = (mensaje) => {
    toast.success(mensaje || 'Registro con éxito!', {
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
    toast.error(data || 'Ocurrió un error', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleCloseModal = () => {
    setPromoId('');
    setShowUsersAdd(false);
    loadList(0, 20);
  };

  async function abrirNuevaPromo() {
    try {
      setPromoId('');
      handleShowUsersAdd();
      setEditing(1);
    } catch (error) {
      console.log(error);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <CCard style={{ padding: 50, borderRadius: 10 }}>
      <CRow>
        <CCol xs={12}>
          <h4 id="traffic" className="card-title mb-0 text-primary text-dark">
            Listado de Promociones
          </h4>
        </CCol>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ padding: 20 }}>
           {!isEncargado && (
          <CButton color="dark" onClick={abrirNuevaPromo} title={'Crear nueva promoción'}>
            <BsPlus />
            Nueva Promoción
          </CButton>
          )}
        </div>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody className="text-medium-emphasis small">
              <CCol xs={12} md={12}>
                <CTable align="middle" responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col" align="center">Nombre</CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">Importe</CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">Fecha Inicio</CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">Fecha Fin</CTableHeaderCell>
                       {!isEncargado && (
                      <CTableHeaderCell scope="col" align="center">Acción</CTableHeaderCell>
                        )}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {promociones.length > 0 ? (
                      promociones.map((item) => (
                        <CTableRow key={item.prom_cod}>
                          <CTableDataCell align="center">{item.prom_nom}</CTableDataCell>
                          <CTableDataCell align="center">${Number(item.prom_importe).toLocaleString()}</CTableDataCell>
                          <CTableDataCell align="center">{formatDate(item.prom_fechaini)}</CTableDataCell>
                          <CTableDataCell align="center">{formatDate(item.prom_fechafin)}</CTableDataCell>
                          {!isEncargado && (
                          <CTableDataCell align="center">
                            <BsFillPencilFill
                              size={15}
                              className="btn-dell"
                              style={{ cursor: 'pointer' }}
                              title={'Editar registro'}
                              onClick={() => {
                                setPromoId(item.prom_cod);
                                handleShowUsersAdd();
                                setEditing(2);
                              }}
                            />
                            <BsFillTrashFill
                              style={{ marginLeft: 30, cursor: 'pointer' }}
                              size={15}
                              className="btn-dell"
                              title={'Eliminar Registro'}
                              onClick={async () => {
                                if (window.confirm("¿Seguro que quieres eliminar esta promoción?")) {
                                  try {
                                    await PromocionesService.deletePromo(item.prom_cod);
                                    notifySuccess('Eliminado con éxito');
                                    loadList(0, 20);
                                  } catch (error) {
                                    notifyError('Error al eliminar');
                                  }
                                }
                              }}
                            />
                          </CTableDataCell>
                            )}
                        </CTableRow>
                      ))
                    ) : (
                      <tr>
                        <CTableDataCell colSpan={5} align="center">
                          No hay registros para mostrar.
                        </CTableDataCell>
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
                <span># Registros: {totalSize}</span>
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          {editing === 1 ? (
            <RegisterPromo
              showUsersAdd={showUsersAdd}
              handleCloseModal={handleCloseModal}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          ) : editing === 2 ? (
            <RegisterPromo
              prom_cod={promoId}
              showUsersAdd={showUsersAdd}
              handleCloseModal={handleCloseModal}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          ) : null}
        </CCol>
      </CRow>
      <ToastContainer />
    </CCard>
  );
};

export default Promociones;