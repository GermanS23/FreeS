import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class ProductsProm extends Model {}

ProductsProm.init({
  pp_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
},
{
  sequelize,
  modelName: 'Productos_has_Promociones',
  tableName: 'Productos_has_Promociones',
}
)

export default ProductsProm
