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
import Register from './Register.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductosService from '../../services/productos.service.js';

const Productos = () => {
  const [cliente, setCliente] = useState('');
  const [loadingList, setLoading] = useState(false);
  const [catprod_name, setCatprodName] = useState(null);
  const [productos, setProductos] = React.useState([]);
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
    setProductos([]);
    setLoading(true);
    var param = {
      size: dataPageSize,
      page: dataPage,
      catprod_name: catprod_name,
    };
    ProductosService.listProductos(param.page, param.size, param.catprod_name)
      .then((response) => {
        if (response.data && response.data.items) {
          setProductos(response.data.items);
          setSize(response.data.size);
          setTotalSize(response.data.totalItems);
          setPageCount(response.data.totalPages);
        } else {
          setProductos([]);
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
  }, [page, size, catprod_name]);

  const refresh = () => {
    setPage(0);
    setProductos([]);
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
            Listado de Productos
          </h4>
        </CCol>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{ padding: 20 }}>
          <CButton  color="dark" onClick={abrirNuevoUsuario} title={'Crear nuevo registro'}>
            <BsPlus />
            Nuevo Producto
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
                        Producto
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">
                        Categoria
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">
                        Precio
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">
                        Despinibilidad
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col" align="center">
                        Acción
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {productos.length > 0 ? (
                      productos.map((item) => (
                        <CTableRow key={item.prod_cod}>
                          <CTableDataCell align="center">{item.prod_nom}</CTableDataCell>
                          <CTableDataCell align="center">{item?.CategoriaProd?.catprod_name}</CTableDataCell>
                          <CTableDataCell align="center">${item.prod_pre}</CTableDataCell>
                          <CTableDataCell align="center" >
                            <CFormSwitch
                              id={`disponible-${item.prod_cod}`}
                              label={item.prod_dis ? 'Disponible' : 'No Disponible'}
                              checked={item.prod_dis || false}
                              onChange={async () => {
                                try {
                                  const updatedProducto = await ProductosService.updateProd(item.prod_cod, {
                                    prod_dis: !item.prod_dis,
                                  });
                                  const updatedProductos = productos.map((producto) =>
                                    producto.prod_cod === item.prod_cod ? updatedProducto.data : producto
                                  );
                                  setProductos(updatedProductos);
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
                                setCliente(item.prod_cod);
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
                                await ProductosService.deleteProd(item.prod_cod);
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
            <Register
              showUsersAdd={showUsersAdd}
              handleCloseModal={handleCloseModal}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          ) : editing === 2 ? (
            <Register
              prod_cod={cliente}
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

export default Productos;