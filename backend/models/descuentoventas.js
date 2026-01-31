import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class DescuentoVentas extends Model {}

DescuentoVentas.init({
  descventa_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },

  valor: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  importe_aplicado: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'descuento_ventas',
  timestamps: false,
})

export default DescuentoVentas
