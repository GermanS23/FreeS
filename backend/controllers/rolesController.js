import Roles from '../models/roles.js'
import Page from '../utils/getPagingData.js'
import { Op } from 'sequelize'

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
const List = async (req, res) =>{
  let { page, size, title } = req.query;
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  if (title == undefined) {
    title = "";
  }

  Roles.findAndCountAll({
    
    where: {
      [Op.or]: [
        {
          rol_cod: {
            [Op.like]: "%" + title + "%",
          },
        },
        {
          rol_desc: {
            [Op.like]: "%" + title + "%",
          },
        }
      ],
    },
    order: [["rol_cod", "DESC"]],
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
  getRoles,
  getRolesById,
  updateRole,
  createRole,
  deleteRole,
  List
}
