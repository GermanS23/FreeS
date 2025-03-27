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
import 'react-datepicker/dist/react-datepicker.css';
import AddCategoriaSabForm from './RegisterSuc.jsx'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify
import SucursalesService from '../../services/sucursales.service.js';

const Sucursales = () => {
  // *** BUSQUEDA *** //
  const [cliente, setCliente] = useState('');
  const [loadingList, setLoading] = useState(false);
  const [suc_name, setSucName] = useState(null);
  const [sucursales, setSucursales] = React.useState([]);

  // *** MODAL UPDATE REGISTRO *** //
  const [showCustomerUpdate, setShowCustomerUpdate] = React.useState(false);
  const handleShowCustomerUpdate = () => setShowCustomerUpdate(true);

  // *** MODAL ADD REGISTRO *** //
  const [showUsersAdd, setShowUsersAdd] = React.useState(false);
  const handleShowUsersAdd = () => setShowUsersAdd(true);

  const [editing, setEditing] = React.useState(0);

  // PAGINACION
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(20);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalSize, setTotalSize] = React.useState(0);
  const [totalItemsPage, setTotalItemsPage] = useState(0);

  //load list
  const loadList = async (dataPage, dataPageSize) => {
    setSucursales([]);
    setLoading(true);
    var param = {
      size: dataPageSize,
      page: dataPage,
      suc_name: suc_name,
    };
    SucursalesService.listSucursales(param.page, param.size, param.suc_name)
      .then((response) => {
        if (response.data && response.data.items) {
          setSucursales(response.data.items); // Cambia Aitems por items
          setSize(response.data.size);
          setTotalSize(response.data.totalItems);
          setPageCount(response.data.totalPages);
        } else {
          setSucursales([]); // Inicializa como un array vacío si no hay datos
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //search using string in service
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
  }, [page, size, suc_name]);

  // *** BOTON RESET DEL BUSCADOR *** //
  const refresh = () => {
    setPage(0);
    setSucursales([]);
    setSize(20);
    loadList(0, 20);
  };

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
    });
  };
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
          <h4 id="traffic" className="card-title mb-0 text-primary">
            Listado de Sucursales
          </h4>
        </CCol>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ padding: 20 }}>
          <CButton color="dark" onClick={abrirNuevoUsuario} title={'Crear nuevo registro'}>
            <BsPlus />
            Nueva Sucursal
          </CButton>
        </div>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody className="text-medium-emphasis small">
              <CCol xs={12} md={12}>
                <CTable align="middle" responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col" align="center">
                        Sucursal
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">
                        Acción
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sucursales.length > 0 ? (
                      sucursales.map((item) => (
                        <CTableRow key={item.suc_cod}>
                          <CTableDataCell align="center">{item.suc_name}</CTableDataCell>
                          
                          <CTableDataCell>
                            <BsFillPencilFill
                              size={15}
                              className="btn-dell"
                              title={'Editar registro'}
                              onClick={() => {
                                setCliente(item.suc_cod);
                                handleShowUsersAdd();
                                setEditing(2);
                              }}
                            />
                             <BsFillTrashFill style={{ marginLeft: 30 }}
                              size={15}
                              className="btn-dell"
                              title={'Eliminar Registro'}
                              onClick={async () => {
                                await SucursalesService.deleteSucursal(item.suc_cod);
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
              suc_cod={cliente}
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

export default Sucursales;