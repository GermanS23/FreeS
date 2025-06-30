import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuarios from './usuarios.js';
import Sucursales from './sucursales.js';

class UsuariosSucursales extends Model {}

UsuariosSucursales.init(
  {
    UsuarioUsCod: { // Nombre específico para la clave foránea de Usuarios
      type: DataTypes.TINYINT,
      allowNull: false,
      references: {
        model: Usuarios,
        key: 'us_cod',
      },
      
    },
    SucursaleSucCod: { // Nombre específico para la clave foránea de Sucursales
      type: DataTypes.TINYINT,
      allowNull: false,
      references: {
        model: Sucursales,
        key: 'suc_cod',
      },
      
    },
  },
  {
    sequelize,
    modelName: 'Usuarios_has_Sucursales',
    tableName: 'Usuarios_has_Sucursales',
  }
);

export default UsuariosSucursales;