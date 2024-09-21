import Roles from '../models/roles.js'

const getRoles = async (req, res) => {
  try {
    const roles = await Roles.findAll()
    res.json(roles)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener el Rol')
  }
}

const getRolesById = async (req, res) => {
  const roles = await Roles.findByPk(req.params.rol_cod)
  if (roles) {
    res.json(roles)
  } else {
    res.status(404).send('Rol no encontrado')
  }
}

const updateRole = async (req, res) => {
  try {
    const roles = Roles.findByPk(req.params.rol_cod)
    if (roles) {
      await roles.update(req.body)
      res.json(roles)
    } else {
      res.status(404).send('Rol no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar el Rol')
  }
}
const createRole = async (req, res) => {
  try {
    const nuevoRol = await Roles.create(req.body)
    res.status(201).json(nuevoRol)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear el rol')
  }
}

const deleteRole = async (req, res) => {
  try {
    const rol = await Roles.findByPk(req.params.rol_cod)
    if (rol) {
      await rol.destroy()
      res.json({ message: 'Rol eliminado' })
    } else {
      res.status(404).send('Rol no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar el rol')
  }
}
export default {
  getRoles,
  getRolesById,
  updateRole,
  createRole,
  deleteRole
}