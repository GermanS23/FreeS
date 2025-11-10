import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database.js"

class Plantilla extends Model {}

Plantilla.init(
  {
    plan_cod: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    plan_nomb: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    plan_tipo: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    plan_imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Ruta relativa de la imagen de fondo (ej: /uploads/plantillas/imagen-123456.jpg)",
    },
    plan_config: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  },
  { sequelize, modelName: "Plantilla", tableName: "plantilla", timestamps: true },
)

export default Plantilla
