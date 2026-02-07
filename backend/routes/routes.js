import express from "express"

import rolesController from "../controllers/rolesController.js"
import catprodController from "../controllers/catprodController.js"
import catsabController from "../controllers/catsabController.js"
import usuariosController from "../controllers/usuariosController.js"
import tdController from "../controllers/tdController.js"
import sucursalesController from "../controllers/sucursalesController.js"
import sabheladosController from "../controllers/sabheladosController.js"
import productosController from "../controllers/productosController.js"
import plantillaController from "../controllers/plantillaController.js"
import pantallaController from "../controllers/pantallaController.js"
import authController from "../controllers/authController.js"
import promocionesController from "../controllers/promocionesController.js"
import VentasController from "../controllers/ventaController.js"
import DescuentoVentasController from "../controllers/descuentoventasController.js"
import MetodosPagoController from '../controllers/metodospagoController.js'
import CajasController from "../controllers/cajasController.js"
import EstadisticasController from "../controllers/estadisticasController.js"
import InsumosController from "../controllers/insumosController.js"
import RecetasController from "../controllers/recetasController.js"


import authJwt from "../middleware/authjwt.js"
import upload from "../config/multer.config.js"

const rolesRouter = express.Router()
const catprodRouter = express.Router()
const catsabRouter = express.Router()
const usuariosRouter = express.Router()
const tdRouter = express.Router()
const sucursalesRouter = express.Router()
const sabheladosRouter = express.Router()
const productosRouter = express.Router()
const plantillaRouter = express.Router()
const pantallaRouter = express.Router()
const authRouter = express.Router()
const promocionesRouter = express.Router()
const ventasRouter = express.Router()
const descuentoventasRouter = express.Router()
const metodospagoRouter = express.Router()
const cajasRouter = express.Router()
const estadisticasRouter = express.Router()
const insumosRouter = express.Router()
const recetasRouter = express.Router()


// Middleware para headers
const headerMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
  next()
}

// Aplicar middleware a todos los routers
rolesRouter.use(headerMiddleware)
catprodRouter.use(headerMiddleware)
catsabRouter.use(headerMiddleware)
usuariosRouter.use(headerMiddleware)
tdRouter.use(headerMiddleware)
sucursalesRouter.use(headerMiddleware)
sabheladosRouter.use(headerMiddleware)
productosRouter.use(headerMiddleware)
plantillaRouter.use(headerMiddleware)
pantallaRouter.use(headerMiddleware)
authRouter.use(headerMiddleware)
promocionesRouter.use(headerMiddleware)
ventasRouter.use(headerMiddleware)
descuentoventasRouter.use(headerMiddleware)
metodospagoRouter.use(headerMiddleware)
cajasRouter.use(headerMiddleware)
estadisticasRouter.use(headerMiddleware)
insumosRouter.use(headerMiddleware)
recetasRouter.use(headerMiddleware)


// ==================== RUTAS PARA ROLES ====================
rolesRouter.get("/rol", rolesController.getRoles)
rolesRouter.get("/rol/:rol_cod", rolesController.getRolesById)
rolesRouter.post("/rol/create", rolesController.createRole)
rolesRouter.put("/rol/update/:rol_cod", rolesController.updateRole)
rolesRouter.delete("/rol/delete/:rol_cod", rolesController.deleteRole)
rolesRouter.get("/auth/roles", rolesController.List)

// ==================== RUTAS PARA USUARIOS ====================
usuariosRouter.get("/usuario", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), usuariosController.getUsuarios)
usuariosRouter.get(
  "/usuario/:us_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  usuariosController.getUsuariosById,
)
usuariosRouter.post(
  "/usuarios",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  usuariosController.createUsuario,
)
usuariosRouter.put(
  "/usuarios/:us_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  usuariosController.updateUsuario,
)
usuariosRouter.delete(
  "/usuarios/:us_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  usuariosController.deleteUsuario,
)
usuariosRouter.post("/login", usuariosController.login)
usuariosRouter.get("/usuarios/list", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), usuariosController.usList)

