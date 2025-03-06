import Pantalla from '../models/pantalla.js';
import Plantilla from '../models/plantilla.js';
import { Op } from 'sequelize';
import Page from '../utils/getPagingData.js';

// Obtener todas las pantallas
const getPantallas = async (req, res) => {
  try {
    const pantallas = await Pantalla.findAll({
      include: [
        {
          model: Plantilla
        }
      ]
    });
    res.json(pantallas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las pantallas');
  }
};

// Obtener una pantalla por ID
const getPantallaById = async (req, res) => {
  try {
    const pantalla = await Pantalla.findByPk(req.params.pan_cod, {
      include: [
        {
          model: Plantilla
        }
      ]
    });
    if (pantalla) {
      res.json(pantalla);
    } else {
      res.status(404).send('Pantalla no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la pantalla');
  }
};

// Crear una nueva pantalla
const createPantalla = async (req, res) => {
  try {
    // Verificar si la plantilla existe (si se proporciona)
    if (req.body.plan_cod) {
      const plantilla = await Plantilla.findByPk(req.body.plan_cod);
      if (!plantilla) {
        return res.status(404).send('La plantilla especificada no existe');
      }
    }
    
    const pantalla = await Pantalla.create(req.body);
    res.status(201).json(pantalla);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la pantalla');
  }
};

// Actualizar una pantalla
const updatePantalla = async (req, res) => {
  try {
    // Verificar si la plantilla existe (si se proporciona)
    if (req.body.plan_cod) {
      const plantilla = await Plantilla.findByPk(req.body.plan_cod);
      if (!plantilla) {
        return res.status(404).send('La plantilla especificada no existe');
      }
    }
    
    const pantalla = await Pantalla.findByPk(req.params.pan_cod);
    if (pantalla) {
      await pantalla.update(req.body);
      
      // Obtener la pantalla actualizada con la plantilla
      const pantallaActualizada = await Pantalla.findByPk(req.params.pan_cod, {
        include: [
          {
            model: Plantilla
          }
        ]
      });
      
      res.json(pantallaActualizada);
    } else {
      res.status(404).send('Pantalla no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la pantalla');
  }
};

// Eliminar una pantalla
const deletePantalla = async (req, res) => {
  try {
    const pantalla = await Pantalla.findByPk(req.params.pan_cod);
    if (pantalla) {
      await pantalla.destroy();
      res.json({ message: 'Pantalla eliminada' });
    } else {
      res.status(404).send('Pantalla no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la pantalla');
  }
};

// Listar pantallas con paginación y búsqueda
const listPantallas = async (req, res) => {
  let { page, size, title } = req.query;
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  if (title === undefined) {
    title = "";
  }

  try {
    const data = await Pantalla.findAndCountAll({
      include: [
        {
          model: Plantilla
        }
      ],
      where: {
        [Op.or]: [
          {
            pan_cod: {
              [Op.like]: "%" + title + "%",
            },
          },
          {
            pan_nomb: {
              [Op.like]: "%" + title + "%",
            },
          },
        ],
      },
      order: [["pan_cod", "DESC"]],
      limit,
      offset,
    });
    
    const response = new Page(data, Number(req.query.page), limit);
    res.send(response);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error al obtener las pantallas.",
    });
  }
};

// Obtener pantallas activas
const getPantallasActivas = async (req, res) => {
  try {
    const pantallas = await Pantalla.findAll({
      where: { pan_activa: true },
      include: [
        {
          model: Plantilla
        }
      ]
    });
    res.json(pantallas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las pantallas activas');
  }
};

export default {
  getPantallas,
  getPantallaById,
  createPantalla,
  updatePantalla,
  deletePantalla,
  listPantallas,
  getPantallasActivas
};