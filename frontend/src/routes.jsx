import { Navigate, Outlet, useLocation } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import Login from "./components/login/Login"
import Dashboard from "./components/Dashboard"
import CategoriasCRUD from "./components/Sabores/CategoriaSab/CategoriaSab"
import Sabores from "./components/Sabores/Sabores"
import CategoriasProd from "./components/Productos/Categorias/Catprod"
import Productos from "./components/Productos/Productos"
import PanProductos from "./components/Pantallas/PantallaProductos"
import PanSabores from "./components/Pantallas/PantallaSabores"
import AdminPlantillas from "./components/Plantillas/AdminPlantillas"
import AdminPantallas from "./components/Pantallas/AdminPantallas"
import PantallaViewer from "./components/Pantallas/PantallaViewer"
import PantallasDisplay from "./components/Pantallas/PantallaDisplay"
import Users from "./components/Usuarios/index"
import Sucursales from "./components/Sucursales/Sucursales"
import Promociones from "./components/Promociones/Promociones"
import PosPage from "./components/POS/PosPage"

// 🔹 COMPONENTE 1: Rutas Protegidas (Tu AppLayout)
// Si el usuario está logueado, muestra el layout de admin. Si no, lo manda al login.
const ProtectedRoute = ({ isLoggedIn, setIsLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return <AppLayout setIsLoggedIn={setIsLoggedIn} />
}

// 🔹 COMPONENTE 2: Rutas Públicas Limpias
// Un layout simple que solo renderiza el componente hijo (PantallaViewer)
// sin Sidebar, Header ni Footer.
const PublicScreenLayout = () => {
  return <Outlet /> 
}


const routes = (isLoggedIn, setIsLoggedIn, isLoading) => {
  if (isLoading) {
    return [
      {
        path: "*",
        element: <div>Cargando...</div>,
      },
    ]
  }

  return [
    {
      // --- RUTAS DEL PANEL DE ADMIN (Protegidas) ---
      path: "/",
      element: <ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "categorias/sabores", element: <CategoriasCRUD /> },
        { path: "sabores", element: <Sabores /> },
        { path: "categorias/productos", element: <CategoriasProd /> },
        { path: "productos", element: <Productos /> },
        { path: "pantalla/productos", element: <PanProductos /> },
        { path: "pantalla/cremas-heladas", element: <PanSabores /> },
        { path: "admin/plantillas", element: <AdminPlantillas /> },
        { path: "admin/pantallas", element: <AdminPantallas /> },
        { path: "pantallas", element: <PantallasDisplay /> },
        // 🔹 'pantalla-viewer' YA NO ESTÁ AQUÍ 🔹
        { path: "config/usuarios", element: <Users /> },
        { path: "sucursales", element: <Sucursales /> },
        { path: "promociones", element: <Promociones /> },
        {path: "pos", element: <PosPage sucCod={1} />},
      ],
    },
    {
      // --- RUTA DE LOGIN ---
      path: "/login",
      element: !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />,
    },
    {
      // 🔹 --- NUEVA RUTA PÚBLICA PARA EL VISOR --- 🔹
      // Esta ruta NO tiene el AppLayout (Sidebar/Header)
      path: "/pantalla-viewer",
      element: <PublicScreenLayout />, // Usa el layout limpio
      children: [
        // La ruta es '/pantalla-viewer/:pan_cod'
        { path: ":pan_cod", element: <PantallaViewer /> }
      ]
    },
    {
      // Ruta de fallback por si algo sale mal
      path: "*",
      element: <Navigate to={isLoggedIn ? "/" : "/login"} replace />
    }
  ]
}

export default routes