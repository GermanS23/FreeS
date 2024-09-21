import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class Usuarios extends Model {}

Usuarios.init({
  us_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  us_user: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  us_pass: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  us_email: {
    type: DataTypes.STRING(45),
    allowNull: null
  },
  us_tel: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  roles_rol_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'rol_cod'
    }
  }
},
{
  sequelize,
  modelName: 'Usuarios',
  tableName: 'usuarios',
  timestamps: false
}
)

export default Usuarios