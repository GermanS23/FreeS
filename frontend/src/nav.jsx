import CIcon from "@coreui/icons-react"
import {
  cilSettings,
  cilList,
  cilPizza,
  cilOptions,
  cilPuzzle,
  cilScreenDesktop,
  cilTv,
  cilMonitor,
} from "@coreui/icons"
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react"
import {
  IceCreamBowl,
  IceCreamCone,
  Settings,
  TicketPercent,
  UserCog,
  History,
  ArrowUpFromLine as ChartNoAxesCombined,
  Truck,
  LogIn as Logs,
  Rat,
} from "lucide-react"

const _nav = [
  {
    component: CNavTitle,
    name: "PANTALLAS",
  },
  {
    component: CNavItem,
    name: "Ver Pantallas",
    to: "/pantallas",
    icon: <CIcon icon={cilTv} customClassName="nav-icon" />,
  },
  {
  component: CNavItem,
  name: "POS",
  to: "/pos",
  icon: <ChartNoAxesCombined className="nav-icon" />,
},
{
  component: CNavItem,
  name: "Cajas",
  to: "/cajas/historial",
  icon: <History className="nav-icon" />,
},
{
  component: CNavItem,
  name: "Insumos",
  to: "/insumos",
  icon: <History className="nav-icon" />,
},
{
  component: CNavItem,
  name: "Recetas",
  to: "/recetas",
  icon: <History className="nav-icon" />,
},
  {
    component: CNavGroup,
    name: "Administración",
    to: "/admin",
    icon: <CIcon icon={cilOptions} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Plantillas",
        to: "/admin/plantillas",
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Pantallas",
        to: "/admin/pantallas",
        icon: <CIcon icon={cilScreenDesktop} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavTitle,
    name: "ACCESO DIRECTO",
  },
  {
    component: CNavItem,
    name: "Menú de Productos",
    to: "/pantalla/productos",
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Menú de Sabores",
    to: "/pantalla/cremas-heladas",
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "Sabores",
    to: "/sabores",
    meta: { role: ["ADMIN"] },
    icon: <IceCreamBowl icon={cilList} customclassname="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Sabores",
        to: "/sabores",
        meta: { role: ["ADMIN"] },
        icon: <IceCreamCone customclassname="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Categorias",
        to: "/categorias/sabores",
        meta: { role: ["ADMIN"] },
        icon: <IceCreamBowl customclassname="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Productos",
    meta: { role: ["ADMIN"] },
    icon: <Logs customclassname="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Productos",
        to: "/productos",
        meta: { role: ["ADMIN"] },
        icon: <CIcon icon={cilPizza} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Categorias",
        to: "/categorias/productos",
        meta: { role: ["ADMIN"] },
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: "Promociones",
    to: "/promociones",
    meta: { role: ["ADMIN"] },
    icon: <TicketPercent customclassname="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Ventas",
    to: "/ventas",
    meta: { role: ["ADMIN"] },
    icon: <ChartNoAxesCombined customclassname="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "CONFIGURACIONES",
  },
  {
    component: CNavGroup,
    name: "Configuraciones",
    to: "/configuraciones",
    meta: { role: ["ADMIN"] },
    icon: <Settings customclassname="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Usuarios",
        to: "/config/usuarios",
        meta: { role: ["ADMIN"] },
        icon: <UserCog customclassname="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Historial",
        to: "/historial",
        meta: { role: ["ADMIN"] },
        icon: <History customclassname="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Proveedores",
        to: "/proveedores",
        meta: { role: ["ADMIN"] },
        icon: <Truck customclassname="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Sucursales",
        to: "/sucursales",
        meta: { role: ["ADMIN"] },
        icon: <Rat customclassname="nav-icon" />,
      },
    ],
  },
]

export default _nav
