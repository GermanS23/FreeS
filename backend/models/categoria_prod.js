import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class CategoriaProd extends Model {}

CategoriaProd.init({
  catprod_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  catprod_name: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  catprod_estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
},
{
  sequelize,
  modelName: 'CategoriaProd',
  tableName: 'categoria_prod'
}

)

export default CategoriaProd
