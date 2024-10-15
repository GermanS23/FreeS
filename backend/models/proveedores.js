import sequelize from "../config/database.js";

import {Model, DataTypes} from 'sequelize';

class Proveedores extends Model{};

Proveedores.init({
    prov_cod:{
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    prov_nom:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    prov_email:{
        type: DataTypes.STRING(45) ,
        allowNull: false
    },
    prov_tel:{
        type: DataTypes.STRING(45) ,
        allowNull: false
    },
    prov_direc:{
        type: DataTypes.STRING(45) ,
        allowNull: false
    },
    prov_saldo:{
        type: DataTypes.FLOAT() ,
        allowNull: false
    },
    prov_activo:{
        type: DataTypes.BOOLEAN() ,
        allowNull: false
    },
    prov_nrotributario:{
        type: DataTypes.STRING(45) ,
        allowNull: false
    },
    prov_coment:{
        type: DataTypes.STRING(45) ,
        allowNull: false
    }
},
{
  sequelize,
  modelName: 'Proveedores',
  tableName: 'proveedores',
  timestamps: false
}
)

export default Proveedores;
