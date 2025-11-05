import { Navigate } from "react-router-dom"
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

const routes = (isLoggedIn, setIsLoggedIn, isLoading) => {
  // Si está cargando, no renderices rutas protegidas
  if (isLoading) {
    return [
      {
        path: "*",
        element: <div>Cargando...</div>, // Mensaje de carga global
      },
    ]
  }

  return [
    {
      path: "/",
      element: isLoggedIn ? <AppLayout setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" replace />,
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
        { path: "pantalla-viewer/:pan_cod", element: <PantallaViewer /> },
        { path: "config/usuarios", element: <Users /> },
        { path: "sucursales", element: <Sucursales /> },
      ],
    },
    {
      path: "/login",
      element: !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />,
    },
  ]
}

export default routes
