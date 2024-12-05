import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPuzzle,
  cilCloudDownload,
  cilLayers,
  cilSettings
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [ 
  {
    component: CNavItem,
    name: 'Sabores',
    to: '/sabores',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Productos',
    to: '/productos',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Promociones',
    to: '/promociones',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilCloudDownload} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Ventas',
    to: '/ventas',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tickets',
    to: '/tickets',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'CONFIGURACIONES',
  },
  {
    component: CNavGroup,
    name: 'Configuraciones',
    to: '/configuraciones',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/configuraciones/usuarios',
        meta: { role: ['ADMIN'] },
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Toners',
        to: '/configuraciones/toners',
        meta: { role: ['ADMIN'] },
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Proveedores',
        to: '/proveedores',
        meta: { role: ['ADMIN'] },
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav

