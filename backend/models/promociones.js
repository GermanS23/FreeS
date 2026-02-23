import sequelize from "../config/database.js";

import {Model, DataTypes} from 'sequelize';

class Promociones extends Model{};

Promociones.init({
    prom_cod: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
       },
    prom_nom: {
        type: DataTypes.STRING(45),
        allowNull: false
        },
    prom_importe:{
        type: DataTypes.DECIMAL(10),
        allowNull: false
    },
    prom_fechaini:{
        type: DataTypes.DATE(),
    }, 
    prom_fechafin:{
        type: DataTypes.DATE(),
    },
    prom_estado:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},
{
  sequelize,
  modelName: 'Promociones',
  tableName: 'promociones'
}
)

export default Promociones;