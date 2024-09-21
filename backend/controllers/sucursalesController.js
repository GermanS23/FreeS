import Sucursales from '../models/sucursales.js'

const getSucursal = async (req, res) => {
  try {
    const sucursales = Sucursales.findAll()
    res.json(sucursales)
  } catch (error) {
    console.error(error)
    res.status(500).send('Eror al obtener la Sucursal')
  }
}

const getSucursalById = async (req, res) => {
  const sucursales = Sucursales.findByPk(req.params.suc_cod)
  if (sucursales) {
    res.json(sucursales)
  } else {
    res.status(404).send('Sucursal no encontrada')
  }
}

const createSucursal = async (req, res) => {
  try {
    const newuser = await Sucursales.create(req.body)
    res.status(404).json(newuser)
  } catch (error) {
    console.error(error)
    res.status(505).send('Error al crear la Sucursal')
  }
}

const updateSucursal = async (req, res) => {
  try {
    const sucursales = Sucursales.findByPk(req.params.suc_cod)
    if (sucursales) {
      await sucursales.update(req.body)
      res.json(sucursales)
    } else {
      res.status(404).send('Sucursal no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar la Sucursal')
  }
}

const deleteSucursal = async (req, res) => {
  try {
    const td = await Sucursales.findByPk(req.params.suc_cod)
    if (td) {
      await td.destroy()
      res.json({ message: 'Sucursal eliminada' })
    } else {
      res.status(404).send('Sucursal no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar la Sucursal')
  }
}

export default {
  getSucursal,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal
}
