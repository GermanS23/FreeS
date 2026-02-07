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
import Cajas from './cajas.js'
import Insumos from './insumos.js'
import ProductoInsumos from './productoinsumos.js'
import HistorialStock from './historialstock.js'
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


// ===============================
// CAJAS
// ===============================

// Caja → Usuario (cajero)
Usuarios.hasMany(Cajas, {
  foreignKey: 'us_cod',
  as: 'Cajas'
})
Cajas.belongsTo(Usuarios, {
  foreignKey: 'us_cod',
  as: 'Usuario'
})

// Caja → Sucursal
Sucursales.hasMany(Cajas, {
  foreignKey: 'suc_cod',
  as: 'Cajas'
})
Cajas.belongsTo(Sucursales, {
  foreignKey: 'suc_cod',
  as: 'Sucursal'
})

// Venta → Caja (vincular ventas a la caja del turno)
Cajas.hasMany(Ventas, {
  foreignKey: 'caja_id',
  as: 'Ventas'
})
Ventas.belongsTo(Cajas, {
  foreignKey: 'caja_id',
  as: 'Caja'
})

// ===============================
// STOCK E INSUMOS
// ===============================

// Sucursal → Insumos (1:N)
Sucursales.hasMany(Insumos, {
  foreignKey: 'suc_cod',
  as: 'Insumos'
})
Insumos.belongsTo(Sucursales, {
  foreignKey: 'suc_cod',
  as: 'Sucursal'
})

// Producto ↔ Insumos (N:M a través de ProductoInsumos / Recetas)
Productos.belongsToMany(Insumos, {
  through: ProductoInsumos,
  foreignKey: 'prod_cod',
  otherKey: 'insumo_id',
  as: 'Insumos'
})

Insumos.belongsToMany(Productos, {
  through: ProductoInsumos,
  foreignKey: 'insumo_id',
  otherKey: 'prod_cod',
  as: 'Productos'
})

// Acceso directo a ProductoInsumos desde Producto
Productos.hasMany(ProductoInsumos, {
  foreignKey: 'prod_cod',
  as: 'Receta'
})
ProductoInsumos.belongsTo(Productos, {
  foreignKey: 'prod_cod',
  as: 'Producto'
})

// Acceso directo a ProductoInsumos desde Insumo
Insumos.hasMany(ProductoInsumos, {
  foreignKey: 'insumo_id',
  as: 'Recetas'
})
ProductoInsumos.belongsTo(Insumos, {
  foreignKey: 'insumo_id',
  as: 'Insumo'
})

// Historial de Stock → Insumo (N:1)
Insumos.hasMany(HistorialStock, {
  foreignKey: 'insumo_id',
  as: 'Historial'
})
HistorialStock.belongsTo(Insumos, {
  foreignKey: 'insumo_id',
  as: 'Insumo'
})

// Historial de Stock → Usuario (N:1)
Usuarios.hasMany(HistorialStock, {
  foreignKey: 'us_cod',
  as: 'MovimientosStock'
})
HistorialStock.belongsTo(Usuarios, {
  foreignKey: 'us_cod',
  as: 'Usuario'
})

// Historial de Stock → Venta (N:1) - opcional
Ventas.hasMany(HistorialStock, {
  foreignKey: 'venta_id',
  as: 'MovimientosStock'
})
HistorialStock.belongsTo(Ventas, {
  foreignKey: 'venta_id',
  as: 'Venta'
})