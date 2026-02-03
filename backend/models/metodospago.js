import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class MetodosPago extends Model {}

MetodosPago.init({
  mp_cod: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mp_nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  mp_activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'metodos_pago',
  timestamps: false,
})

export default MetodosPago