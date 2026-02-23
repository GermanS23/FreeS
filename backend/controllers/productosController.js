import Productos from '../models/productos.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'
import CategoriaProd from '../models/categoria_prod.js'


const getProducto = async (req, res) => {
  try {
    const productos = await Productos.findAll({
      include: [{ model: CategoriaProd }] // Incluimos la categoría
    })
    res.json(productos)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener el Producto ')
  }
}
const getProductoById = async (req, res) => {
  const productos = await Productos.findByPk(req.params.prod_cod, {
    include: [{ model: CategoriaProd }] // Incluimos la categoría
  })
  if (productos) {
    res.json(productos)
  } else {
    console.log(productos)
    res.status(404).send('Producto no encontrado')
  }
}

const updateProd = async (req, res) => {
  try {
    // 🔹 CORRECCIÓN: Tu variable se llamaba 'catsab_cod'
    const { prod_nom, prod_dis, prod_pre, prod_desc, catprod_cod } = req.body;

    // Buscar el sabor por su código
    const productos = await Productos.findByPk(req.params.prod_cod, {
      include: [{ model: CategoriaProd }], // Incluir la relación con CategoriaProd
    });

    if (!productos) {
      return res.status(404).send('Producto no encontrado');
    }

    // Actualizar los campos
    productos.prod_nom = prod_nom || productos.prod_nom;
    productos.prod_pre = prod_pre || productos.prod_pre;
    productos.prod_dis = prod_dis !== undefined ? prod_dis : productos.prod_dis;
    // 🔹 CORRECCIÓN: Usamos la variable 'catprod_cod'
    productos.catprod_cod = catprod_cod || productos.catprod_cod;

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

//
// 🔹 --- FUNCIÓN 'List' MODIFICADA --- 🔹
//
const List = async (req, res) => {
  let { page, size, title, catprod, isAdmin } = req.query; // Agregamos isAdmin si es posible

  const limit = size ? +size : 1000;
  const offset = page ? page * limit : 0;
  const where = {};

  if (title) {
    where[Op.or] = [
      { prod_cod: { [Op.like]: "%" + title + "%" } },
      { prod_nom: { [Op.like]: "%" + title + "%" } },
    ];
  }

  if (catprod) {
    const categoryIds = catprod.split(',').map(id => Number(id)).filter(Boolean);
    if (categoryIds.length > 0) {
      where.catprod_cod = { [Op.in]: categoryIds };
    }
  }

  Productos.findAndCountAll({
    where,
    include: [
      {
        model: CategoriaProd,
        // 🔹 QUITAMOS EL 'where: { catprod_estado: true }' de aquí 🔹
        // Para que el administrador pueda seguir viendo los productos 
        // aunque la categoría esté desactivada.
      }
    ],
    order: [["prod_nom", "ASC"]],
    limit,
    offset,
  })
  .then((data) => {
    const response = new Page(data, Number(req.query.page), limit);
    res.send(response);
  })
  .catch((err) => {
    res.status(500).send({ message: err.message });
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
      order: [["prod_nom", "ASC"]] // Orden alfabético
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