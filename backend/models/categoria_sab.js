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
  },
  catsab_estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
},
{
  sequelize,
  modelName: 'CategoriaSab',
  tableName: 'categoria_sab'
}
)

export default CategoriaSab
