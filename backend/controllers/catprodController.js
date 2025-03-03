import CatProd from '../models/categoria_prod.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'
const getCatProd = async (req, res) => {
  try {
    const catprod = await CatProd.findAll()
    res.json(catprod)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener la Categoria')
  }
}
const getCatProdbyId = async (req, res) => {
  const catprod = await CatProd.findByPk(req.params.catprod_cod)
  if (catprod) {
    res.json(catprod)
  } else {
    res.status(404).send('Categoria no encontrada')
  }
}

const updateCatProd = async (req, res) => {
  try {
    const catprod = await CatProd.findByPk(req.params.catprod_cod)
    if (catprod) {
      await catprod.update(req.body)
      res.json(catprod)
    } else {
      res.status(404).send('Categoria no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar la Categoria')
  }
}
const createCatProd = async (req, res) => {
  try {
    const nuevaCatProd = await CatProd.create(req.body)
    res.status(201).json(nuevaCatProd)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear la categoria')
  }
}

const deleteCatProd = async (req, res) => {
  try {
    const catprod = await CatProd.findByPk(req.params.catprod_cod)
    if (catprod) {
      await catprod.destroy()
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

  CatProd.findAndCountAll({
    
    where: {
      [Op.or]: [
        {
          catprod_cod: {
            [Op.like]: "%" + title + "%",
          },
        },
        {
          catprod_name: {
            [Op.like]: "%" + title + "%",
          },
        }
      ],
    },
    order: [["catprod_cod", "DESC"]],
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
  getCatProd,
  getCatProdbyId,
  createCatProd,
  updateCatProd,
  deleteCatProd,
  List
}
