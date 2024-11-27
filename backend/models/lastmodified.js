import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class LastModified extends Model{};

LastModified.init({
    lm_cod:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    lm_tabla:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    lm_registroid:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    lm_motivo:{
        type: DataTypes.STRING(45),
        allowNull: false
    },
    lm_fechamod:{
        type: DataTypes.DATE,
        allowNull: false
    }
},
{sequelize,
    modelName:'LastModified',
    tableName:'lastmodified',
}
)

export default LastModified;