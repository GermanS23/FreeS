// controllers/insumosController.js
import sequelize from '../config/database.js'
import { Op } from 'sequelize'
import Insumos from '../models/insumos.js'
import ProductoInsumos from '../models/productoinsumos.js'
import HistorialStock from '../models/historialstock.js'
import Sucursales from '../models/sucursales.js'
import Usuarios from '../models/usuarios.js'

class InsumosController {


  // En el backend: InsumosController.js o HistorialController.js
static async getHistorialGlobal(suc_cod, limit = 100) {
  return await HistorialStock.findAll({
    include: [
      { model: Insumos, as: 'Insumo', where: { suc_cod }, attributes: ['insumo_nombre'] },
      { model: Usuarios, as: 'Usuario', attributes: ['us_nomape'] }
    ],
    order: [['fecha_movimiento', 'DESC']],
    limit
  });
}
  // =========================
  // LISTAR INSUMOS
  // =========================
  static async getInsumos(suc_cod, { incluirInactivos = false } = {}) {
    const where = { suc_cod }
    if (!incluirInactivos) where.insumo_activo = true

    return await Insumos.findAll({
      where,
      include: [{
        model: Sucursales,
        as: 'Sucursal',
        attributes: ['suc_name']
      }],
      order: [['insumo_nombre', 'ASC']]
    })
  }

  // =========================
  // OBTENER POR ID
  // =========================
  static async getInsumoById(insumo_id) {
    const insumo = await Insumos.findByPk(insumo_id, {
      include: [
        { model: Sucursales, as: 'Sucursal', attributes: ['suc_name'] },
        {
          model: ProductoInsumos,
          as: 'Recetas',
          attributes: ['producto_insumo_id', 'prod_cod', 'cantidad_requerida'],
          required: false
        }
      ]
    })
    if (!insumo) throw new Error('Insumo no encontrado')
    return insumo
  }

  // =========================
  // CREAR INSUMO
  // =========================
  static async createInsumo(data, us_cod) {
    return await sequelize.transaction(async (t) => {
      const insumo = await Insumos.create({
        insumo_nombre: data.insumo_nombre,
        insumo_descripcion: data.insumo_descripcion,
        unidad_medida: data.unidad_medida,
        suc_cod: data.suc_cod,
        stock_actual: data.stock_actual || 0,
        stock_minimo: data.stock_minimo || 0,
        insumo_activo: true
      }, { transaction: t })

      if (Number(data.stock_actual) > 0) {
        await HistorialStock.create({
          insumo_id: insumo.insumo_id,
          tipo_movimiento: 'INVENTARIO_INICIAL',
          cantidad_anterior: 0,
          cantidad_movimiento: Number(data.stock_actual),
          cantidad_nueva: Number(data.stock_actual),
          us_cod,
          observaciones: 'Stock inicial al crear insumo'
        }, { transaction: t })
      }
      return insumo
    })
  }

  // =========================
  // VALIDAR STOCK (Antes de cerrar venta)
  // =========================
  static async validarStockPorVenta(ventaItems, transaction) {
    const faltantes = []

    for (const item of ventaItems) {
      const recetas = await ProductoInsumos.findAll({
        where: { prod_cod: item.prod_cod },
        include: [{ model: Insumos, as: 'Insumo' }],
        transaction
      })

      for (const receta of recetas) {
        const necesario = Number(receta.cantidad_requerida) * item.cantidad
        const disponible = Number(receta.Insumo.stock_actual)

        if (disponible < necesario) {
          faltantes.push({
            producto: item.nombre,
            insumo: receta.Insumo.insumo_nombre,
            necesario,
            disponible,
            faltante: necesario - disponible,
            unidad: receta.Insumo.unidad_medida
          })
        }
      }
    }
    return faltantes
  }

  // =========================
  // DESCONTAR STOCK (Cierre de venta)
  // =========================
  static async descontarStockPorVenta(venta_id, items, us_cod, transaction) {
    // Si no viene transacción, esto fallará, asegurando la integridad
    if (!transaction) throw new Error("Se requiere una transacción para descontar stock");

    for (const item of items) {
      const recetas = await ProductoInsumos.findAll({
        where: { prod_cod: item.prod_cod },
        transaction
      })

      for (const receta of recetas) {
        const cantidadTotal = Number(item.cantidad) * Number(receta.cantidad_requerida)

        const insumo = await Insumos.findByPk(receta.insumo_id, { transaction })
        const stockAnterior = Number(insumo.stock_actual)
        const stockNuevo = stockAnterior - cantidadTotal

        // Actualizamos usando decrement para mayor seguridad en la DB
        await insumo.decrement('stock_actual', { by: cantidadTotal, transaction })

        await HistorialStock.create({
          insumo_id: insumo.insumo_id,
          tipo_movimiento: 'VENTA',
          cantidad_anterior: stockAnterior,
          cantidad_movimiento: -cantidadTotal,
          cantidad_nueva: stockNuevo,
          venta_id,
          us_cod,
          observaciones: `Descuento automático por venta #${venta_id}`
        }, { transaction })
      }
    }
  }

  // =========================
  // DEVOLVER STOCK (Anulación)
  // =========================
  static async devolverStockPorVenta(items, transaction) {
    if (!transaction) throw new Error("Se requiere una transacción para devolver stock");

    for (const item of items) {
      const recetas = await ProductoInsumos.findAll({
        where: { prod_cod: item.prod_cod },
        transaction
      })

      for (const receta of recetas) {
        const cantidadTotal = Number(item.cantidad) * Number(receta.cantidad_requerida)

        const insumo = await Insumos.findByPk(receta.insumo_id, { transaction })
        const stockAnterior = Number(insumo.stock_actual)
        const stockNuevo = stockAnterior + cantidadTotal

        await insumo.increment('stock_actual', { by: cantidadTotal, transaction })

        await HistorialStock.create({
          insumo_id: insumo.insumo_id,
          tipo_movimiento: 'VENTA_ANULADA',
          cantidad_anterior: stockAnterior,
          cantidad_movimiento: cantidadTotal,
          cantidad_nueva: stockNuevo,
          venta_id: item.venta_id,
          us_cod: null,
          observaciones: `Devolución por anulación de venta #${item.venta_id}`
        }, { transaction })
      }
    }
  }

  // =========================
  // AJUSTAR STOCK MANUALMENTE
  // =========================
  static async ajustarStock(insumo_id, cantidad_nueva, us_cod, observaciones = null) {
    return await sequelize.transaction(async (t) => {
      const insumo = await Insumos.findByPk(insumo_id, { transaction: t })
      if (!insumo) throw new Error('Insumo no encontrado')

      const stockAnterior = Number(insumo.stock_actual)
      const stockNuevo = Number(cantidad_nueva)
      const movimiento = stockNuevo - stockAnterior

      await insumo.update({
        stock_actual: stockNuevo,
        fecha_modificacion: new Date()
      }, { transaction: t })

      await HistorialStock.create({
        insumo_id,
        tipo_movimiento: 'AJUSTE_MANUAL',
        cantidad_anterior: stockAnterior,
        cantidad_movimiento: movimiento,
        cantidad_nueva: stockNuevo,
        us_cod,
        observaciones: observaciones || 'Ajuste manual de stock'
      }, { transaction: t })

      return insumo
    })
  }
}

export default InsumosController