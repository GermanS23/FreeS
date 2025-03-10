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
  CFormSwitch,
} from '@coreui/react';
import {
  BsFillPencilFill,
  BsPlus,
  BsFillTrashFill,
} from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import 'react-datepicker/dist/react-datepicker.css';
import AddCategoriaSabForm from './RegisterSabs.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaboresService from '../../services/sabores.service.js';

const Sabores = () => {
  const [cliente, setCliente] = useState('');
  const [loadingList, setLoading] = useState(false);
  const [catsab_name, setCatsabName] = useState(null);
  const [sabores, setSabores] = React.useState([]);
  const [showCustomerUpdate, setShowCustomerUpdate] = React.useState(false);
  const [showUsersAdd, setShowUsersAdd] = React.useState(false);
  const handleShowUsersAdd = () => setShowUsersAdd(true);
  const [editing, setEditing] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(20);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalSize, setTotalSize] = React.useState(0);
  const [totalItemsPage, setTotalItemsPage] = useState(0);

  const loadList = async (dataPage, dataPageSize) => {
    setSabores([]);
    setLoading(true);
    var param = {
      size: dataPageSize,
      page: dataPage,
      catsab_name: catsab_name,
    };
    SaboresService.listSabores(param.page, param.size, param.catsab_name)
      .then((response) => {
        if (response.data && response.data.items) {
          setSabores(response.data.items);
          setSize(response.data.size);
          setTotalSize(response.data.totalItems);
          setPageCount(response.data.totalPages);
        } else {
          setSabores([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const findByTitle = () => {
    loadList(0, 20);
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * size) % cliente.length;
    setTotalSize(newOffset);
    loadList(event.selected, size);
  };

  React.useEffect(() => {
    loadList(page, size);
  }, [page, size, catsab_name]);

  const refresh = () => {
    setPage(0);
    setSabores([]);
    setSize(20);
    loadList(0, 20);
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

  const handleCloseModal = () => {
    setCliente('');
    setShowUsersAdd();
    loadList(0, 20, '');
  };

  async function abrirNuevoUsuario() {
    try {
      setCliente('');
      handleShowUsersAdd();
      setEditing(1);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <CCard style={{ padding: 50, borderRadius: 10 }}>
      <CRow>
        <CCol xs={12}>
          <h4 id="traffic" className="card-title mb-0 text-primary text-dark">
            Listado de Sabores
          </h4>
        </CCol>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ padding: 20 }}>
          <CButton  color="dark" onClick={abrirNuevoUsuario} title={'Crear nuevo registro'}>
            <BsPlus />
            Nuevo Sabor
          </CButton>
        </div>
        <CCol xs={12}>
          <CCard className="mb-4"  >
            <CCardBody className="text-medium-emphasis small"  >
              <CCol xs={12} md={12}>
                <CTable align="middle" responsive  >
                  <CTableHead>
                    <CTableRow >
                      <CTableHeaderCell scope="col" align="center">
                        Sabor
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">
                        Categoria
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">
                        Disponibilidad
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">
                        Acción
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sabores.length > 0 ? (
                      sabores.map((item) => (
                        <CTableRow key={item.sab_cod}>
                          <CTableDataCell align="center">{item.sab_nom}</CTableDataCell>
                          <CTableDataCell align="center">{item?.CategoriaSab?.catsab_name}</CTableDataCell>
                          <CTableDataCell align="center" >
                            <CFormSwitch
                              id={`disponible-${item.sab_cod}`}
                              label={item.sab_disp ? 'Disponible' : 'No Disponible'}
                              checked={item.sab_disp || false}
                              onChange={async () => {
                                try {
                                  const updatedSabor = await SaboresService.updateSab(item.sab_cod, {
                                    sab_disp: !item.sab_disp,
                                  });
                                  const updatedSabores = sabores.map((sabor) =>
                                    sabor.sab_cod === item.sab_cod ? updatedSabor.data : sabor
                                  );
                                  setSabores(updatedSabores);
                                  toast.success('Disponibilidad actualizada', {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                } catch (error) {
                                  console.error('Error al actualizar la disponibilidad', error);
                                  toast.error('Error al actualizar la disponibilidad', {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                }
                              }}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <BsFillPencilFill
                              size={15}
                              className="btn-dell"
                              title={'Editar registro'}
                              onClick={() => {
                                setCliente(item.sab_cod);
                                handleShowUsersAdd();
                                setEditing(2);
                              }}
                            />
                            <BsFillTrashFill
                              style={{ marginLeft: 30 }}
                              size={15}
                              className="btn-dell"
                              title={'Eliminar Registro'}
                              onClick={async () => {
                                await SaboresService.deleteSab(item.sab_cod);
                                toast.success('Eliminado con éxito', {
                                  position: 'top-right',
                                  autoClose: 3000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                });
                                loadList(0, 10);
                              }}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <tr>
                        <CTableDataCell colSpan={3}>
                          No hay registros con los filtros actuales
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
            <AddCategoriaSabForm
              showUsersAdd={showUsersAdd}
              handleCloseModal={handleCloseModal}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          ) : editing === 2 ? (
            <AddCategoriaSabForm
              sab_cod={cliente}
              showUsersAdd={showUsersAdd}
              handleCloseModal={handleCloseModal}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          ) : (
            <div></div>
          )}
        </CCol>
      </CRow>
      <ToastContainer />
    </CCard>
  );
};

export default Sabores;