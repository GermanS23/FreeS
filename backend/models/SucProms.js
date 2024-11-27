import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class SucProms extends Model {}

SucProms.init({
  pp_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
},
{
  sequelize,
  modelName: 'Sucursales_has_Promociones',
  tableName: 'Sucursales_has_Promociones',
}
)

export default SucProms
