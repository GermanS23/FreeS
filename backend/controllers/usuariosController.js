import Usuarios from '../models/usuarios.js'

const getUsuarios = async (req, res) => {
  try {
    const usuarios = Usuarios.findAll()
    res.json(usuarios)
  } catch (error) {
    console.error(error)
    res.status(500).send('Eror al obtener el Usuario')
  }
}

const getUsuariosById = async (req, res) => {
  const usuarios = Usuarios.findByPk(req.params.us_cod)
  if (usuarios) {
    res.json(usuarios)
  } else {
    res.status(404).send('Usuario no encontrado')
  }
}

const createUsuario = async (req, res) => {
  try {
    const newuser = await Usuarios.create(req.body)
    res.status(404).json(newuser)
  } catch (error) {
    console.error(error)
    res.status(505).send('Error al crear el Usuario')
  }
}

const updateUsuario = async (req, res) => {
  try {
    const usuarios = Usuarios.findByPk(req.params.us_cod)
    if (usuarios) {
      await usuarios.update(req.body)
      res.json(usuarios)
    } else {
      res.status(404).send('Usuario no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar el Usuario')
  }
}

const deleteUsuario = async (req, res) => {
  try {
    const td = await Usuarios.findByPk(req.params.us_cod)
    if (td) {
      await td.destroy()
      res.json({ message: 'Usuario eliminado' })
    } else {
      res.status(404).send('Usuario no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar el Usuario')
  }
}

export default {
  getUsuarios,
  getUsuariosById,
  createUsuario,
  updateUsuario,
  deleteUsuario
}
