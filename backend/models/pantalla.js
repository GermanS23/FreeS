import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Pantalla extends Model{};

Pantalla.init({
    pan_cod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    pan_nomb:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    pan_desc:{
        type: DataTypes.STRING(45)
    }
},
{ sequelize,
    modelName: 'Pantalla',
    tableName: 'pantalla',
}
)

export default Pantalla;