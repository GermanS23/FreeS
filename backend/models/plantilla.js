import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Plantilla extends Model{};

Plantilla.init({
    plan_cod:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    plan_nomb:{
        type: DataTypes.STRING(45),
        allowNull: false
    }
},
{ sequelize,
    modelName: 'Plantilla',
    tableName: 'plantilla',
    timestamps: false,
}
)

export default Plantilla;