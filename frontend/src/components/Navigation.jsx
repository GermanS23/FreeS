import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilCart,
  cilBasket,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const Navigation = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    meta: { role: ['ENCARGADO', 'DUEÑO', 'ADMIN'] },
  },
  {
    component: CNavItem,
    name: "Productos",
    to: "/productos",
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    meta: { role: ['ENCARGADO', 'DUEÑO', 'ADMIN'] },
  },
  {
    component: CNavItem,
    name: "Categorías de Sabores",
    to: "/categories",
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    meta: { role: ['ENCARGADO', 'DUEÑO', 'ADMIN'] },
  }
]

export default Navigation