import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class VentaPagos extends Model {}

VentaPagos.init({
  vp_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mp_cod: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vp_monto: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  vp_fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'venta_pagos',
  timestamps: false,
})

export default VentaPagos