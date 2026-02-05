import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class Cajas extends Model {}

Cajas.init({
  caja_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  suc_cod: {
    type: DataTypes.TINYINT,  
    allowNull: false,
  },
  us_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  caja_fecha_apertura: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  caja_fecha_cierre: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  caja_monto_inicial: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  caja_monto_final: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  caja_total_ventas: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  caja_total_efectivo_esperado: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  caja_total_efectivo_real: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  caja_diferencia: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  caja_estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'ABIERTA',
  },
  caja_observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'cajas',
  timestamps: false,
})

export default Cajas