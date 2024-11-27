// Trabajar las asociaciones de todas las tablas
// Importar todos los modelos

import Usuarios from './usuarios.js'
import Sucursales from './sucursales.js'
import Roles from './roles.js'
import SaboresHelados from './saboreshelados.js'
import CategoriaSab from './categoria_sab.js'
import CategoriaProd from './categoria_prod.js'
import Productos from './productos.js'
import TipoDescuento from './tipodescuento.js'
import Promociones from './promociones.js'
import Plantilla from './plantilla.js'
import Pantalla from './pantalla.js'
import Proveedores from './proveedores.js'
import LastModified from './lastmodified.js'
import UsuariosSucursales from './UsuariosSucursales.js'
import ProvProducts from './ProvProducts.js'
import ProductsProm from './ProductsProm.js'
import SucProms from './SucProms.js'



// Relacion entre Usuario y Roles
Roles.hasOne(Usuarios, { foreignKey: 'roles_rol_cod' })
Usuarios.belongsTo(Roles, { foreignKey: 'roles_rol_cod' })

Usuarios.belongsToMany(Sucursales, { through: UsuariosSucursales})
Sucursales.belongsToMany(Usuarios, { through: UsuariosSucursales})

Usuarios.hasMany(LastModified,{foreignKey:'us_cod'})
LastModified.belongsTo(Usuarios,{foreignKey:'us_cod'})

CategoriaSab.hasMany(SaboresHelados, { foreignKey: 'catsab_cod'})
SaboresHelados.belongsTo(CategoriaSab, { foreignKey: 'catsab_cod'})

CategoriaProd.hasMany(Productos, {foreignKey:'catprod_cod'})
Productos.belongsTo(CategoriaProd, {foreignKey:'catprod_cod'})

TipoDescuento.hasMany(Promociones, {foreignKey:'td_cod'})
Promociones.belongsTo(TipoDescuento, {foreignKey:'td_cod'})

Plantilla.hasMany(Pantalla,{foreignKey:'plan_cod'})
Pantalla.belongsTo(Plantilla,{foreignKey:'plan_cod'})


//Relacion muchos a mucho entre proveedores y productos
Proveedores.belongsToMany(Productos, {through: ProvProducts})
Productos.belongsToMany(Proveedores, {through: ProvProducts})

//Relacion muchos a mucho entre Productos y Promociones
Promociones.belongsToMany(Productos, {through: ProductsProm})
Productos.belongsToMany(Promociones, {through: ProductsProm})


//Relacion muchos a mucho entre Sucursales y Promociones
Promociones.belongsToMany(Sucursales, {through: SucProms})
Sucursales.belongsToMany(Promociones, {through: SucProms})

