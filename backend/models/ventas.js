import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class Ventas extends Model {}

Ventas.init({
  venta_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  suc_cod: {
    type: DataTypes.TINYINT, 
    allowNull: false,
  },
  caja_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  venta_fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  venta_subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  descuento: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  venta_total: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  venta_estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'ABIERTA',
  },
  venta_fecha_cierre: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'ventas',
  timestamps: false,
})

export default Ventas