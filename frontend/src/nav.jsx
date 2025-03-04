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
  cilTags,
  cilBasket,
  cilList,
  cilTruck,
  cilPizza

} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { 
  IceCreamBowl, 
  IceCreamCone, 
  Cast, 
  Settings, 
  TicketPercent,
  UserCog,
  History,
  ChartNoAxesCombined,
  Truck 
  } from 'lucide-react';

const _nav = [ 
  {
    component: CNavItem,
    name: 'Pantallas',
    to: '/pantalla/productos',
    meta: { role: ['ADMIN'] },
    icon: <Cast icon={cilMonitor
    } customclassname="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Pantalla Sabor',
    to: '/pantalla/sabores',
    meta: { role: ['ADMIN'] },
    icon: <Cast icon={cilMonitor
    } customclassname="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Sabores',
    to: '/sabores',
    meta: { role: ['ADMIN'] },
    icon: <IceCreamBowl icon={cilList} customclassname="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Sabores',
        to: '/sabores',
        meta: { role: ['ADMIN'] },
        icon: <IceCreamCone  customclassname="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Categorias',
        to: '/categorias/sabores',
        meta: { role: ['ADMIN'] },
        icon: <IceCreamBowl customclassname="nav-icon" />,
      }
      
  ]
},
{
  component: CNavGroup,
  name: 'Productos',
  meta: { role: ['ADMIN'] },
  icon: <CIcon icon={cilList} customclassname="nav-icon" />,
  items: [
   
    {
      component: CNavItem,
      name: 'Productos',
      to: '/productos',
      meta: { role: ['ADMIN'] },
      icon: <CIcon icon={cilPizza} customclassname="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Categorias',
      to: '/categorias/productos',
      meta: { role: ['ADMIN'] },
      icon: <CIcon icon={cilSettings} customclassname="nav-icon" />,
    }
]
},
  {
    component: CNavItem,
    name: 'Promociones',
    to: '/promociones',
    meta: { role: ['ADMIN'] },
    icon: <TicketPercent customclassname="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Ventas',
    to: '/ventas',
    meta: { role: ['ADMIN'] },
    icon: <ChartNoAxesCombined  customclassname="nav-icon" />,
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
    icon: <Settings  customclassname="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/configuraciones/usuarios',
        meta: { role: ['ADMIN'] },
        icon: <UserCog  customclassname="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Historial',
        to: '/historial',
        meta: { role: ['ADMIN'] },
        icon: <History  customclassname="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Proveedores',
        to: '/proveedores',
        meta: { role: ['ADMIN'] },
        icon: <Truck  customclassname="nav-icon" />,
      },
    ],
  },
]

export default _nav
