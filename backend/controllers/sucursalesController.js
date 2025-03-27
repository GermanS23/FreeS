import Sucursales from '../models/sucursales.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'
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
    res.status(201).json(newuser)
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

const List = async (req, res) =>{
  let { page, size, title } = req.query;
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  if (title == undefined) {
    title = "";
  }

  Sucursales.findAndCountAll({
    
    where: {
      [Op.or]: [
        {
          suc_cod: {
            [Op.like]: "%" + title + "%",
          },
        },
        {
          suc_name: {
            [Op.like]: "%" + title + "%",
          },
        }
      ],
    },
    order: [["suc_cod", "DESC"]],
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
  getSucursal,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal,
  List
}
