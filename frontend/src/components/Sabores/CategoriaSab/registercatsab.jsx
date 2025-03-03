import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import CategoriaSabService from '../../../api/catsab.js';
import { toast } from 'react-toastify';

const AddCategoriaSabForm = ({ showUsersAdd, handleCloseModal, notifySuccess, notifyError, catsab_cod }) => {
  const [formData, setFormData] = useState({
    catsab_name: '',
  });

  const inputRef = useRef(null); // Crear una referencia al input

  // Reiniciar el estado del formulario y enfocar el input cuando el modal se abra
  useEffect(() => {
    if (showUsersAdd) {
      setFormData({
        catsab_name: '',
      });
      if (inputRef.current) {
        inputRef.current.focus(); // Enfocar el input
      }
    }
  }, [showUsersAdd]);

  // Si se está editando, carga los datos de la categoría
  useEffect(() => {
    if (catsab_cod && showUsersAdd) {
      CategoriaSabService.getCategoriaSabById(catsab_cod)
        .then((response) => {
          setFormData({ catsab_name: response.data.catsab_name });
        })
        .catch((error) => {
          console.error('Error al cargar la categoría:', error);
        });
    }
  }, [catsab_cod, showUsersAdd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (catsab_cod) {
        await CategoriaSabService.updateCategoriaSab(catsab_cod, formData);
      } else {
        await CategoriaSabService.createCategoriaSab(formData);
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
        <Modal.Title>{catsab_cod ? 'Editar Categoría' : 'Nueva Categoría'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.catsab_name}
              onChange={(e) => setFormData({ ...formData, catsab_name: e.target.value })}
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

export default AddCategoriaSabForm;