// 🔹 CAMBIO 1: Importamos 'SaboresHelados' (con 'H' mayúscula) para coincidir con tu 'associations.js'
import SaboresHelados from "../models/saboreshelados.js" 
import CategoriaSab from "../models/categoria_sab.js"
import { Op } from "sequelize"
import Page from "../utils/getPagingData.js"

// Las funciones CRUD estándar
const getSabor = async (req, res) => {
  try {
    // 🔹 CAMBIO 2: Usamos el nombre de modelo 'SaboresHelados'
    const sabores = await SaboresHelados.findAll({
      include: [{ model: CategoriaSab }], // Incluimos la categoría
    })
    res.json(sabores)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al obtener los sabores")
  }
}

const getSaborById = async (req, res) => {
  try {
    // 🔹 CAMBIO 2: Usamos el nombre de modelo 'SaboresHelados'
    const sabor = await SaboresHelados.findByPk(req.params.sab_cod, {
      include: [{ model: CategoriaSab }], // Incluimos la categoría
    })
    if (sabor) {
      res.json(sabor)
    } else {
      res.status(404).send("Sabor no encontrado")
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al obtener el sabor")
  }
}

const createSab = async (req, res) => {
  try {
    // 🔹 CAMBIO 2: Usamos el nombre de modelo 'SaboresHelados'
    const nuevoSabor = await SaboresHelados.create(req.body)
    res.status(201).json(nuevoSabor)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al crear el sabor")
  }
}

const updateSab = async (req, res) => {
  try {
    // 🔹 CAMBIO 2: Usamos el nombre de modelo 'SaboresHelados'
    const sabor = await SaboresHelados.findByPk(req.params.sab_cod)
    if (sabor) {
      await sabor.update(req.body)
      res.json(sabor)
    } else {
      res.status(404).send("Sabor no encontrado")
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al actualizar el sabor")
  }
}

const deleteSab = async (req, res) => {
  try {
    // 🔹 CAMBIO 2: Usamos el nombre de modelo 'SaboresHelados'
    const sabor = await SaboresHelados.findByPk(req.params.sab_cod)
    if (sabor) {
      await sabor.destroy()
      res.json({ message: "Sabor eliminado" })
    } else {
      res.status(404).send("Sabor no encontrado")
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al eliminar el sabor")
  }
}

//
// 🔹 FUNCIÓN 'List' CORREGIDA 🔹
//
const List = async (req, res) => {
  let { page, size, title, catsab } = req.query;

  const limit = size ? +size : 1000;
  const offset = page ? page * limit : 0;
  const where = {};

  if (title) {
    where[Op.or] = [
      { sab_nom: { [Op.like]: "%" + title + "%" } },
    ];
  }

  if (catsab) {
    const categoryIds = catsab.split(',').map(id => Number(id)).filter(Boolean);
    if (categoryIds.length > 0) {
      where.catsab_cod = { [Op.in]: categoryIds };
    }
  }

  SaboresHelados.findAndCountAll({
    where,
    include: [
      {
        model: CategoriaSab, 
        // 🔹 IMPORTANTE: No ponemos 'where: { catsab_estado: true }' aquí
        // para que el ADMIN pueda ver sabores de categorías inactivas.
      }
    ],
    order: [["sab_nom", "ASC"]],
    limit,
    offset,
  })
  .then((data) => {
    const response = new Page(data, Number(req.query.page), limit);
    res.send(response);
  })
  .catch((err) => {
    res.status(500).send({ message: err.message });
  });
}
export default {
  getSabor,
  getSaborById,
  createSab,
  updateSab,
  deleteSab,
  List,
}