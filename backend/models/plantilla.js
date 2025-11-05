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
    },
    plan_imagen: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "URL o base64 de la imagen de fondo",
    },
    plan_config: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    }
},
{ sequelize,
    modelName: 'Plantilla',
    tableName: 'plantilla',
}
)

export default Plantilla;