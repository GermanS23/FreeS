import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class Sucursales extends Model {}

Sucursales.init({
  suc_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  suc_name: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
},
{
  sequelize,
  modelName: 'Sucursales',
  tableName: 'sucursales',
}
)

export default Sucursales
