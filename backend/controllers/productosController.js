import Productos from '../models/productos.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'
import CategoriaProd from '../models/categoria_prod.js'


const getProducto = async (req, res) => {
  try {
    const productos = await Productos.findAll()
    res.json(productos)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener el Producto ')
  }
}
const getProductoById = async (req, res) => {
  const productos = await Productos.findByPk(req.params.sab_cod)
  if (productos) {
    res.json(productos)
  } else {
    console.log(productos)
    res.status(404).send('Producto no encontrado')
  }
}

const updateProd = async (req, res) => {
  try {
    const { prod_nom, prod_dis,prod_pre,prod_desc, catsab_cod } = req.body;

    // Buscar el sabor por su código
    const productos = await Productos.findByPk(req.params.prod_cod, {
      include: [{ model: CategoriaProd }], // Incluir la relación con CategoriaSab
    });

    if (!productos) {
      return res.status(404).send('Producto no encontrado');
    }

    // Actualizar los campos
    productos.prod_nom = prod_nom || productos.prod_nom;
    productos.prod_pre = prod_pre || productos.prod_pre;
    productos.prod_dis = prod_dis !== undefined ? prod_dis : productos.prod_dis;
    productos.catprod_cod = catsab_cod || productos.catprod_cod;

    // Guardar los cambios
    await productos.save();

    res.json(productos); // Devolver el sabor actualizado con la categoría
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el Producto');
  }
};

const createProd = async (req, res) => {
  try {
    const productos = await Productos.create(req.body)
    res.status(201).json(productos)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear el Producto')
  }
}

const deleteProd = async (req, res) => {
  try {
    const productos = await Productos.findByPk(req.params.prod_cod)
    if (productos) {
      await productos.destroy()
      res.json({ message: 'Producto eliminado' })
    } else {
      res.status(404).send('Producto no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar el Producto')
  }
}
const List = async (req, res) =>{
  let { page, size, title } = req.query;
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  if (title == undefined) {
    title = "";
  }

  Productos.findAndCountAll({
    include: [
      {
        model: CategoriaProd
      }
    ],
    where: {
      [Op.or]: [
        {
          prod_cod: {
            [Op.like]: "%" + title + "%",
          },
        },
        {
          prod_nom: {
            [Op.like]: "%" + title + "%",
          },
        }
      ],
    },
    order: [["prod_cod", "DESC"]],
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

const getProductosDisponibles = async (req, res) => {
  try {
    const productos = await Productos.findAll({
      include: [
        {
          model: CategoriaProd
        }
      ],
      where: {
        prod_dis: true
      },
      order: [["prod_cod", "DESC"]]
    });
    
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener productos disponibles');
  }
};
export default {
  getProducto,
  getProductoById,
  createProd,
  updateProd,
  deleteProd,
  List,
  getProductosDisponibles
}
