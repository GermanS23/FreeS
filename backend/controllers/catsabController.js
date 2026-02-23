import CategoriaSab from '../models/categoria_sab.js'
import CatSab from '../models/categoria_sab.js'
import SaboresHelados from '../models/saboreshelados.js'
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
  const catsab = await CategoriaSab.findByPk(parseInt(req.params.catsab_cod))
  if (catsab) {
    res.json(catsab)
  } else {
    res.status(404).send('Categoria no encontrada')
  }
}

const updateCatSab = async (req, res) => {
  const catsab = await CatSab.findByPk(parseInt(req.params.catsab_cod))
  if (catsab) {
    await catsab.update(req.body)
    res.json({ message: 'Categoría Modificada con éxito', data: catsab })
  } else {
    res.status(404).send('Categoria no encontrada')
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
    const catsab_cod = parseInt(req.params.catsab_cod)

    const saboresAsociados = await SaboresHelados.count({
      where: { catsab_cod }
    })

    if (saboresAsociados > 0) {
      return res.status(400).json({
        message: `No se puede eliminar: existen ${saboresAsociados} sabores vinculados a esta categoría.`
      })
    }

    const catsab = await CatSab.findByPk(catsab_cod)
    if (catsab) {
      await catsab.destroy()
      res.json({ message: 'Categoría de sabor eliminada.' })
    } else {
      res.status(404).send('Categoría no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al intentar eliminar la Categoría de Sabor')
  }
}

const softDeleteCatSab = async (req, res) => {
  try {
    // ✅ parseInt — evita que Sequelize haga WHERE con string vs TINYINT
    const catsab_cod = parseInt(req.params.catsab_cod)

    const catsab = await CatSab.findByPk(catsab_cod, { raw: true })

    if (!catsab) {
      return res.status(404).send('Categoría no encontrada')
    }

    const estadoActual = Number(catsab.catsab_estado)
    const nuevoEstado = estadoActual === 1 ? 0 : 1

    console.log(`[softDelete] catsab_cod=${catsab_cod} (${typeof catsab_cod}) estadoActual=${estadoActual} nuevoEstado=${nuevoEstado}`)

    const [rowsUpdated] = await CatSab.update(
      { catsab_estado: nuevoEstado },
      { where: { catsab_cod: catsab_cod } }
    )

    console.log(`[softDelete] Filas actualizadas: ${rowsUpdated}`)

    // Verificar que realmente se guardó
    const verificacion = await CatSab.findByPk(catsab_cod, { raw: true })
    console.log(`[softDelete] Estado en DB después del update: ${verificacion.catsab_estado}`)

    // Cascada a sabores
    const [saboresUpdated] = await SaboresHelados.update(
      { sab_disp: nuevoEstado },
      { where: { catsab_cod: catsab_cod } }
    )
    console.log(`[softDelete] Sabores actualizados: ${saboresUpdated}`)

    res.json({
      message: `Categoría ${nuevoEstado === 1 ? 'activada' : 'desactivada'}`,
      estado: nuevoEstado
    })

  } catch (error) {
    console.error('Error en softDeleteCatSab:', error)
    res.status(500).send('Error en el servidor')
  }
}

const List = async (req, res) => {
  let { page, size, title } = req.query
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  if (title == undefined) title = ''

  CatSab.findAndCountAll({
    where: {
      [Op.or]: [
        { catsab_cod: { [Op.like]: '%' + title + '%' } },
        { catsab_name: { [Op.like]: '%' + title + '%' } }
      ]
    },
    order: [['catsab_cod', 'DESC']],
    limit,
    offset
  })
    .then((data) => {
      const response = new Page(data, Number(req.query.page), limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error al listar categorías de sabores.'
      })
    })
}

export default {
  getCatSab,
  getCatSabById,
  createCatSab,
  updateCatSab,
  deleteCatSab,
  List,
  softDeleteCatSab
}