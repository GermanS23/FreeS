import sequelize from '../config/database.js'

import { DataTypes, Model } from 'sequelize'

class SaboresHelados extends Model{}

SaboresHelados.init({
  sab_cod: {
    type: DataTypes.TINYINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  sab_nom: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  sab_disp: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
    us_cod: {
      type: DataTypes.TINYINT,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'us_cod'
      }
    }
  },
  { sequelize,
    modelName: 'SaboresHelados',
    tableName: 'saboreshelados',
    timestamps: false
  }
)

export default SaboresHelados