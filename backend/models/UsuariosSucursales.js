import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class UsuariosSucursales extends Model {}

UsuariosSucursales.init({
  us_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
},
{
  sequelize,
  modelName: 'Usuarios_has_Sucursales',
  tableName: 'Usuarios_has_Sucursales',
}
)

export default UsuariosSucursales
