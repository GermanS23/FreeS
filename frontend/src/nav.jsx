import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPuzzle,
  cilCloudDownload,
  cilPeople,
  cilSettings,
  cilMonitor,
  cilChartLine,
  cilHistory,
  cilTags

} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [ 
  {
    component: CNavItem,
    name: 'Pantallas',
    to: '/pantallas',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilMonitor
    } customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Sabores',
    to: '/sabores',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Categorias',
        to: '/categorias/sabores',
        meta: { role: ['ADMIN'] },
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Sabores',
        to: '/sabores',
        meta: { role: ['ADMIN'] },
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
  ]
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
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Ventas',
    to: '/ventas',
    meta: { role: ['ADMIN'] },
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
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
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Historial',
        to: '/historial',
        meta: { role: ['ADMIN'] },
        icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
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
