// Trabajar las asociaciones de todas las tablas
// Importar todos los modelos

import Usuarios from './usuarios.js'
import Sucursales from './sucursales.js'
import Roles from './roles.js'
import SaboresHelados from './saboreshelados.js'
import CategoriaSab from './categoria_sab.js'

Roles.hasOne(Usuarios, { foreignKey: 'roles_rol_cod' })
Usuarios.belongsTo(Roles, { foreignKey: 'roles_rol_cod' })

Usuarios.belongsToMany(Sucursales, { through: 'Usuarios_has_Sucursales', timestamps: false })
Sucursales.belongsToMany(Usuarios, { through: 'Usuarios_has_Sucursales', timestamps: false })

SaboresHelados.belongsTo(CategoriaSab, { foreignKey: 'catsab_cod'})
CategoriaSab.hasMany(SaboresHelados, { foreignKey: 'catsab_cod'})
