import Plantilla from '../models/plantilla.js';
import Pantalla from '../models/pantalla.js';
import { Op } from 'sequelize';
import Page from '../utils/getPagingData.js';

// Obtener todas las plantillas
const getPlantillas = async (req, res) => {
  try {
    const plantillas = await Plantilla.findAll({
      include: [
        {
          model: Pantalla
        }
      ]
    });
    res.json(plantillas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las plantillas');
  }
};

// Obtener una plantilla por ID
const getPlantillaById = async (req, res) => {
  try {
    const plantilla = await Plantilla.findByPk(req.params.plan_cod, {
      include: [
        {
          model: Pantalla
        }
      ]
    });
    if (plantilla) {
      res.json(plantilla);
    } else {
      res.status(404).send('Plantilla no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la plantilla');
  }
};

// Crear una nueva plantilla
const createPlantilla = async (req, res) => {
  try {
    const plantilla = await Plantilla.create(req.body);
    res.status(201).json(plantilla);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la plantilla');
  }
};

// Actualizar una plantilla
const updatePlantilla = async (req, res) => {
  try {
    const plantilla = await Plantilla.findByPk(req.params.plan_cod);
    if (plantilla) {
      await plantilla.update(req.body);
      res.json(plantilla);
    } else {
      res.status(404).send('Plantilla no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la plantilla');
  }
};

// Eliminar una plantilla
const deletePlantilla = async (req, res) => {
  try {
    const plantilla = await Plantilla.findByPk(req.params.plan_cod);
    if (plantilla) {
      // Verificar si hay pantallas asociadas
      const pantallasAsociadas = await Pantalla.count({
        where: { plan_cod: req.params.plan_cod }
      });
      
      if (pantallasAsociadas > 0) {
        return res.status(400).send('No se puede eliminar la plantilla porque tiene pantallas asociadas');
      }
      
      await plantilla.destroy();
      res.json({ message: 'Plantilla eliminada' });
    } else {
      res.status(404).send('Plantilla no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la plantilla');
  }
};

// Listar plantillas con paginación y búsqueda
const listPlantillas = async (req, res) => {
  let { page, size, title } = req.query;
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  if (title === undefined) {
    title = "";
  }

  try {
    const data = await Plantilla.findAndCountAll({
      include: [
        {
          model: Pantalla
        }
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
    });
    
    const response = new Page(data, Number(req.query.page), limit);
    res.send(response);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error al obtener las plantillas.",
    });
  }
};

export default {
  getPlantillas,
  getPlantillaById,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  listPlantillas
};