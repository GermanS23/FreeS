import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class HistorialStock extends Model {}

HistorialStock.init({
  historial_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  insumo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_movimiento: {
    type: DataTypes.ENUM('VENTA', 'AJUSTE_MANUAL', 'INVENTARIO_INICIAL'),
    allowNull: false,
  },
  cantidad_anterior: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cantidad_movimiento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Positivo = entrada, Negativo = salida',
  },
  cantidad_nueva: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Si el movimiento fue por una venta',
  },
  us_cod: {
    type: DataTypes.TINYINT,
    allowNull: true,
    comment: 'Usuario que realizó el movimiento',
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_movimiento: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'historial_stock',
  timestamps: false,
})

export default HistorialStock