import express from 'express'
import rolesController from '../controllers/rolesController.js'
import catprodController from '../controllers/catprodController.js'
import catsabController from '../controllers/catsabcontroller.js'
import usuariosController from '../controllers/usuariosController.js'
import tdController from '../controllers/tdController.js'
import sucursalesController from '../controllers/sucursalesController.js'
const router = express.Router()

// llamar a los controladores

// Rutas para controlador Roles
router.get('/roles', rolesController.getRoles)
router.get('/roles/:rol_cod', rolesController.getRolesById)
router.post('/roles', rolesController.createRole)
router.put('/roles/:rol_cod', rolesController.updateRole)
router.delete('/roles/:rol_cod', rolesController.deleteRole)

// Rutas para controller Usuarios
router.get('/usuarios', usuariosController.getUsuarios)
router.get('/usuarios/:us_cod', usuariosController.getUsuariosById)
router.post('/usuarios', usuariosController.createUsuario)
router.put('/usuarios/:us_cod', usuariosController.updateUsuario)
router.delete('/usuarios/:us_cod', usuariosController.deleteUsuario)

// Rutas para controller CatProd
router.get('/catprod', catprodController.getCatProd)
router.get('/catprod/:id', catprodController.getCatProdbyId)
router.post('/catprod', catprodController.createCatProd)
router.put('/catprod/:id', catprodController.updateCatProd)
router.delete('/catprod/:id', catprodController.deleteCatProd)

// Rutas para controller CatSab
router.get('/catsab', catsabController.getCatSab)
router.get('/catsab/:id', catsabController.getCatSabById)
router.post('/catsab', catsabController.createCatSab)
router.put('/catsab:id', catsabController.updateCatSab)
router.delete('/catsab/:id', catsabController.deleteCatSab)

// Rutas para Controller Tipo de Descuento
router.get('/td', tdController.getTD)
router.get('/td/:td_cod', tdController.getTDbyId)
router.post('/td', tdController.createTD)
router.put('/td/:td_cod', tdController.updateTD)
router.delete('/td/:td_cod', tdController.deleteTD)

// Rutas para Controller Sucursales
router.get('/sucursal', sucursalesController.getSucursal)
router.get('/sucursal/:suc_cod', sucursalesController.getSucursalById)
router.post('/sucursal', sucursalesController.createSucursal)
router.put('/sucursal/:suc_cod', sucursalesController.updateSucursal)
router.delete('/sucursal/:suc_cod', sucursalesController.deleteSucursal)

// Exportar las rutas de forma individual
export { router as rolesRouter }
export { router as catprodRouter }
export { router as catsabRouter }
export { router as tdController }
export { router as sucursalesController }
export { router as usuariosController }
