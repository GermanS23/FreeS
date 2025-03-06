import MenuProductos from './PantallaProductos';
import MenuSabores from './PantallaSabores';

// Registro de componentes disponibles
const componentRegistry = {
  // Menús
  'menu-productos': {
    component: MenuProductos,
    name: 'Menú de Productos',
    description: 'Muestra un menú con los productos disponibles',
    category: 'menu',
    previewImage: '/previews/menu-productos.png',
    defaultConfig: {
      titulo: 'PRODUCTOS',
      columnas: 2,
      mostrarPrecios: true,
      colorFondo: '#e6f7ff',
      colorTexto: '#000000',
      fuenteTitulo: 'Arial',
      fuenteTexto: 'Arial',
      tamanoFuenteTitulo: '24px',
      tamanoFuenteTexto: '16px'
    }
  },
  'menu-sabores': {
    component: MenuSabores,
    name: 'Menú de Sabores',
    description: 'Muestra un menú con los sabores disponibles',
    category: 'menu',
    previewImage: '/previews/menu-sabores.png',
    defaultConfig: {
      titulo: 'CREMAS HELADAS',
      columnas: 2,
      mostrarDescripciones: true,
      colorFondo: '#e6f7ff',
      colorTexto: '#000000',
      fuenteTitulo: 'Arial',
      fuenteTexto: 'Arial',
      tamanoFuenteTitulo: '24px',
      tamanoFuenteTexto: '16px'
    }
  }
};

// Función para obtener un componente por su ID
export const getComponent = (componentId) => {
  return componentRegistry[componentId] || null;
};

// Función para obtener todos los componentes
export const getAllComponents = () => {
  return Object.keys(componentRegistry).map(key => ({
    id: key,
    ...componentRegistry[key]
  }));
};

// Función para obtener componentes por categoría
export const getComponentsByCategory = (category) => {
  return Object.keys(componentRegistry)
    .filter(key => componentRegistry[key].category === category)
    .map(key => ({
      id: key,
      ...componentRegistry[key]
    }));
};

export default componentRegistry;