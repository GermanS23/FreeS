import { Navigate, Outlet, useLocation } from "react-router-dom"
import authService from "./services/auth.service"

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
import HistorialCajas from "./components/Cajas/HistorialCajas"
import DetalleCaja from "./components/Cajas/DetalleCaja"
import DetalleVenta from "./components/Cajas/DetalleVenta"
import Insumos from "./components/Insumos/Insumos"
import InsumosCriticos from "./components/Insumos/insumosCriticos"
import GestionRecetas from "./components/Insumos/GestionRecetas"





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
  
  // 🔹 Obtener usuario de forma segura
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch (e) {
      return null
    }
  }

  const currentUser = getCurrentUser()  // ✅ Usar la función segura

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
        { path: "config/usuarios", element: <Users /> },
        { path: "sucursales", element: <Sucursales /> },
        { path: "promociones", element: <Promociones /> },
        { 
          path: "pos", 
          element: <PosPage 
            sucCod={1}  // ✅ Hardcodeado por ahora
            usCod={currentUser?.us_cod}  // ✅ Seguro, usa optional chaining
          /> 
        },
        { path: "cajas/historial", element: <HistorialCajas sucCod={1} /> },
        { path: "cajas/detalle/:cajaId", element: <DetalleCaja /> },
        { path: "ventas/detalle/:ventaId", element: <DetalleVenta /> },
        { path: "insumos", element: <Insumos sucCod={1} /> },
        { path: "insumos-criticos", element: <InsumosCriticos sucCod={1} /> },
        { path: "recetas", element: <GestionRecetas sucCod={1} /> },
              ],
    },
    {
      // --- RUTA DE LOGIN ---
      path: "/login",
      element: !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />,
    },
    {
      // 🔹 --- NUEVA RUTA PÚBLICA PARA EL VISOR --- 🔹
      path: "/pantalla-viewer",
      element: <PublicScreenLayout />,
      children: [
        { path: ":pan_cod", element: <PantallaViewer /> }
      ]
    },
    {
      path: "*",
      element: <Navigate to={isLoggedIn ? "/" : "/login"} replace />
    }
  ]
}

export default routes