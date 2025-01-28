import React from "react"
import { Navigate } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import Login from "./components/login/Login"
import Dashboard from "./components/Dashboard"
import CategoriasCRUD from "./components/Sabores/CategoriaSab/CategoriaSab"

const routes = (isLoggedIn, setIsLoggedIn) => [
  {
    path: "/",
    element: isLoggedIn ? <AppLayout setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "categorias/sabores", element: <CategoriasCRUD /> },
      // Add other routes here
    ],
  },
  {
    path: "/login",
    element: !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />,
  },
]

export default routes

