// Trabajar las asociaciones de todas las tablas
// Importar todos los modelos

import Usuarios from './usuarios.js'
import Sucursales from './sucursales.js'
import Roles from './roles.js'
import SaboresHelados from './saboreshelados.js'
import CategoriaSab from './categoria_sab.js'
import CategoriaProd from './categoria_prod.js'
import Productos from './productos.js'
import Promociones from './promociones.js'
import Plantilla from './plantilla.js'
import Pantalla from './pantalla.js'
import Proveedores from './proveedores.js'
import LastModified from './lastmodified.js'
import UsuariosSucursales from './usuariosSucursales.js'
import ProvProducts from './ProvProducts.js'
import ProductsProm from './ProductsProm.js'
import SucProms from './SucProms.js'
import CatSabPan from './CatSabPan.js'
import CatProdPan from './CatProdPan.js'
import Ventas from './ventas.js'
import VentasItems from './ventas_items.js'
import DescuentoVentas from './descuentoventas.js'
import VentaPagos from './ventapagos.js'
import MetodosPago from './metodospago.js'
// Definir las asociaciones entre los modelos 


// Relacion entre Usuario y Roles
Roles.hasOne(Usuarios, { foreignKey: 'roles_rol_cod', as: "roles" })
Usuarios.belongsTo(Roles, { foreignKey: 'roles_rol_cod', as: "roles" })

Usuarios.belongsToMany(Sucursales, { through: UsuariosSucursales})
Sucursales.belongsToMany(Usuarios, { through: UsuariosSucursales})

Usuarios.hasMany(LastModified,{foreignKey:'us_cod'})
LastModified.belongsTo(Usuarios,{foreignKey:'us_cod'})

CategoriaSab.hasMany(SaboresHelados, { foreignKey: 'catsab_cod'})
SaboresHelados.belongsTo(CategoriaSab, { foreignKey: 'catsab_cod'})

CategoriaProd.hasMany(Productos, {foreignKey:'catprod_cod'})
Productos.belongsTo(CategoriaProd, {foreignKey:'catprod_cod'})


Plantilla.hasMany(Pantalla,{foreignKey:'plan_cod'})
Pantalla.belongsTo(Plantilla,{foreignKey:'plan_cod'})


//Relacion muchos a mucho entre proveedores y productos
Proveedores.belongsToMany(Productos, {
  through: ProvProducts,
  uniqueKey: 'unique_prov_product', // Nombre personalizado más corto
});
Productos.belongsToMany(Proveedores, {
  through: ProvProducts,
  uniqueKey: 'unique_prov_product', // Nombre personalizado más corto
});

//Relacion muchos a mucho entre Productos y Promociones
Promociones.belongsToMany(Productos, {through: ProductsProm,
  uniqueKey: 'unique_prom_product'})
Productos.belongsToMany(Promociones, {through: ProductsProm,
  uniqueKey: 'unique_prom_product',})


//Relacion muchos a mucho entre Sucursales y Promociones
Promociones.belongsToMany(Sucursales, {through: SucProms,
  uniqueKey: 'unique_suc_prom'})
Sucursales.belongsToMany(Promociones, {through: SucProms,
  uniqueKey: 'unique_suc_prom'})

//Relacion muchos a mucho entre Categorias Sabores y Pantallas
CategoriaSab.belongsToMany(Pantalla, {through: CatSabPan,
  uniqueKey: 'unique_catsab_pan'})
Pantalla.belongsToMany(CategoriaSab, {through: CatSabPan,
  uniqueKey: 'unique_catsab_pan'})

  //Relacion muchos a mucho entre Categorias Productos y Pantallas
CategoriaProd.belongsToMany(Pantalla, {through: CatProdPan,
  uniqueKey: 'unique_catprod_pan'})
Pantalla.belongsToMany(CategoriaProd, {through: CatProdPan,
  uniqueKey: 'unique_catprod_pan'})

// ===============================
// VENTAS
// ===============================
Ventas.hasMany(VentasItems, {
  foreignKey: 'venta_id',
  as: 'Items'
})
VentasItems.belongsTo(Ventas, {
  foreignKey: 'venta_id',
  as: 'Venta'
})

Productos.hasMany(VentasItems, { foreignKey: 'prod_cod' })
VentasItems.belongsTo(Productos, { foreignKey: 'prod_cod' })


// 🔹 Venta -> DescuentoVentas 
Ventas.hasMany(DescuentoVentas, {
  foreignKey: 'venta_id',
  as: 'Descuentos'
})

DescuentoVentas.belongsTo(Ventas, {
  foreignKey: 'venta_id',
  as: 'Venta'
})


// ===============================
// MÉTODOS DE PAGO
// ===============================

// MetodosPago → VentaPagos (1:N)
MetodosPago.hasMany(VentaPagos, {
  foreignKey: 'mp_cod',
  as: 'Pagos'
})
VentaPagos.belongsTo(MetodosPago, {
  foreignKey: 'mp_cod',
  as: 'MetodoPago'
})

// Venta → VentaPagos (1:N)
Ventas.hasMany(VentaPagos, {
  foreignKey: 'venta_id',
  as: 'Pagos'
})
VentaPagos.belongsTo(Ventas, {
  foreignKey: 'venta_id',
  as: 'Venta'
})