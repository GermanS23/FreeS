import  { useState, useEffect } from 'react';
import api from '../../api/catsab.js'; // Adjust the import path as needed

function CategoriesCRUD() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCatSab();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id, { name: newCategory });
    } else {
      await createCategory({ name: newCategory });
    }
    setNewCategory('');
    setEditingCategory(null);
  };

  const createCategory = async (data) => {
    try {
      await api.createCatSab(data);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const updateCategory = async (id, data) => {
    try {
      await api.updateCatSab(id, data);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.deleteCatSab(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
  };

  return (
    <div className="categories-crud">
      <h2>Categorías de Sabores</h2>
      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nombre de la categoría"
          required
        />
        <button type="submit">
          {editingCategory ? 'Actualizar' : 'Añadir'}
        </button>
      </form>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            <span>{category.name}</span>
            <div className="category-actions">
              <button onClick={() => handleEdit(category)}>Editar</button>
              <button onClick={() => deleteCategory(category.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesCRUD;