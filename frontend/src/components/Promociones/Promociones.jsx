// components/Promociones/Promociones.jsx
import React, { useRef, useState } from 'react';
import {
  CButton, CCard, CCardBody, CCol, CRow,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react';
import { BsFillPencilFill, BsPlus, BsFillTrashFill } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterPromo from './RegisterPromo.jsx'; // 🔹 Importa el nuevo modal
import PromocionesService from '../../services/promociones.service.js'; // 🔹 Importa el servicio de promos

const Promociones = () => {
  const [promoId, setPromoId] = useState(null); // Usamos un ID en lugar de 'cliente'
  const [promociones, setPromociones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  
  const [editing, setEditing] = useState(0); // 1 para crear, 2 para editar
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [loadingList, setLoading] = useState(false);

  // Carga la lista de promociones
  const loadList = async (dataPage, dataPageSize) => {
    setLoading(true);
    PromocionesService.listPromosAdmin(dataPage, dataPageSize, "") // Búsqueda por título no implementada aún
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

  // --- Notificaciones Toast ---
  const notifySuccess = (mensaje) => {
    toast.success(mensaje || 'Registro con éxito!', { /* ...config... */ });
  };
  const notifyError = (data) => {
    toast.error(data || 'Ocurrió un error.', { /* ...config... */ });
  };

  // --- Manejo del Modal ---
  const handleCloseModal = () => {
    setPromoId(null);
    setShowModal(false);
    loadList(page, size);
  };

  const abrirNuevo = () => {
    setPromoId(null);
    setEditing(1);
    handleShowModal();
  };
  
  const abrirEditar = (id) => {
    setPromoId(id);
    setEditing(2);
    handleShowModal();
  }

  // Formatear fecha
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
          <CButton color="dark" onClick={abrirNuevo} title={'Crear nueva promoción'}>
            <BsPlus />
            Nueva Promoción
          </CButton>
        </div>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody className="text-medium-emphasis small">
              <CTable align="middle" responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" align="center">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col" align="center">Importe</CTableHeaderCell>
                    <CTableHeaderCell scope="col" align="center">Fecha Inicio</CTableHeaderCell>
                    <CTableHeaderCell scope="col" align="center">Fecha Fin</CTableHeaderCell>
                    <CTableHeaderCell scope="col" align="center">Acción</CTableHeaderCell>
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
                        <CTableDataCell align="center">
                          <BsFillPencilFill
                            size={15}
                            className="btn-dell"
                            title={'Editar registro'}
                            onClick={() => abrirEditar(item.prom_cod)}
                          />
                          <BsFillTrashFill
                            style={{ marginLeft: 30 }}
                            size={15}
                            className="btn-dell"
                            title={'Eliminar Registro'}
                            onClick={async () => {
                              if (window.confirm("¿Seguro que quieres eliminar esta promoción?")) {
                                try {
                                  await PromocionesService.deletePromo(item.prom_cod);
                                  notifySuccess('Eliminado con éxito');
                                  loadList(page, size);
                                } catch (error) {
                                  notifyError('Error al eliminar');
                                }
                              }
                            }}
                          />
                        </CTableDataCell>
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
                // ... (tu config de ReactPaginate)
                pageCount={pageCount}
                onPageChange={handlePageClick}
                // ... (todas las demás props)
              />
              <span># Registros: {totalSize}</span>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          {showModal && ( // Renderiza el modal solo si 'showModal' es true
            <RegisterPromo
              prom_cod={promoId} // Pasa el ID de la promo a editar
              showUsersAdd={showModal} // Controla la visibilidad del modal
              handleCloseModal={handleCloseModal}
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          )}
        </CCol>
      </CRow>
      <ToastContainer />
    </CCard>
  );
};

export default Promociones;