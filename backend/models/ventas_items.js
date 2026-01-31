import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js';

class VentasItems extends Model {}

VentasItems.init({
  venta_items_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prod_cod: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'ventas_items',
  timestamps: false,
})


export default VentasItems
