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
  }
  },
  { sequelize,
    modelName: 'SaboresHelados',
    tableName: 'saboreshelados',
  }
)

export default SaboresHelados