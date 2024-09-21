import TipoDescuento from '../models/tipodescuento.js'

const getTD = async (req, res) => {
  try {
    const td = TipoDescuento.findAll()
    res.json(td)
  } catch (error) {
    console.error(error)
    res.status(500).send('Eror al obtener el Tipo de Descuento')
  }
}

const getTDbyId = async (req, res) => {
  const td = TipoDescuento.findByPk(req.params.td_cod)
  if (td) {
    res.json(td)
  } else {
    res.status(404).send('Tipo de Descuento no encontrado')
  }
}

const createTD = async (req, res) => {
  try {
    const newTD = await TipoDescuento.create(req.body)
    res.status(404).json(newTD)
  } catch (error) {
    console.error(error)
    res.status(505).send('Error al crear el Tipo de Descuento')
  }
}

const updateTD = async (req, res) => {
  try {
    const td = TipoDescuento.findByPk(req.params.td_cod)
    if (td) {
      await td.update(req.body)
      res.json(td)
    } else {
      res.status(404).send('Tipo de Descuento no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar el Tipo de Descuento')
  }
}

const deleteTD = async (req, res) => {
  try {
    const td = await TipoDescuento.findByPk(req.params.td_cod)
    if (td) {
      await td.destroy()
      res.json({ message: 'Tipo de Descuento eliminado' })
    } else {
      res.status(404).send('Tipo de Descuento no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar el Tipo de Descuento')
  }
}
export default {
  getTD,
  getTDbyId,
  createTD,
  updateTD,
  deleteTD
}
