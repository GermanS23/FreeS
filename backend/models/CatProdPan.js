import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class CatProdPan extends Model {}

CatProdPan.init({
  CatProdPlan_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
},
{
  sequelize,
  modelName: 'CatProd_has_Pantallas',
  tableName: 'CatProd_has_Pantallas',
}
)

export default CatProdPan
