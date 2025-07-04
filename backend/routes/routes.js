import express from 'express'

import rolesController from '../controllers/rolesController.js'
import catprodController from '../controllers/catprodController.js'
import catsabController from  '../controllers/catsabController.js'
import usuariosController from '../controllers/usuariosController.js'
import tdController from '../controllers/tdController.js'
import sucursalesController from '../controllers/sucursalesController.js'
import sabheladosController from '../controllers/sabheladosController.js'
import productosController from '../controllers/productosController.js'
import plantillaController from '../controllers/plantillaController.js'
import pantallaController from '../controllers/pantallaController.js'
import authController from '../controllers/authController.js'

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
router.get('/rol', rolesController.getRoles)
router.get('/rol/:rol_cod', rolesController.getRolesById)
router.post('/rol/create', rolesController.createRole)
router.put('/rol/update/:rol_cod', rolesController.updateRole)
router.delete('/rol/delete/:rol_cod', rolesController.deleteRole)
router.get('/auth/roles', rolesController.List)

// Rutas para controller Usuarios
router.get('/usuario', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO") , usuariosController.getUsuarios)
router.get('/usuario/:us_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO") , usuariosController.getUsuariosById)
router.post('/usuarios', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), usuariosController.createUsuario)
router.put('/usuarios/:us_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), usuariosController.updateUsuario)
router.delete('/usuarios/:us_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), usuariosController.deleteUsuario)
router.post("/login", usuariosController.login)
router.get('/usuarios/list', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO") , usuariosController.usList)
router.get('/auth/getLogger', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), authController.logger)




// Rutas para controller CatProd
router.get('/catprod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.getCatProd)
router.get('/catprod/:catprod_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.getCatProdbyId)
router.post('/catprod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.createCatProd)
router.put('/catprod/:catprod_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.updateCatProd)
router.delete('/catprod/:catprod_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), catprodController.deleteCatProd)
router.get('/catprods/list', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catprodController.List)

// Rutas para controller Productos
router.get('/prod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), productosController.getProducto)
router.get('/prod/:prod_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), productosController.getProductoById)
router.post('/prod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), productosController.createProd)
router.put('/prod/:prod_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), productosController.updateProd)
router.delete('/prod/:prod_cod', authJwt.verifyToken , authJwt.permit("ADMIN", "DUEÑO"), productosController.deleteProd)
router.get('/prods/list', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), productosController.List)

// Rutas para controller CatSab
router.get('/catsab', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.getCatSab)
router.get('/catsab/:catsab_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.getCatSabById)
router.post('/catsab', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.createCatSab)
router.put('/catsab/:catsab_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.updateCatSab)
router.delete('/catsab/:catsab_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.deleteCatSab)
router.get('/catsabs/list', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), catsabController.List)

// Rutas para controller Sabores Helados
router.get('/sab', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.getSabor)
router.get('/sab/:sab_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.getSaborById)
router.post('/sab', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.createSab)
router.put('/sab/:sab_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.updateSab)
router.delete('/sab/:sab_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.deleteSab)
router.get('/sabs/list', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sabheladosController.List)



// Rutas para Controller Tipo de Descuento
router.get('/td', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.getTD)
router.get('/td/:td_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.getTDbyId)
router.post('/td', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.createTD)
router.put('/td/:td_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.updateTD)
router.delete('/td/:td_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), tdController.deleteTD)

// Rutas para Controller Sucursales
router.get('/sucursal', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.getSucursal)
router.get('/sucursales', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.getAllSucursales)
router.get('/sucursal/:suc_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.getSucursalById)
router.post('/sucursal', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.createSucursal)
router.put('/sucursal/:suc_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.updateSucursal)
router.delete('/sucursal/:suc_cod', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.deleteSucursal)
router.get('/sucursales/list', authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), sucursalesController.List)

// Rutas para plantillas
router.get('/plantillas',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"),plantillaController.getPlantillas);
router.get('/plantillas/:plan_cod',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), plantillaController.getPlantillaById);
router.post('/plantillas',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), plantillaController.createPlantilla);
router.put('/plantillas/:plan_cod',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), plantillaController.updatePlantilla);
router.delete('/plantillas/:plan_cod',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), plantillaController.deletePlantilla);
router.get('/plantillas/list',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), plantillaController.listPlantillas);

// Rutas para pantallas
router.get('/pantallas',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), pantallaController.getPantallas);
router.get('/pantallas/:pan_cod',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), pantallaController.getPantallaById);
router.post('/pantallas',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), pantallaController.createPantalla);
router.put('/pantallas/:pan_cod',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), pantallaController.updatePantalla);
router.delete('/pantallas/:pan_cod',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), pantallaController.deletePantalla);
router.get('/pantallas/list',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), pantallaController.listPantallas);
router.get('/pantallas/activas',authJwt.verifyToken ,authJwt.permit("ADMIN", "DUEÑO"), pantallaController.getPantallasActivas);



// Exportar las rutas de forma individual
export { router as rolesRouter }
export { router as catprodRouter }
export { router as catsabRouter }
export { router as tdController }
export { router as sucursalesController }
export { router as usuariosController }

export { router as sabheladosController }

export {router as productosController}

export {router as plantillaController}
export {router as authController}
export {router as pantallaController}