import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class Roles extends Model {}

Roles.init({
  rol_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true
  },
  rol_desc: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
},
{
  sequelize,
  modelName: 'Roles',
  tableName: 'roles',
  timestamps: false
}

)

export default Roles
