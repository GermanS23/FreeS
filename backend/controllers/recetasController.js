import sequelize from '../config/database.js'
import ProductoInsumos from '../models/productoinsumos.js'
import Productos from '../models/productos.js'
import Insumos from '../models/insumos.js'

class RecetasController {

  // =========================
  // OBTENER RECETA DE UN PRODUCTO
  // =========================
  static async getRecetaProducto(prod_cod) {
    const recetas = await ProductoInsumos.findAll({
      where: { prod_cod },
      include: [{
        model: Insumos,
        as: 'Insumo',
        attributes: ['insumo_id', 'insumo_nombre', 'unidad_medida', 'stock_actual']
      }],
      order: [['fecha_creacion', 'ASC']]
    })

    return recetas
  }

  // =========================
  // ASIGNAR/ACTUALIZAR RECETA COMPLETA
  // =========================
  static async asignarReceta(prod_cod, insumos) {
    return await sequelize.transaction(async (t) => {
      
      // Verificar que el producto existe
      const producto = await Productos.findByPk(prod_cod, { transaction: t })
      if (!producto) {
        throw new Error('Producto no encontrado')
      }

      // Eliminar receta anterior
      await ProductoInsumos.destroy({
        where: { prod_cod },
        transaction: t
      })

      // Crear nueva receta
      const recetasCreadas = []
      
      for (const insumo of insumos) {
        const { insumo_id, cantidad_requerida } = insumo

        // Verificar que el insumo existe
        const insumoExiste = await Insumos.findByPk(insumo_id, { transaction: t })
        if (!insumoExiste) {
          throw new Error(`Insumo ${insumo_id} no encontrado`)
        }

        if (Number(cantidad_requerida) <= 0) {
          throw new Error('La cantidad requerida debe ser mayor a 0')
        }

        const receta = await ProductoInsumos.create({
          prod_cod,
          insumo_id,
          cantidad_requerida: Number(cantidad_requerida)
        }, { transaction: t })

        recetasCreadas.push(receta)
      }

      return await this.getRecetaProducto(prod_cod)
    })
  }

  // =========================
  // AGREGAR INSUMO A RECETA
  // =========================
  static async agregarInsumoAReceta(prod_cod, insumo_id, cantidad_requerida) {
    return await sequelize.transaction(async (t) => {
      
      // Verificar que no exista ya
      const existe = await ProductoInsumos.findOne({
        where: { prod_cod, insumo_id },
        transaction: t
      })

      if (existe) {
        throw new Error('Este insumo ya está en la receta del producto')
      }

      // Crear relación
      await ProductoInsumos.create({
        prod_cod,
        insumo_id,
        cantidad_requerida: Number(cantidad_requerida)
      }, { transaction: t })

      return await this.getRecetaProducto(prod_cod)
    })
  }

  // =========================
  // MODIFICAR CANTIDAD DE INSUMO EN RECETA
  // =========================
  static async modificarCantidadInsumo(producto_insumo_id, cantidad_requerida) {
    const receta = await ProductoInsumos.findByPk(producto_insumo_id)
    
    if (!receta) {
      throw new Error('Relación producto-insumo no encontrada')
    }

    if (Number(cantidad_requerida) <= 0) {
      throw new Error('La cantidad requerida debe ser mayor a 0')
    }

    await receta.update({
      cantidad_requerida: Number(cantidad_requerida)
    })

    return await this.getRecetaProducto(receta.prod_cod)
  }

  // =========================
  // ELIMINAR INSUMO DE RECETA
  // =========================
  static async eliminarInsumoDeReceta(producto_insumo_id) {
    const receta = await ProductoInsumos.findByPk(producto_insumo_id)
    
    if (!receta) {
      throw new Error('Relación producto-insumo no encontrada')
    }

    const prod_cod = receta.prod_cod
    await receta.destroy()

    return await this.getRecetaProducto(prod_cod)
  }

  // =========================
  // LISTAR PRODUCTOS CON SUS RECETAS
  // =========================
  static async getProductosConRecetas(suc_cod) {
    const productos = await Productos.findAll({
      where: { prod_activo: true },
      include: [{
        model: ProductoInsumos,
        as: 'Receta',
        include: [{
          model: Insumos,
          as: 'Insumo',
          where: { suc_cod },
          required: false
        }]
      }]
    })

    return productos
  }

  // =========================
  // VERIFICAR DISPONIBILIDAD DE STOCK
  // =========================
  static async verificarDisponibilidad(prod_cod, cantidad = 1) {
    const recetas = await ProductoInsumos.findAll({
      where: { prod_cod },
      include: [{
        model: Insumos,
        as: 'Insumo'
      }]
    })

    const faltantes = []

    for (const receta of recetas) {
      const cantidadNecesaria = Number(receta.cantidad_requerida) * cantidad
      const stockActual = Number(receta.Insumo.stock_actual)

      if (stockActual < cantidadNecesaria) {
        faltantes.push({
          insumo_id: receta.Insumo.insumo_id,
          insumo_nombre: receta.Insumo.insumo_nombre,
          necesario: cantidadNecesaria,
          disponible: stockActual,
          faltante: cantidadNecesaria - stockActual,
          unidad: receta.Insumo.unidad_medida
        })
      }
    }

    return {
      disponible: faltantes.length === 0,
      faltantes
    }
  }
}

export default RecetasController