// ==================== RUTAS DE AUTENTICACIÓN ====================
authRouter.get("/auth/getLogger", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), authController.logger)

// ==================== RUTAS PARA CATEGORÍAS DE PRODUCTOS ====================
catprodRouter.get("/catprod", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), catprodController.getCatProd)
catprodRouter.get(
  "/catprod/:catprod_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  catprodController.getCatProdbyId,
)
catprodRouter.post("/catprod", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), catprodController.createCatProd)
catprodRouter.put(
  "/catprod/:catprod_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  catprodController.updateCatProd,
)
catprodRouter.delete(
  "/catprod/:catprod_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  catprodController.deleteCatProd,
)
catprodRouter.get("/catprods/list", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), catprodController.List)

// ==================== RUTAS PARA PRODUCTOS ====================

// 🔹 --- RUTA PÚBLICA NUEVA --- 🔹
// Esta la usará PantallaProductos.jsx
productosRouter.get(
  "/prods/public/list",
  productosController.List // Sin authJwt
)

// --- RUTAS DE ADMIN (Existentes) ---
productosRouter.get("/prod", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), productosController.getProducto)
productosRouter.get(
  "/prod/:prod_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  productosController.getProductoById,
)
productosRouter.post("/prod", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), productosController.createProd)
productosRouter.put(
  "/prod/:prod_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  productosController.updateProd,
)
productosRouter.delete(
  "/prod/:prod_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  productosController.deleteProd,
)
productosRouter.get("/prods/list", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), productosController.List)

// ==================== RUTAS PARA CATEGORÍAS DE SABORES ====================
catsabRouter.get("/catsab", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), catsabController.getCatSab)
catsabRouter.get(
  "/catsab/:catsab_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  catsabController.getCatSabById,
)
catsabRouter.post("/catsab", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), catsabController.createCatSab)
catsabRouter.put(
  "/catsab/:catsab_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  catsabController.updateCatSab,
)
catsabRouter.delete(
  "/catsab/:catsab_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  catsabController.deleteCatSab,
)
catsabRouter.get("/catsabs/list", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), catsabController.List)

// ==================== RUTAS PARA SABORES DE HELADOS ====================

// --- RUTA PÚBLICA (NUEVA) ---
// Usada por PantallaSabores.jsx (SaboresMenu)
sabheladosRouter.get(
  "/sabs/public/list",
  sabheladosController.List // Sin authJwt
)

// --- RUTAS DE ADMIN (Existentes) ---
sabheladosRouter.get("/sab", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.getSabor)
sabheladosRouter.get(
  "/sab/:sab_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sabheladosController.getSaborById,
)
sabheladosRouter.post("/sab", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.createSab)
sabheladosRouter.put(
  "/sab/:sab_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sabheladosController.updateSab,
)
sabheladosRouter.delete(
  "/sab/:sab_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sabheladosController.deleteSab,
)
sabheladosRouter.get("/sabs/list", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.List)

// ==================== RUTAS PARA TIPO DE DESCUENTO ====================
tdRouter.get("/td", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), tdController.getTD)
tdRouter.get("/td/:td_cod", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), tdController.getTDbyId)
tdRouter.post("/td", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), tdController.createTD)
tdRouter.put("/td/:td_cod", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), tdController.updateTD)
tdRouter.delete("/td/:td_cod", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), tdController.deleteTD)

// ==================== RUTAS PARA SUCURSALES ====================
sucursalesRouter.get(
  "/sucursal",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sucursalesController.getSucursal,
)
sucursalesRouter.get(
  "/sucursales",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sucursalesController.getAllSucursales,
)
sucursalesRouter.get(
  "/sucursal/:suc_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sucursalesController.getSucursalById,
)
sucursalesRouter.post(
  "/sucursal",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sucursalesController.createSucursal,
)
sucursalesRouter.put(
  "/sucursal/:suc_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sucursalesController.updateSucursal,
)
sucursalesRouter.delete(
  "/sucursal/:suc_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sucursalesController.deleteSucursal,
)
sucursalesRouter.get(
  "/sucursales/list",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  sucursalesController.List,
)

