import CatProd from '../models/categoria_prod.js'
import { Op } from 'sequelize'
import Page from '../utils/getPagingData.js'
import Productos from '../models/productos.js'

const getCatProd = async (req, res) => {
  try {
    const catprod = await CatProd.findAll()
    res.json(catprod)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener la Categoria')
  }
}
const getCatProdbyId = async (req, res) => {
  const catprod = await CatProd.findByPk(req.params.catprod_cod)
  if (catprod) {
    res.json(catprod)
  } else {
    res.status(404).send('Categoria no encontrada')
  }
}

const updateCatProd = async (req, res) => {
  try {
    const catprod = await CatProd.findByPk(req.params.catprod_cod)
    if (catprod) {
      await catprod.update(req.body)
      res.json(catprod)
    } else {
      res.status(404).send('Categoria no encontrada')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar la Categoria')
  }
}
const createCatProd = async (req, res) => {
  try {
    const nuevaCatProd = await CatProd.create(req.body)
    res.status(201).json(nuevaCatProd)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear la categoria')
  }
}

// --- ESCENARIO B: HARD DELETE (Seguro de eliminación) ---
const deleteCatProd = async (req, res) => {
  try {
    const { catprod_cod } = req.params;

    // 1. BUSCAR SI EXISTEN PRODUCTOS ASIGNADOS
    const productosAsociados = await Productos.count({
      where: { catprod_cod: catprod_cod }
    });

    // 2. VALIDACIÓN: Si hay productos, impedimos el borrado físico
    if (productosAsociados > 0) {
      return res.status(400).json({ 
        message: `No se puede eliminar la categoría porque tiene ${productosAsociados} productos asignados. Primero elimine o reasigne los productos.` 
      });
    }

    const catprod = await CatProd.findByPk(catprod_cod);
    if (catprod) {
      await catprod.destroy();
      res.json({ message: 'Categoría eliminada con éxito' });
    } else {
      res.status(404).send('Categoría no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al intentar eliminar físicamente la Categoría');
  }
};
const softDeleteCatProd = async (req, res) => {
  try {
    // Convertir a número para evitar comparación string vs int en MySQL
    const catprod_cod = parseInt(req.params.catprod_cod);

    const catprod = await CatProd.findByPk(catprod_cod);

    if (!catprod) {
      return res.status(404).send('Categoría no encontrada');
    }

    // catprod_estado es BOOLEAN en Sequelize → puede llegar como true/false o 1/0
    // Normalizamos con Boolean() para ser consistentes
    const estadoActual = Boolean(catprod.catprod_estado);
    const nuevoEstado = !estadoActual; // true → false o false → true

    await catprod.update({ catprod_estado: nuevoEstado });

    // Cascada: si se DESACTIVA la categoría, desactivar sus productos
    if (!nuevoEstado) {
      const [rowsAffected] = await Productos.update(
        { prod_dis: false },
        { where: { catprod_cod: catprod_cod } } // catprod_cod ya es número
      );
      console.log(`Cascada: ${rowsAffected} productos desactivados para categoría ${catprod_cod}`);
    }
    // Opcional: si se REACTIVA la categoría, reactivar sus productos también
    else {
      const [rowsAffected] = await Productos.update(
        { prod_dis: true },
        { where: { catprod_cod: catprod_cod } }
      );
      console.log(`Cascada: ${rowsAffected} productos reactivados para categoría ${catprod_cod}`);
    }

    res.json({
      message: `Categoría ${nuevoEstado ? 'activada' : 'desactivada'}`,
      estado: nuevoEstado
    });

  } catch (error) {
    console.error("Error en softDeleteCatProd:", error);
    res.status(500).send('Error en el servidor');
  }
};
const List = async (req, res) =>{
  let { page, size, title } = req.query;
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  if (title == undefined) {
    title = "";
  }

  CatProd.findAndCountAll({
    
    where: {
      [Op.or]: [
        {
          catprod_cod: {
            [Op.like]: "%" + title + "%",
          },
        },
        {
          catprod_name: {
            [Op.like]: "%" + title + "%",
          },
        }
      ],
    },
    order: [["catprod_cod", "DESC"]],
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
  getCatProd,
  getCatProdbyId,
  createCatProd,
  updateCatProd,
  deleteCatProd,
  List,
  softDeleteCatProd
}
