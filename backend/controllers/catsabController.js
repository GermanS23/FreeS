import CatSab from '../models/categoria_sab.js'

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
  const catsab = await CatSab.findByPk(req.params.catsab_cod)
  if (catsab) {
    res.json(catsab)
  } else {
    res.status(404).send('Categoria no encontrada')
  }
}

const updateCatSab = async (req, res) => {
  try {
    const catsab = CatSab.findByPk(req.params.catsab_cod)
    if (catsab) {
      await catsab.update(req.body)
      res.json(catsab)
    } else {
      res.status(404).send('Categoria no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar la Categoria')
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
export default {
  getCatSab,
  getCatSabById,
  createCatSab,
  updateCatSab,
  deleteCatSab
}
