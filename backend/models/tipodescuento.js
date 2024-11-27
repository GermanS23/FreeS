import { Model, DataTypes } from 'sequelize'

import sequelize from '../config/database.js'

class TipoDescuento extends Model {}

TipoDescuento.init({
  td_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true
  },
  td_name: {
    type: DataTypes.STRING
  },
  td_signo: {
    type: DataTypes.STRING(10)
  }
},
{
  sequelize,
  modelName: 'TipoDescuento',
  tableName: 'tipodescuento',
}

)

export default TipoDescuento
