import sequelize from '../config/database.js'

import { Model, DataTypes } from 'sequelize'

class Productos extends Model{}

Productos.init({
  prod_cod: {
   type: DataTypes.INTEGER,
   autoIncrement: true,
   primaryKey: true,
   allowNull: false
  },
  prod_nom: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  prod_desc: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  // Precio Producto
  prod_pre: {
  type: DataTypes.DECIMAL,
  allowNull: true
},
// Disponibilidad del producto
prod_dis: {
  type: DataTypes.BOOLEAN,
  allowNull: false
}
},
{ sequelize,
  modelName: 'Productos',
  tableName: 'productos',
  timestamps: false
  
})

export default Productos;
