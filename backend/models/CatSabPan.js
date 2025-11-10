import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class CatSabPan extends Model {}

CatSabPan.init({
  CatSabPan_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
},
{
  sequelize,
  modelName: 'CatSab_has_Pantallas',
  tableName: 'CatSab_has_Pantallas',
}
)

export default CatSabPan
