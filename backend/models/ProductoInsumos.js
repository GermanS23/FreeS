import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class ProductoInsumos extends Model {}

ProductoInsumos.init({
  producto_insumo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  prod_cod: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  insumo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cantidad_requerida: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Cantidad de insumo necesaria para 1 unidad del producto',
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'producto_insumos',
  timestamps: false,
})

export default ProductoInsumos