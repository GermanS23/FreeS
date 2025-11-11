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
  // 1. Leemos 'catprod' (para las pantallas) además de 'page', 'size', 'title' (para admin)
  let { page, size, title, catprod } = req.query;

  // 2. Si 'size' no viene, usamos 1000 (para las pantallas públicas)
  const limit = size ? +size : 1000;
  const offset = page ? page * limit : 0;

  // 3. Construimos el 'where'
  const where = {};

  if (title) {
    where[Op.or] = [
      { prod_cod: { [Op.like]: "%" + title + "%" } },
      { prod_nom: { [Op.like]: "%" + title + "%" } },
    ];
  }

  // 4. 🔹 AÑADIMOS EL FILTRO DE CATEGORÍA 🔹
  // Si el parámetro 'catprod' (ej: "1,2,3") existe...
  if (catprod) {
    // Convertimos el string "1,2,3" en un array de números: [1, 2, 3]
    const categoryIds = catprod.split(',').map(id => Number(id)).filter(Boolean);
    
    if (categoryIds.length > 0) {
      // Usamos 'catprod_cod' (de tu associations.js)
      where.catprod_cod = { [Op.in]: categoryIds };
    }
  }

  // 5. Ejecutamos la consulta con los filtros
  Productos.findAndCountAll({
    where, // Contiene filtro de 'title' y/o 'catprod'
    include: [
      {
        model: CategoriaProd // Incluimos la info de la categoría
      }
    ],
    order: [["prod_nom", "ASC"]], // Ordenamos por nombre
    limit,
    offset,
  })
    .then((data) => {
      const response = new Page(data, Number(req.query.page), limit);
      res.send(response);
    })
    .catch((err) => {
      console.error("Error en Productos List:", err); // Log de error
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al listar los productos.",
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