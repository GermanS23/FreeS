import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class CategoriaSab extends Model {}

CategoriaSab.init({
  catsab_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  catsab_name: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
},
{
  sequelize,
  modelName: 'CategoriaSab',
  tableName: 'categoria_sab',
  timestamps: false
}
)

export default CategoriaSab
