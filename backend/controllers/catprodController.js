import CatProd from '../models/categoria_prod.js'

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
    const catprod = CatProd.findByPk(req.params.catprod_cod)
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
export default {
  getCatProd,
  getCatProdbyId,
  createCatProd,
  updateCatProd,
  deleteCatProd
}
