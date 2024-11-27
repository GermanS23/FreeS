import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class ProvProducts extends Model {}

ProvProducts.init({
  pp_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
},
{
  sequelize,
  modelName: 'Proveedores_has_Productos',
  tableName: 'Proveedores_has_Productos',
}
)

export default ProvProducts