// ==================== RUTAS PARA PLANTILLAS ====================
plantillaRouter.get(
  "/plantillas/list",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  plantillaController.listPlantillas,
)

plantillaRouter.get(
  "/plantillas",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  plantillaController.getPlantillas,
)

plantillaRouter.post(
  "/plantillas",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  upload.single("imagen"), // Middleware de multer para procesar el archivo
  plantillaController.createPlantilla,
)

plantillaRouter.get(
  "/plantillas/:plan_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  plantillaController.getPlantillaById,
)

plantillaRouter.put(
  "/plantillas/:plan_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  upload.single("imagen"), // Middleware de multer para procesar el archivo
  plantillaController.updatePlantilla,
)

plantillaRouter.delete(
  "/plantillas/:plan_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  plantillaController.deletePlantilla,
)

// ==================== RUTAS PARA PANTALLAS ====================

// --- RUTA PÚBLICA (NUEVA) ---
// Usada por PantallaViewer.jsx
pantallaRouter.get(
  "/pantallas/public/:pan_cod",
  pantallaController.getPantallaById // Sin authJwt
)

// --- RUTAS DE ADMIN (Existentes) ---
pantallaRouter.get(
  "/pantallas/activas",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  pantallaController.getPantallasActivas,
)

pantallaRouter.get(
  "/pantallas/list",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  pantallaController.listPantallas,
)

