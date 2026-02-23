import React from "react"
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react"
import { 
  IceCreamBowl, IceCreamCone, Settings, TicketPercent, 
  History, LayoutDashboard, Truck, Store, Package, ShoppingCart,
  Monitor, Tv, ListTree, Users, ReceiptText
} from "lucide-react"

// Mapeo según tu LocalStorage (rol: 4 es admin)
const ROLES = {
  ADMIN: 4,
  DUENO: 1, 
  ENCARGADO: 2
}

const _nav = [
  {
    component: CNavTitle,
    name: "OPERACIONES",
  },
   {
    component: CNavGroup,
    name: "POS & Stock",
    to: "/admin",
    icon: <ShoppingCart className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Punto de Venta (POS)",
        to: "/pos",
        icon: <ShoppingCart className="nav-icon" />,
        roles: [ROLES.ADMIN, ROLES.DUENO, ROLES.ENCARGADO]
      },
      {
        component: CNavItem,
        name: "Control de Stock",
        to: "/insumos",
        icon: <Package className="nav-icon" />,
        roles: [ROLES.ADMIN, ROLES.DUENO]
      },
      {
        component: CNavItem,
        name: "Historial de Cajas",
        to: "/cajas/historial",
        icon: <History className="nav-icon" />,
        roles: [ROLES.ADMIN, ROLES.DUENO]
      },
      {
        component: CNavItem,
        name: "Recetas",
        to: "/recetas",
        icon: <ReceiptText className="nav-icon" />,
        roles: [ROLES.ADMIN, ROLES.DUENO]
      },
    ],
  },
  
 
  
  {
    component: CNavTitle,
    name: "GESTIÓN DE CONTENIDO",
  },
  {
    component: CNavGroup,
    name: "Pantallas & Menús",
    to: "/admin",
    icon: <Monitor className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Ver Pantallas",
        to: "/pantallas",
        icon: <Tv className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Configurar Plantillas",
        to: "/admin/plantillas",
        roles: [ROLES.ADMIN, ROLES.DUENO]
      },
      {
        component: CNavItem,
        name: "Administrar Pantallas",
        to: "/admin/pantallas",
        roles: [ROLES.ADMIN, ROLES.DUENO]
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Cremas Heladas",
    icon: <IceCreamBowl className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Gestionar Sabores",
        to: "/sabores",
        icon: <IceCreamCone className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Categorías de Sabores",
        to: "/categorias/sabores",
        icon: <ListTree className="nav-icon" />,
        roles: [ROLES.ADMIN, ROLES.DUENO]
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Productos & Ventas",
    icon: <ReceiptText className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Gestionar Productos",
        to: "/productos",
        icon: <ReceiptText className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Categorías Prod.",
        to: "/categorias/productos",
        icon: <ReceiptText className="nav-icon" />,
        roles: [ROLES.ADMIN, ROLES.DUENO]
      },
      {
        component: CNavItem,
        name: "Promociones",
        to: "/promociones",
        icon: <TicketPercent className="nav-icon" />,
      },
    ],
  },

  {
    component: CNavTitle,
    name: "REPORTES & SISTEMA",
    roles: [ROLES.ADMIN, ROLES.DUENO]
  },
  {
    component: CNavItem,
    name: "Ventas & Estadísticas",
    to: "/ventas",
    icon: <LayoutDashboard className="nav-icon" />,
    roles: [ROLES.ADMIN, ROLES.DUENO]
  },
  {
    component: CNavGroup,
    name: "Configuración",
    icon: <Settings className="nav-icon" />,
    roles: [ROLES.ADMIN, ROLES.DUENO],
    items: [
      {
        component: CNavItem,
        name: "Usuarios",
        to: "/config/usuarios",
        icon: <Users className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Sucursales",
        to: "/sucursales",
        icon: <Store className="nav-icon" />,
      },
      
    ],
  },
]

export default _nav