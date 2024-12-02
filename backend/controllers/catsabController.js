import CategoriaSab from '../models/categoria_sab.js'
import CatSab from '../models/categoria_sab.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'
const getCatSab = async (req, res) => {
  try {
    const catsab = await CatSab.findAll()
    res.json(catsab)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener la categoria del sabor')
  }
}
const getCatSabById = async (req, res) => {
  const catsab = await CategoriaSab.findByPk(req.params.catsab_cod)
  if (catsab) {
    res.json(catsab)
  } else {
    console.log(catsab)
    res.status(404).send('Categoria no encontrado')
  }
}

const updateCatSab = async (req, res) => {
  const catsab = await CatSab.findByPk(req.params.catsab_cod);
  if (catsab) {
    await catsab.update(req.body);
    res.json({
      message: 'Categoría Modificada con éxito',
      data: catsab
    });
  } else {
    res.status(404).send('Categoria no encontrada');
  }
}

const createCatSab = async (req, res) => {
  try {
    const nuevaCatSab = await CatSab.create(req.body)
    res.status(201).json(nuevaCatSab)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear la Categoria')
  }
}

const deleteCatSab = async (req, res) => {
  try {
    const catsab = await CatSab.findByPk(req.params.catsab_cod)
    if (catsab) {
      await catsab.destroy()
      res.json({ message: 'Categoria eliminada' })
    } else {
      res.status(404).send('Categoria no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar la Categoria')
  }
}
const List = async (req, res) =>{
  let { page, size, title } = req.query;
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  if (title == undefined) {
    title = "";
  }

  CatSab.findAndCountAll({
    
    where: {
      [Op.or]: [
        {
          catsab_cod: {
            [Op.like]: "%" + title + "%",
          },
        },
        {
          catsab_name: {
            [Op.like]: "%" + title + "%",
          },
        }
      ],
    },
    order: [["catsab_cod", "DESC"]],
    limit,
    offset,
  })
    .then((data) => {
      const response = new Page(data, Number(req.query.page), limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
}
export default {
  getCatSab,
  getCatSabById,
  createCatSab,
  updateCatSab,
  deleteCatSab,
  List
}