pantallaRouter.get("/pantallas", authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"), pantallaController.getPantallas)

pantallaRouter.post(
  "/pantallas",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  pantallaController.createPantalla,
)

pantallaRouter.get(
  "/pantallas/:pan_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  pantallaController.getPantallaById,
)

pantallaRouter.put(
  "/pantallas/:pan_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  pantallaController.updatePantalla,
)

pantallaRouter.delete(
  "/pantallas/:pan_cod",
  authJwt.verifyToken,
  authJwt.permit("ADMIN", "DUEÑO"),
  pantallaController.deletePantalla,
)
// ==================== RUTAS PARA PROMOCIONES ====================
// --- Ruta Pública ---
promocionesRouter.get(
  "/promos/public/list",
  promocionesController.ListPublica
)
// --- 🔹 Rutas de Admin (NUEVAS) 🔹 ---
promocionesRouter.get(
  "/promociones/list",
  authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"),
  promocionesController.List
)
promocionesRouter.get(
  "/promociones/:id",
  authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"),
  promocionesController.getPromoById
)
promocionesRouter.post(
  "/promociones",
  authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"),
  promocionesController.createPromo
)
promocionesRouter.put(
  "/promociones/:id",
  authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"),
  promocionesController.updatePromo
)
promocionesRouter.delete(
  "/promociones/:id",
  authJwt.verifyToken, authJwt.permit("ADMIN", "DUEÑO"),
  promocionesController.deletePromo
)

// ====================
// POS – VENTA ACTUAL
// ====================

// Ver si hay venta abierta
ventasRouter.get(
  '/ventas/abierta/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.getVentaAbiertaPorSucursal(
        req.params.suc_cod
      )
      res.json(venta) // puede ser null
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

/// Crear nueva venta
ventasRouter.post(
  '/ventas/nueva',  
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.crearVenta(req.body)
      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)
// ====================
// ITEMS
// ====================

ventasRouter.post(
  '/ventas/:venta_id/items',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.agregarProducto({
        venta_id: req.params.venta_id,
        ...req.body,
      })
      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// ====================
// MODIFICAR RUTA DE CIERRE
// ====================

// Cerrar venta (MODIFICADO)
ventasRouter.post(
  '/ventas/cerrar/:venta_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.cerrarVenta(
        req.params.venta_id,
        req.body.pagos // 🔹 Ahora recibe array de pagos
      )
      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// ====================
// HISTÓRICO
// ====================

// Obtener todas las ventas de una sucursal
ventasRouter.get(
  '/ventas/sucursal/:suc_cod',  // ✅ Agregado prefijo /ventas
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const ventas = await VentasController.getVentasPorSucursal(
        req.params.suc_cod
      )
      res.json(ventas)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)
// Obtener venta por ID (para detalle)
ventasRouter.get(
  '/ventas/:venta_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.getVentaById(req.params.venta_id)
      if (!venta) {
        return res.status(404).json({ error: 'Venta no encontrada' })
      }
      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)
// =========================
// DESCUENTOS DE VENTA
// =========================

// Aplicar descuento (FIJO o PORCENTAJE)
descuentoventasRouter.post(
  '/descuentoventas/:venta_id/descuento',  // ✅ Agregado prefijo
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await DescuentoVentasController.aplicarDescuento({
        venta_id: req.params.venta_id,
        ...req.body,
      })

      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Quitar descuento
descuentoventasRouter.delete(
  '/descuentoventas/:venta_id/descuento',  // ✅ Agregado prefijo
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await DescuentoVentasController.quitarDescuento(
        req.params.venta_id
      )

      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)
// Agregar producto (ya existe)
ventasRouter.post(
  '/ventas/:venta_id/items',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.agregarProducto({
        venta_id: req.params.venta_id,
        ...req.body,
      })
      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// 🔹 NUEVO: Eliminar item
ventasRouter.delete(
  '/ventas/items/:venta_items_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.eliminarItem(
        req.params.venta_items_id
      )
      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// 🔹 NUEVO: Modificar cantidad de item
ventasRouter.put(
  '/ventas/items/:venta_items_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.modificarCantidadItem({
        venta_items_id: req.params.venta_items_id,
        cantidad: req.body.cantidad,
      })
      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// ====================
// CANCELAR VENTA
// ====================

// 🔹 NUEVO: Cancelar venta
ventasRouter.post(
  '/ventas/cancelar/:venta_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const venta = await VentasController.cancelarVenta(req.params.venta_id)
      res.json(venta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)


// ====================
// MÉTODOS DE PAGO
// ====================

// Listar métodos activos (para POS)
metodospagoRouter.get(
  '/metodospago/activos',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const metodos = await MetodosPagoController.getMetodosActivos()
      res.json(metodos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Listar todos (ADMIN)
metodospagoRouter.get(
  '/metodospago',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const metodos = await MetodosPagoController.getAll()
      res.json(metodos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Obtener por ID
metodospagoRouter.get(
  '/metodospago/:mp_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const metodo = await MetodosPagoController.getById(req.params.mp_cod)
      res.json(metodo)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }
)

// Crear método
metodospagoRouter.post(
  '/metodospago',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const metodo = await MetodosPagoController.create(req.body)
      res.json(metodo)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Actualizar método
metodospagoRouter.put(
  '/metodospago/:mp_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const metodo = await MetodosPagoController.update(
        req.params.mp_cod,
        req.body
      )
      res.json(metodo)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Eliminar (desactivar) método
metodospagoRouter.delete(
  '/metodospago/:mp_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const result = await MetodosPagoController.delete(req.params.mp_cod)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)


// ====================
// CAJAS / TURNOS
// ====================

// Obtener caja abierta por sucursal
cajasRouter.get(
  '/cajas/abierta/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const caja = await CajasController.getCajaAbiertaPorSucursal(
        req.params.suc_cod
      )
      res.json(caja) // puede ser null
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Abrir caja
cajasRouter.post(
  '/cajas/abrir',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const caja = await CajasController.abrirCaja(req.body)
      res.json(caja)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Obtener resumen de caja abierta
cajasRouter.get(
  '/cajas/:caja_id/resumen',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const resumen = await CajasController.getResumenCajaAbierta(
        req.params.caja_id
      )
      res.json(resumen)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Cerrar caja (arqueo)
cajasRouter.post(
  '/cajas/cerrar/:caja_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const caja = await CajasController.cerrarCaja({
        caja_id: req.params.caja_id,
        ...req.body
      })
      res.json(caja)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Historial de cajas por sucursal
cajasRouter.get(
  '/cajas/sucursal/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const { page, size } = req.query
      const cajas = await CajasController.getCajasPorSucursal(
        req.params.suc_cod,
        { page: parseInt(page) || 0, size: parseInt(size) || 20 }
      )
      res.json(cajas)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Obtener caja por ID
cajasRouter.get(
  '/cajas/:caja_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const caja = await CajasController.getCajaById(req.params.caja_id)
      res.json(caja)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }
)

// Eliminar caja (solo si no tiene ventas)
cajasRouter.delete(
  '/cajas/:caja_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const result = await CajasController.eliminarCaja(req.params.caja_id)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Resumen del día
estadisticasRouter.get(
  '/estadisticas/resumen-hoy/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const resumen = await EstadisticasController.getResumenHoy(req.params.suc_cod)
      res.json(resumen)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Ventas por hora (hoy)
estadisticasRouter.get(
  '/estadisticas/ventas-por-hora/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const datos = await EstadisticasController.getVentasPorHora(req.params.suc_cod)
      res.json(datos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Productos más vendidos
estadisticasRouter.get(
  '/estadisticas/productos-top/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const limit = req.query.limit || 10
      const datos = await EstadisticasController.getProductosMasVendidos(
        req.params.suc_cod,
        Number(limit)
      )
      res.json(datos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Métodos de pago
estadisticasRouter.get(
  '/estadisticas/metodos-pago/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const datos = await EstadisticasController.getMetodosPagoStats(req.params.suc_cod)
      res.json(datos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Ventas semanales
estadisticasRouter.get(
  '/estadisticas/ventas-semanales/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const datos = await EstadisticasController.getVentasSemanales(req.params.suc_cod)
      res.json(datos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Estadísticas de cajeros
estadisticasRouter.get(
  '/estadisticas/cajeros/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const datos = await EstadisticasController.getEstadisticasCajeros(req.params.suc_cod)
      res.json(datos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Comparativa mensual
estadisticasRouter.get(
  '/estadisticas/comparativa-mensual/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const datos = await EstadisticasController.getComparativaMensual(req.params.suc_cod)
      res.json(datos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)
// Listar insumos de una sucursal
insumosRouter.get(
  '/insumos/sucursal/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const incluirInactivos = req.query.incluirInactivos === 'true'
      const insumos = await InsumosController.getInsumos(
        req.params.suc_cod,
        { incluirInactivos }
      )
      res.json(insumos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Obtener insumo por ID
insumosRouter.get(
  '/insumos/:insumo_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const insumo = await InsumosController.getInsumoById(req.params.insumo_id)
      res.json(insumo)
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  }
)

// Crear insumo
insumosRouter.post(
  '/insumos',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const insumo = await InsumosController.createInsumo(
        req.body,
        req.user.cod
      )
      res.json(insumo)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Actualizar insumo
insumosRouter.put(
  '/insumos/:insumo_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const insumo = await InsumosController.updateInsumo(
        req.params.insumo_id,
        req.body
      )
      res.json(insumo)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Ajustar stock manualmente
insumosRouter.post(
  '/insumos/:insumo_id/ajustar-stock',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const { cantidad_nueva, observaciones } = req.body
      
      if (cantidad_nueva === undefined || cantidad_nueva === null) {
        return res.status(400).json({ error: 'Debe especificar cantidad_nueva' })
      }

      const insumo = await InsumosController.ajustarStock(
        req.params.insumo_id,
        cantidad_nueva,
        req.user.cod,
        observaciones
      )
      res.json(insumo)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Obtener insumos críticos
insumosRouter.get(
  '/insumos/criticos/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const criticos = await InsumosController.getInsumosCriticos(req.params.suc_cod)
      res.json(criticos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Obtener historial de movimientos de un insumo
insumosRouter.get(
  '/insumos/:insumo_id/historial',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50
      const historial = await InsumosController.getHistorialStock(
        req.params.insumo_id,
        { limit }
      )
      res.json(historial)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Eliminar (desactivar) insumo
insumosRouter.delete(
  '/insumos/:insumo_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const result = await InsumosController.deleteInsumo(req.params.insumo_id)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Obtener receta de un producto
recetasRouter.get(
  '/recetas/producto/:prod_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const receta = await RecetasController.getRecetaProducto(req.params.prod_cod)
      res.json(receta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Asignar/Actualizar receta completa de un producto
recetasRouter.post(
  '/recetas/producto/:prod_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const { insumos } = req.body
      
      if (!insumos || !Array.isArray(insumos)) {
        return res.status(400).json({ 
          error: 'Debe enviar un array de insumos: [{ insumo_id, cantidad_requerida }]' 
        })
      }

      const receta = await RecetasController.asignarReceta(
        req.params.prod_cod,
        insumos
      )
      res.json(receta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Agregar un insumo a la receta
recetasRouter.post(
  '/recetas/agregar',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const { prod_cod, insumo_id, cantidad_requerida } = req.body
      
      if (!prod_cod || !insumo_id || !cantidad_requerida) {
        return res.status(400).json({ 
          error: 'Debe especificar prod_cod, insumo_id y cantidad_requerida' 
        })
      }

      const receta = await RecetasController.agregarInsumoAReceta(
        prod_cod,
        insumo_id,
        cantidad_requerida
      )
      res.json(receta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Modificar cantidad de un insumo en la receta
recetasRouter.put(
  '/recetas/:producto_insumo_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const { cantidad_requerida } = req.body
      
      if (!cantidad_requerida) {
        return res.status(400).json({ error: 'Debe especificar cantidad_requerida' })
      }

      const receta = await RecetasController.modificarCantidadInsumo(
        req.params.producto_insumo_id,
        cantidad_requerida
      )
      res.json(receta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Eliminar un insumo de la receta
recetasRouter.delete(
  '/recetas/:producto_insumo_id',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const receta = await RecetasController.eliminarInsumoDeReceta(
        req.params.producto_insumo_id
      )
      res.json(receta)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Listar todos los productos con sus recetas
recetasRouter.get(
  '/recetas/productos/sucursal/:suc_cod',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO'),
  async (req, res) => {
    try {
      const productos = await RecetasController.getProductosConRecetas(
        req.params.suc_cod
      )
      res.json(productos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)

// Verificar disponibilidad de stock para un producto
recetasRouter.post(
  '/recetas/verificar-disponibilidad',
  authJwt.verifyToken,
  authJwt.permit('ADMIN', 'DUEÑO', 'ENCARGADO'),
  async (req, res) => {
    try {
      const { prod_cod, cantidad } = req.body
      
      if (!prod_cod) {
        return res.status(400).json({ error: 'Debe especificar prod_cod' })
      }

      const disponibilidad = await RecetasController.verificarDisponibilidad(
        prod_cod,
        cantidad || 1
      )
      res.json(disponibilidad)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
)
export {
  rolesRouter,
  catprodRouter,
  catsabRouter,
  usuariosRouter,
  tdRouter,
  sucursalesRouter,
  sabheladosRouter,
  productosRouter,
  plantillaRouter,
  pantallaRouter,
  authRouter,
  promocionesRouter,
  ventasRouter,
  descuentoventasRouter,
  metodospagoRouter,
  cajasRouter,
  estadisticasRouter,
  insumosRouter,
  recetasRouter
}