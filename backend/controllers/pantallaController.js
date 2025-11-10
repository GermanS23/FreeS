// controllers/pantallaController.js
import Pantalla from '../models/pantalla.js'
import Plantilla from '../models/plantilla.js'
import Catsab from '../models/categoria_sab.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'

// Helper: verifica si el modelo tiene el atributo pan_config
const modelHasPanConfig = () => {
  try {
    return Boolean(Pantalla.rawAttributes && Object.prototype.hasOwnProperty.call(Pantalla.rawAttributes, 'pan_config'))
  } catch (e) {
    return false
  }
}

// Obtener todas las pantallas
const getPantallas = async (req, res) => {
  try {
    const pantallas = await Pantalla.findAll({
      include: [
        { model: Plantilla, as: 'Plantilla' },
        { model: Catsab, as: 'CategoriaSabs', through: { attributes: [] } },
      ],
      order: [['pan_cod', 'ASC']],
    })
    res.json(pantallas)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener las pantallas')
  }
}

// Obtener una pantalla por ID
const getPantallaById = async (req, res) => {
  try {
    const pantalla = await Pantalla.findByPk(req.params.pan_cod, {
      include: [
        { model: Plantilla, as: 'Plantilla' },
        { model: Catsab, as: 'CategoriaSabs', through: { attributes: [] } },
      ],
    })
    if (pantalla) {
      res.json(pantalla)
    } else {
      res.status(404).send('Pantalla no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener la pantalla')
  }
}

// Crear una nueva pantalla
const createPantalla = async (req, res) => {
  const t = await Pantalla.sequelize.transaction()
  try {
    // Verificar si la plantilla existe (si se proporciona)
    if (req.body.plan_cod) {
      const plantilla = await Plantilla.findByPk(req.body.plan_cod, { transaction: t })
      if (!plantilla) {
        await t.rollback()
        return res.status(404).send('La plantilla especificada no existe')
      }
    }

    // Si existe pan_config en el modelo, normalizamos/parceamos si viene como string
    let pan_config_obj = undefined
    if (modelHasPanConfig()) {
      pan_config_obj = req.body.pan_config ?? {}
      if (typeof pan_config_obj === 'string') {
        try {
          pan_config_obj = JSON.parse(pan_config_obj || '{}')
        } catch (e) {
          pan_config_obj = {}
        }
      }
    }

    // Preparar el objeto a crear, incluyendo pan_config solo si el modelo lo soporta
    const toCreate = {
      pan_nomb: req.body.pan_nomb,
      pan_desc: req.body.pan_desc,
      pan_activa: typeof req.body.pan_activa !== 'undefined' ? req.body.pan_activa : true,
      pan_componente: req.body.pan_componente,
      plan_cod: req.body.plan_cod || null,
    }
    if (typeof pan_config_obj !== 'undefined') toCreate.pan_config = pan_config_obj

    // Crear pantalla
    const pantalla = await Pantalla.create(toCreate, { transaction: t })

    // Asociar categorias many-to-many si se proporcionaron
    const rawCats = req.body.pan_catsab_cod
    const catsArray = Array.isArray(rawCats)
      ? rawCats.map((v) => Number(v)).filter(Boolean)
      : rawCats
      ? [Number(rawCats)].filter(Boolean)
      : []

    if (catsArray.length > 0) {
      const cats = await Catsab.findAll({ where: { catsab_cod: catsArray }, transaction: t })
      await pantalla.setCategoriaSabs(cats, { transaction: t })
    }

    await t.commit()

    // Devolver pantalla con relaciones
    const pantallaConRel = await Pantalla.findByPk(pantalla.pan_cod, {
      include: [
        { model: Plantilla, as: 'Plantilla' },
        { model: Catsab, as: 'CategoriaSabs', through: { attributes: [] } },
      ],
    })

    res.status(201).json(pantallaConRel)
  } catch (error) {
    await t.rollback()
    console.error('[v0] Error al crear pantalla:', error)
    res.status(500).send('Error al crear la pantalla')
  }
}

// Actualizar una pantalla
const updatePantalla = async (req, res) => {
  const t = await Pantalla.sequelize.transaction()
  try {
    // Verificar si la plantilla existe (si se proporciona)
    if (req.body.plan_cod) {
      const plantilla = await Plantilla.findByPk(req.body.plan_cod, { transaction: t })
      if (!plantilla) {
        await t.rollback()
        return res.status(404).send('La plantilla especificada no existe')
      }
    }

    const pantalla = await Pantalla.findByPk(req.params.pan_cod, { transaction: t })
    if (!pantalla) {
      await t.rollback()
      return res.status(404).send('Pantalla no encontrada')
    }

    // Manejo pan_config solo si el modelo lo soporta
    let incomingConfig = undefined
    if (modelHasPanConfig()) {
      incomingConfig = req.body.pan_config
      if (typeof incomingConfig === 'string') {
        try {
          incomingConfig = JSON.parse(incomingConfig || '{}')
        } catch (e) {
          incomingConfig = {}
        }
      }
    }

    // Merge del pan_config existente con el entrante (si aplica)
    let nuevoConfig = undefined
    if (typeof incomingConfig !== 'undefined') {
      nuevoConfig = { ...(pantalla.pan_config || {}), ...(incomingConfig || {}) }
    }

    // Preparar objeto para update (solo actualizar pan_config si existe)
    const toUpdate = {
      pan_nomb: typeof req.body.pan_nomb !== 'undefined' ? req.body.pan_nomb : pantalla.pan_nomb,
      pan_desc: typeof req.body.pan_desc !== 'undefined' ? req.body.pan_desc : pantalla.pan_desc,
      pan_activa: typeof req.body.pan_activa !== 'undefined' ? req.body.pan_activa : pantalla.pan_activa,
      pan_componente: typeof req.body.pan_componente !== 'undefined' ? req.body.pan_componente : pantalla.pan_componente,
      plan_cod: typeof req.body.plan_cod !== 'undefined' ? req.body.plan_cod : pantalla.plan_cod,
    }
    if (typeof nuevoConfig !== 'undefined') toUpdate.pan_config = nuevoConfig

    await pantalla.update(toUpdate, { transaction: t })

    // Manejar asociación many-to-many: sincronizar si pan_catsab_cod está presente (incluso vacío)
    if (typeof req.body.pan_catsab_cod !== 'undefined') {
      const rawCats = req.body.pan_catsab_cod
      const catsArray = Array.isArray(rawCats)
        ? rawCats.map((v) => Number(v)).filter(Boolean)
        : rawCats
        ? [Number(rawCats)].filter(Boolean)
        : []

      if (catsArray.length === 0) {
        // limpiar relaciones
        await pantalla.setCategoriaSabs([], { transaction: t })
      } else {
        const cats = await Catsab.findAll({ where: { catsab_cod: catsArray }, transaction: t })
        await pantalla.setCategoriaSabs(cats, { transaction: t })
      }
    }

    await t.commit()

    // devolver pantalla actualizada con relaciones
    const pantallaActualizada = await Pantalla.findByPk(req.params.pan_cod, {
      include: [
        { model: Plantilla, as: 'Plantilla' },
        { model: Catsab, as: 'CategoriaSabs', through: { attributes: [] } },
      ],
    })

    res.json(pantallaActualizada)
  } catch (error) {
    await t.rollback()
    console.error('[v0] Error al actualizar pantalla:', error)
    res.status(500).send('Error al actualizar la pantalla')
  }
}

// Eliminar una pantalla
const deletePantalla = async (req, res) => {
  try {
    const pantalla = await Pantalla.findByPk(req.params.pan_cod)
    if (pantalla) {
      await pantalla.destroy()
      res.json({ message: 'Pantalla eliminada' })
    } else {
      res.status(404).send('Pantalla no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar la pantalla')
  }
}

// Listar pantallas con paginación y búsqueda
const listPantallas = async (req, res) => {
  let { page, size, title } = req.query
  const limit = size ? +size : 10
  const offset = page ? page * limit : 0

  if (title === undefined) {
    title = ''
  }

  try {
    const data = await Pantalla.findAndCountAll({
      include: [
        { model: Plantilla, as: 'Plantilla' },
        { model: Catsab, as: 'CategoriaSabs', through: { attributes: [] } },
      ],
      where: {
        [Op.or]: [
          { pan_cod: { [Op.like]: '%' + title + '%' } },
          { pan_nomb: { [Op.like]: '%' + title + '%' } },
        ],
      },
      order: [['pan_cod', 'DESC']],
      limit,
      offset,
      distinct: true, // importante con include many-to-many
    })

    const response = new Page(data, Number(req.query.page), limit)
    res.send(response)
  } catch (err) {
    console.error(err)
    res.status(500).send({
      message: err.message || 'Error al obtener las pantallas.',
    })
  }
}

// Obtener pantallas activas
const getPantallasActivas = async (req, res) => {
  try {
    const pantallas = await Pantalla.findAll({
      where: { pan_activa: true },
      include: [
        { model: Plantilla, as: 'Plantilla' },
        { model: Catsab, as: 'CategoriaSabs', through: { attributes: [] } },
      ],
      order: [['pan_cod', 'ASC']],
    })
    res.json(pantallas)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener las pantallas activas')
  }
}

// Actualizar una plantilla
const updatePlantilla = async (req, res) => {
  try {
    const plantilla = await Plantilla.findByPk(req.params.plan_cod)
    if (plantilla) {
      await plantilla.update(req.body)
      res.json(plantilla)
    } else {
      res.status(404).send('Plantilla no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar la plantilla')
  }
}

export default {
  getPantallas,
  getPantallaById,
  createPantalla,
  updatePantalla,
  deletePantalla,
  listPantallas,
  getPantallasActivas,
  updatePlantilla,
}
