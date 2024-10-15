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

Roles.hasOne(Usuarios, { foreignKey: 'roles_rol_cod' })
Usuarios.belongsTo(Roles, { foreignKey: 'roles_rol_cod' })

Usuarios.belongsToMany(Sucursales, { through: 'Usuarios_has_Sucursales', timestamps: false })
Sucursales.belongsToMany(Usuarios, { through: 'Usuarios_has_Sucursales', timestamps: false })

Usuarios.hasMany(LastModified,{foreignKey:'us_cod'})


CategoriaSab.hasMany(SaboresHelados, { foreignKey: 'catsab_cod'})

CategoriaProd.hasMany(Productos, {foreignKey:'catprod_cod'})

TipoDescuento.hasMany(Promociones, {foreignKey:'td_cod'})

Plantilla.hasMany(Pantalla,{foreignKey:'plan_cod'})


//Relacion muchos a mucho entre proveedores y productos
Proveedores.belongsTo(Productos, {through: 'Proveedores_has_Productos', timestamps: false})
Productos.belongsTo(Proveedores, {through: 'Proveedores_has_Productos', timestamps: false})

//Relacion muchos a mucho entre Productos y Promociones
Promociones.belongsTo(Productos, {through: 'Productos_has_Promociones', timestamps: false})
Productos.belongsTo(Promociones, {through: 'Productos_has_Promociones', timestamps: false})


//Relacion muchos a mucho entre Sucursales y Promociones
Promociones.belongsTo(Sucursales, {through: 'Sucursales_has_Promociones', timestamps: false})
Sucursales.belongsTo(Promociones, {through: 'Sucursales_has_Promociones', timestamps: false})

