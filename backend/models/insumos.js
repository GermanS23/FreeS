import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class Insumos extends Model {}

Insumos.init({
  insumo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  insumo_nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  insumo_descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  unidad_medida: {
    type: DataTypes.ENUM('kg', 'g', 'l', 'ml', 'unidad', 'bocha', 'pote'),
    allowNull: false,
    defaultValue: 'unidad',
  },
  suc_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  stock_actual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  stock_minimo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  insumo_activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_modificacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'insumos',
  timestamps: false,
})

export default Insumos