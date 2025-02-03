import SaboresHelados from '../models/saboreshelados.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'
import CategoriaSab from '../models/categoria_sab.js'


const getSabor = async (req, res) => {
  try {
    const sabhelados = await SaboresHelados.findAll({
      include: [{ model: CategoriaSab }], // Incluir la relación con CategoriaSab
    })
    res.json(sabhelados)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener el sabor ')
  }
}
const getSaborById = async (req, res) => {
  const sabhelados = await SaboresHelados.findByPk(req.params.sab_cod,{
    include: [{ model: CategoriaSab }], // Incluir la relación con CategoriaSab
  })
  if (sabhelados) {
    res.json(sabhelados)
  } else {
    console.log(sabhelados)
    res.status(404).send('Sabor no encontrado')
  }
}

const updateSab = async (req, res) => {
  try {
    const { sab_nom, sab_disp, catsab_cod } = req.body;

    // Buscar el sabor por su código
    const sabhelados = await SaboresHelados.findByPk(req.params.sab_cod, {
      include: [{ model: CategoriaSab }], // Incluir la relación con CategoriaSab
    });

    if (!sabhelados) {
      return res.status(404).send('Sabor no encontrado');
    }

    // Actualizar los campos
    sabhelados.sab_nom = sab_nom || sabhelados.sab_nom;
    sabhelados.sab_disp = sab_disp !== undefined ? sab_disp : sabhelados.sab_disp;
    sabhelados.catsab_cod = catsab_cod || sabhelados.catsab_cod;

    // Guardar los cambios
    await sabhelados.save();

    res.json(sabhelados); // Devolver el sabor actualizado con la categoría
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el Sabor');
  }
};

const createSab = async (req, res) => {
  try {
    const newsabhelados = await SaboresHelados.create(req.body)
    res.status(201).json(newsabhelados)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear el Sabor')
  }
}

const deleteSab = async (req, res) => {
  try {
    const sabhelados = await SaboresHelados.findByPk(req.params.sab_cod)
    if (sabhelados) {
      await sabhelados.destroy()
      res.json({ message: 'Sabor eliminado' })
    } else {
      res.status(404).send('Sabor no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar el Sabor')
  }
}
const List = async (req, res) =>{
  let { page, size, title } = req.query;
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  if (title == undefined) {
    title = "";
  }

  SaboresHelados.findAndCountAll({
    include: [
      {
        model: CategoriaSab
      }
    ],
    where: {
      [Op.or]: [
        {
          sab_cod: {
            [Op.like]: "%" + title + "%",
          },
        },
        {
          sab_nom: {
            [Op.like]: "%" + title + "%",
          },
        }
      ],
    },
    order: [["sab_cod", "DESC"]],
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
  getSabor,
  getSaborById,
  createSab,
  updateSab,
  deleteSab,
  List
}
