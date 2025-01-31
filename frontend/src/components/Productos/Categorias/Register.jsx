import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import CategoriaProdService from '../../../services/catprod.service.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategoriaProdForm = ({ showUsersAdd, handleCloseModal, notifySuccess, notifyError, catprod_cod }) => {
  const [formData, setFormData] = useState({
    catprod_name: '',
  });

  // Reiniciar el estado del formulario cuando el modal se abra
  useEffect(() => {
    if (showUsersAdd) {
      setFormData({
        catprod_name: '',
      });
    }
  }, [showUsersAdd]);

  // Si se está editando, carga los datos de la categoría
  useEffect(() => {
    if (catprod_cod && showUsersAdd) {
      CategoriaProdService.getCatProdById(catprod_cod)
        .then((response) => {
          setFormData({ catprod_name: response.data.catprod_name });
        })
        .catch((error) => {
          console.error('Error al cargar la categoría:', error);
          toast.error('Error al cargar la categoría', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  }, [catprod_cod, showUsersAdd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que el campo no esté vacío
    if (!formData.catprod_name.trim()) {
      toast.error('El nombre de la categoría es obligatorio', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      if (catprod_cod) {
        await CategoriaProdService.updateCatProd(catprod_cod, formData);
        toast.success('Categoría actualizada con éxito', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        await CategoriaProdService.createCatProd(formData);
        toast.success('Categoría creada con éxito', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      toast.error(error.response?.data?.message || 'Error al guardar la categoría', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Modal show={showUsersAdd} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center text-primary text-dark">
          {catprod_cod ? 'Editar Categoría' : 'Nueva Categoría'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.catprod_name}
              onChange={(e) => setFormData({ ...formData, catprod_name: e.target.value })}
              required
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

export default AddCategoriaProdForm;