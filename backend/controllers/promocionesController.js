import Promociones from '../models/promociones.js'
import Productos from '../models/productos.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'

// --- FUNCIÓN PÚBLICA
const ListPublica = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const data = await Promociones.findAndCountAll({
      where: {
        // 1. Debe haber empezado ya
        prom_fechaini: { [Op.lte]: endOfDay },
        
        // 2. No debe haber terminado (o ser NULL)
        [Op.or]: [
          { prom_fechafin: { [Op.gte]: startOfDay } },
          { prom_fechafin: null } // 🔹 Esto permite que aparezca tu promo de la imagen
        ]
      },
      order: [["prom_nom", "ASC"]], 
      limit: 50
    });
    
    const response = new Page(data, 0, 50);
    res.send(response);
  } catch (err) {
    console.error("Error en Promociones ListPublica:", err);
    res.status(500).send({ message: "Error al listar promociones." });
  }
}

// --- 🔹 FUNCIONES DE ADMIN (NUEVAS) 🔹 ---

// List (para el Admin, con paginación)
const List = async (req, res) =>{
  let { page, size, title } = req.query;
  const limit = size ? +size : 20;
  const offset = page ? page * limit : 0;
  if (title == undefined) { title = ""; }

  Promociones.findAndCountAll({
    where: {
      prom_nom: { [Op.like]: "%" + title + "%" }
    },
    order: [["prom_nom", "ASC"]],
    limit,
    offset,
  })
    .then((data) => {
      const response = new Page(data, Number(req.query.page), limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al listar promociones."
      });
    });
}

// GetById (para el modal de Editar)
const getPromoById = async (req, res) => {
  const promo = await Promociones.findByPk(req.params.id)
  if (promo) {
    res.json(promo)
  } else {
    res.status(404).send('Promoción no encontrada')
  }
}

// Create
const createPromo = async (req, res) => {
  try {
    const nuevaPromo = await Promociones.create(req.body)
    res.status(201).json(nuevaPromo)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear la promoción')
  }
}

// Update
const updatePromo = async (req, res) => {
  try {
    const promo = await Promociones.findByPk(req.params.id)
    if (promo) {
      await promo.update(req.body)
      res.json(promo)
    } else {
      res.status(404).send('Promoción no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar la promoción')
  }
}

// Delete
const deletePromo = async (req, res) => {
  try {
    const promo = await Promociones.findByPk(req.params.id)
    if (promo) {
      await promo.destroy()
      res.json({ message: 'Promoción eliminada' })
    } else {
      res.status(404).send('Promoción no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar la promoción')
  }
}

export default {
  ListPublica,
  List,
  getPromoById,
  createPromo,
  updatePromo,
  deletePromo
}