// Plantillas predefinidas para diferentes tipos de componentes
// Estas plantillas sirven como punto de partida y pueden ser personalizadas

export const PLANTILLAS_DEFAULT = {
  menuSabores: {
    nombre: "Menú de Sabores - Clásico",
    tipo: "menu",
    descripcion: "Plantilla predeterminada para mostrar sabores de helados",
    config: {
      // Colores
      colorFondo: "#f8f9fa",
      colorPrimario: "#ff6b9d",
      colorSecundario: "#4ecdc4",
      colorTexto: "#2c3e50",
      colorTitulo: "#1a1a2e",

      // Tipografía
      fuenteTitulo: "Arial",
      fuenteTexto: "Arial",
      tamanoFuenteTitulo: "32px",
      tamanoFuenteTexto: "18px",
      pesoFuenteTitulo: "bold",

      // Layout
      columnas: 3,
      espaciado: "20px",
      borderRadius: "12px",

      // Elementos visuales
      mostrarLogo: true,
      mostrarFooter: true,
      mostrarPrecios: true,
      mostrarImagenes: true,

      // Animaciones
      animacionEntrada: "fadeIn",
      duracionAnimacion: "0.5s",

      // Sombras y efectos
      sombra: "0 4px 6px rgba(0,0,0,0.1)",
      efectoHover: true,
    },
    previewImage: "/menu-helados-colorido.jpg",
  },

  menuProductos: {
    nombre: "Menú de Productos - Moderno",
    tipo: "menu",
    descripcion: "Plantilla predeterminada para mostrar productos",
    config: {
      // Colores
      colorFondo: "#ffffff",
      colorPrimario: "#3498db",
      colorSecundario: "#2ecc71",
      colorTexto: "#34495e",
      colorTitulo: "#2c3e50",

      // Tipografía
      fuenteTitulo: "Helvetica",
      fuenteTexto: "Arial",
      tamanoFuenteTitulo: "28px",
      tamanoFuenteTexto: "16px",
      pesoFuenteTitulo: "bold",

      // Layout
      columnas: 4,
      espaciado: "16px",
      borderRadius: "8px",

      // Elementos visuales
      mostrarLogo: true,
      mostrarFooter: true,
      mostrarPrecios: true,
      mostrarImagenes: true,
      mostrarStock: true,

      // Animaciones
      animacionEntrada: "slideIn",
      duracionAnimacion: "0.3s",

      // Sombras y efectos
      sombra: "0 2px 4px rgba(0,0,0,0.08)",
      efectoHover: true,
    },
    previewImage: "/menu-productos-moderno.jpg",
  },

  dashboardVentas: {
    nombre: "Dashboard de Ventas",
    tipo: "dashboard",
    descripcion: "Plantilla para mostrar métricas y estadísticas",
    config: {
      // Colores
      colorFondo: "#1a1a2e",
      colorPrimario: "#16213e",
      colorSecundario: "#0f3460",
      colorTexto: "#e94560",
      colorTitulo: "#ffffff",

      // Tipografía
      fuenteTitulo: "Arial",
      fuenteTexto: "Arial",
      tamanoFuenteTitulo: "24px",
      tamanoFuenteTexto: "14px",
      pesoFuenteTitulo: "bold",

      // Layout
      columnas: 2,
      espaciado: "24px",
      borderRadius: "16px",

      // Elementos visuales
      mostrarLogo: true,
      mostrarFooter: false,
      mostrarGraficos: true,

      // Animaciones
      animacionEntrada: "fadeIn",
      duracionAnimacion: "0.4s",

      // Sombras y efectos
      sombra: "0 8px 16px rgba(0,0,0,0.3)",
      efectoHover: false,
    },
    previewImage: "/dashboard-ventas-oscuro.jpg",
  },

  listaSimple: {
    nombre: "Lista Simple",
    tipo: "lista",
    descripcion: "Plantilla minimalista para listas",
    config: {
      // Colores
      colorFondo: "#fafafa",
      colorPrimario: "#333333",
      colorSecundario: "#666666",
      colorTexto: "#444444",
      colorTitulo: "#222222",

      // Tipografía
      fuenteTitulo: "Arial",
      fuenteTexto: "Arial",
      tamanoFuenteTitulo: "20px",
      tamanoFuenteTexto: "14px",
      pesoFuenteTitulo: "normal",

      // Layout
      columnas: 1,
      espaciado: "12px",
      borderRadius: "4px",

      // Elementos visuales
      mostrarLogo: false,
      mostrarFooter: false,

      // Animaciones
      animacionEntrada: "none",
      duracionAnimacion: "0s",

      // Sombras y efectos
      sombra: "none",
      efectoHover: false,
    },
    previewImage: "/lista-simple-minimalista.jpg",
  },
}

// Función para obtener una plantilla default por tipo
export const getPlantillaDefault = (tipo) => {
  const plantillas = {
    menuSabores: PLANTILLAS_DEFAULT.menuSabores,
    menuProductos: PLANTILLAS_DEFAULT.menuProductos,
    dashboard: PLANTILLAS_DEFAULT.dashboardVentas,
    lista: PLANTILLAS_DEFAULT.listaSimple,
  }

  return plantillas[tipo] || PLANTILLAS_DEFAULT.menuSabores
}

// Función para crear una plantilla personalizada basada en una default
export const crearPlantillaPersonalizada = (tipoBase, personalizacion) => {
  const plantillaBase = getPlantillaDefault(tipoBase)

  return {
    ...plantillaBase,
    nombre: personalizacion.nombre || plantillaBase.nombre,
    config: {
      ...plantillaBase.config,
      ...personalizacion.config,
    },
  }
}

export default PLANTILLAS_DEFAULT
