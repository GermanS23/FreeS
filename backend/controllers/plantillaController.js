import Plantilla from "../models/plantilla.js"
import Pantalla from "../models/pantalla.js"
import { Op } from "sequelize"
import Page from "../utils/getPagingData.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Obtener todas las plantillas
const getPlantillas = async (req, res) => {
  try {
    const plantillas = await Plantilla.findAll({
      include: [
        {
          model: Pantalla,
        },
      ],
    })
    res.json(plantillas)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al obtener las plantillas")
  }
}

// Obtener una plantilla por ID
const getPlantillaById = async (req, res) => {
  try {
    const plantilla = await Plantilla.findByPk(req.params.plan_cod, {
      include: [
        {
          model: Pantalla,
        },
      ],
    })
    if (plantilla) {
      res.json(plantilla)
    } else {
      res.status(404).send("Plantilla no encontrada")
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al obtener la plantilla")
  }
}

// Crear una nueva plantilla
const createPlantilla = async (req, res) => {
  try {
    console.log("[v0] Creando plantilla con datos:", req.body)
    console.log("[v0] Archivo recibido:", req.file)

    if (!req.file) {
      return res.status(400).json({
        message: "No se proporcionó ninguna imagen. Por favor, sube una imagen para la plantilla.",
      })
    }

    const imagenUrl = `/uploads/plantillas/${req.file.filename}`
    console.log("[v0] URL de imagen generada:", imagenUrl)

    // Si se subió un archivo, guardar la ruta relativa
    const plantillaData = {
      ...req.body,
      // Guardar la ruta relativa que será accesible desde el frontend
      plan_imagen: imagenUrl,
    }

    // Si plan_config viene como string, parsearlo a JSON
    if (typeof plantillaData.plan_config === "string") {
      plantillaData.plan_config = JSON.parse(plantillaData.plan_config)
    }

    const plantilla = await Plantilla.create(plantillaData)
    console.log("[v0] Plantilla creada exitosamente:", plantilla.plan_cod)
    res.status(201).json(plantilla)
  } catch (error) {
    console.error("[v0] Error al crear plantilla:", error)
    res.status(500).json({
      message: "Error al crear la plantilla",
      error: error.message,
    })
  }
}

// Actualizar una plantilla
const updatePlantilla = async (req, res) => {
  try {
    console.log("[v0] Actualizando plantilla:", req.params.plan_cod)
    console.log("[v0] Datos recibidos:", req.body)
    console.log("[v0] Archivo recibido:", req.file)

    const plantilla = await Plantilla.findByPk(req.params.plan_cod)
    if (!plantilla) {
      return res.status(404).send("Plantilla no encontrada")
    }

    // Si se subió un nuevo archivo
    if (req.file) {
      // Eliminar la imagen anterior si existe
      if (plantilla.plan_imagen) {
        const oldImagePath = path.join(__dirname, "../../frontend/public", plantilla.plan_imagen)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
          console.log("[v0] Imagen anterior eliminada:", oldImagePath)
        }
      }
      req.body.plan_imagen = `/uploads/plantillas/${req.file.filename}`
    }

    // Si plan_config viene como string, parsearlo a JSON
    if (typeof req.body.plan_config === "string") {
      req.body.plan_config = JSON.parse(req.body.plan_config)
    }

    await plantilla.update(req.body)
    console.log("[v0] Plantilla actualizada exitosamente")

    const plantillaActualizada = await Plantilla.findByPk(req.params.plan_cod)
    res.json(plantillaActualizada)
  } catch (error) {
    console.error("[v0] Error al actualizar plantilla:", error)
    res.status(500).send("Error al actualizar la plantilla: " + error.message)
  }
}

// Eliminar una plantilla
const deletePlantilla = async (req, res) => {
  try {
    const plantilla = await Plantilla.findByPk(req.params.plan_cod)
    if (!plantilla) {
      return res.status(404).send("Plantilla no encontrada")
    }

    // Verificar si hay pantallas asociadas
    const pantallasAsociadas = await Pantalla.count({
      where: { plan_cod: req.params.plan_cod },
    })

    if (pantallasAsociadas > 0) {
      return res.status(400).send("No se puede eliminar la plantilla porque tiene pantallas asociadas")
    }

    // Eliminar la imagen del sistema de archivos si existe
    if (plantilla.plan_imagen) {
      const imagePath = path.join(__dirname, "../../frontend/public", plantilla.plan_imagen)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
        console.log("[v0] Imagen eliminada del sistema de archivos:", imagePath)
      }
    }

    await plantilla.destroy()
    console.log("[v0] Plantilla eliminada exitosamente")
    res.json({ message: "Plantilla eliminada" })
  } catch (error) {
    console.error("[v0] Error al eliminar plantilla:", error)
    res.status(500).send("Error al eliminar la plantilla: " + error.message)
  }
}

// Listar plantillas con paginación y búsqueda
const listPlantillas = async (req, res) => {
  let { page, size, title } = req.query
  const limit = size ? +size : 10
  const offset = page ? page * limit : 0

  if (title === undefined) {
    title = ""
  }

  try {
    const data = await Plantilla.findAndCountAll({
      include: [
        {
          model: Pantalla,
        },
      ],
      where: {
        [Op.or]: [
          {
            plan_cod: {
              [Op.like]: "%" + title + "%",
            },
          },
          {
            plan_nomb: {
              [Op.like]: "%" + title + "%",
            },
          },
        ],
      },
      order: [["plan_cod", "DESC"]],
      limit,
      offset,
    })

    const response = new Page(data, Number(req.query.page), limit)
    res.send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error al obtener las plantillas.",
    })
  }
}

const uploadPlantillaImagen = async (req, res) => {
  try {
    const { plan_cod } = req.params
    const { plan_imagen } = req.body

    const plantilla = await Plantilla.findByPk(plan_cod)
    if (!plantilla) {
      return res.status(404).send("Plantilla no encontrada")
    }

    await plantilla.update({ plan_imagen })
    res.json(plantilla)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al subir la imagen de la plantilla")
  }
}

export default {
  getPlantillas,
  getPlantillaById,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  listPlantillas,
  uploadPlantillaImagen,
}
