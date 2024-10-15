import express from 'express'

import rolesController from '../controllers/rolesController.js'
import catprodController from '../controllers/catprodController.js'
import catsabController from '../controllers/catsabcontroller.js'
import usuariosController from '../controllers/usuariosController.js'
import tdController from '../controllers/tdController.js'
import sucursalesController from '../controllers/sucursalesController.js'
import authJwt from '../middleware/authjwt.js'


const router = express.Router()

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


// llamar a los controladores

// Rutas para controlador Roles
router.get('/roles', rolesController.getRoles)
router.get('/roles/:rol_cod', rolesController.getRolesById)
router.post('/create/roles', rolesController.createRole)
router.put('/roles/:rol_cod', rolesController.updateRole)
router.delete('/roles/:rol_cod', rolesController.deleteRole)

// Rutas para controller Usuarios
router.get('/usuarios', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO") , usuariosController.getUsuarios)
router.get('/usuarios/:us_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO") , usuariosController.getUsuariosById)
router.post('/usuarios', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), usuariosController.createUsuario)
router.put('/usuarios/:us_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), usuariosController.updateUsuario)
router.delete('/usuarios/:us_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), usuariosController.deleteUsuario)
router.post("/login", usuariosController.login)


// Rutas para controller CatProd
router.get('/catprod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.getCatProd)
router.get('/catprod/:id', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.getCatProdbyId)
router.post('/catprod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.createCatProd)
router.put('/catprod/:id', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.updateCatProd)
router.delete('/catprod/:id', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.deleteCatProd)

// Rutas para controller CatSab
router.get('/catsab', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.getCatSab)
router.get('/catsab/:id', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.getCatSabById)
router.post('/catsab', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.createCatSab)
router.put('/catsab:id', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.updateCatSab)
router.delete('/catsab/:id', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.deleteCatSab)

// Rutas para Controller Tipo de Descuento
router.get('/td', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.getTD)
router.get('/td/:td_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.getTDbyId)
router.post('/td', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.createTD)
router.put('/td/:td_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.updateTD)
router.delete('/td/:td_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.deleteTD)

// Rutas para Controller Sucursales
router.get('/sucursal', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.getSucursal)
router.get('/sucursal/:suc_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.getSucursalById)
router.post('/sucursal', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.createSucursal)
router.put('/sucursal/:suc_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.updateSucursal)
router.delete('/sucursal/:suc_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.deleteSucursal)

// Exportar las rutas de forma individual
export { router as rolesRouter }
export { router as catprodRouter }
export { router as catsabRouter }
export { router as tdController }
export { router as sucursalesController }
export { router as usuariosController }
