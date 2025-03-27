import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import sucursalesService from '../../services/sucursales.service';
import { toast } from 'react-toastify';

const AddSucursalesForm = ({ showUsersAdd, handleCloseModal, notifySuccess, notifyError, suc_cod }) => {
  const [formData, setFormData] = useState({
    suc_name: '',
  });

  const inputRef = useRef(null); // Crear una referencia al input

  // Reiniciar el estado del formulario y enfocar el input cuando el modal se abra
  useEffect(() => {
    if (showUsersAdd) {
      setFormData({
        suc_name: '',
      });
      if (inputRef.current) {
        inputRef.current.focus(); // Enfocar el input
      }
    }
  }, [showUsersAdd]);

  // Si se está editando, carga los datos de la categoría
  useEffect(() => {
    if (suc_cod && showUsersAdd) {
      sucursalesService.getSucursalById(suc_cod)
        .then((response) => {
          setFormData({ catsab_name: response.data.suc_name });
        })
        .catch((error) => {
          console.error('Error al cargar la categoría:', error);
        });
    }
  }, [suc_cod, showUsersAdd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (suc_cod) {
        await sucursalesService.updateSucursal(suc_cod, formData);
      } else {
        await sucursalesService.createSucursal(formData);
      }
      notifySuccess();
      handleCloseModal();
    } catch (error) {
      notifyError(error.response?.data?.message || 'Error al guardar la categoría');
    }
  };

  return (
    <Modal show={showUsersAdd} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{suc_cod ? 'Editar Sucursal' : 'Nueva Sucursal'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.suc_name}
              onChange={(e) => setFormData({ ...formData, suc_name: e.target.value })}
              required
              ref={inputRef} // Asignar la referencia al input
            />
          </Form.Group>
          <Button type="submit" className="mt-3">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddSucursalesForm;