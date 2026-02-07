import sequelize from '../config/database.js'
import { Op } from 'sequelize'
import Insumos from '../models/insumos.js'
import ProductoInsumos from '../models/productoinsumos.js'
import HistorialStock from '../models/historialstock.js'
import Sucursales from '../models/sucursales.js'
import Usuarios from '../models/usuarios.js'

class InsumosController {

  // =========================
  // LISTAR INSUMOS
  // =========================
  static async getInsumos(suc_cod, { incluirInactivos = false } = {}) {
    const where = { suc_cod }
    
    if (!incluirInactivos) {
      where.insumo_activo = true
    }

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
        {
          model: Sucursales,
          as: 'Sucursal',
          attributes: ['suc_name']
        },
        {
          model: ProductoInsumos,
          as: 'Recetas',
          attributes: ['producto_insumo_id', 'prod_cod', 'cantidad_requerida'],
          required: false
        }
      ]
    })

    if (!insumo) {
      throw new Error('Insumo no encontrado')
    }

    return insumo
  }

  // =========================
  // CREAR INSUMO
  // =========================
  static async createInsumo(data, us_cod) {
      console.log("ENTRÓ A CREATE INSUMO")
    return await sequelize.transaction(async (t) => {
      const {
        insumo_nombre,
        insumo_descripcion,
        unidad_medida,
        suc_cod,
        stock_actual,
        stock_minimo
      } = data

      // Crear insumo
      const insumo = await Insumos.create({
        insumo_nombre,
        insumo_descripcion,
        unidad_medida,
        suc_cod,
        stock_actual: stock_actual || 0,
        stock_minimo: stock_minimo || 0,
        insumo_activo: true
      }, { transaction: t })

      // Registrar en historial si hay stock inicial
      if (Number(stock_actual) > 0) {
        await HistorialStock.create({
          insumo_id: insumo.insumo_id,
          tipo_movimiento: 'INVENTARIO_INICIAL',
          cantidad_anterior: 0,
          cantidad_movimiento: Number(stock_actual),
          cantidad_nueva: Number(stock_actual),
          us_cod,
          observaciones: 'Stock inicial al crear insumo'
        }, { transaction: t })
      }

      return await this.getInsumoById(insumo.insumo_id)
    })
  }

  // =========================
  // ACTUALIZAR INSUMO
  // =========================
  static async updateInsumo(insumo_id, data) {
    return await sequelize.transaction(async (t) => {
      const insumo = await Insumos.findByPk(insumo_id, { transaction: t })
      
      if (!insumo) {
        throw new Error('Insumo no encontrado')
      }

      const {
        insumo_nombre,
        insumo_descripcion,
        unidad_medida,
        stock_minimo,
        insumo_activo
      } = data

      await insumo.update({
        insumo_nombre,
        insumo_descripcion,
        unidad_medida,
        stock_minimo,
        insumo_activo,
        fecha_modificacion: new Date()
      }, { transaction: t })

      return await this.getInsumoById(insumo_id)
    })
  }

  // =========================
  // AJUSTAR STOCK MANUALMENTE (DUEÑO)
  // =========================
  static async ajustarStock(insumo_id, cantidad_nueva, us_cod, observaciones = null) {
    return await sequelize.transaction(async (t) => {
      const insumo = await Insumos.findByPk(insumo_id, { transaction: t })
      
      if (!insumo) {
        throw new Error('Insumo no encontrado')
      }

      const stockAnterior = Number(insumo.stock_actual)
      const stockNuevo = Number(cantidad_nueva)
      const movimiento = stockNuevo - stockAnterior

      // Actualizar stock
      await insumo.update({
        stock_actual: stockNuevo,
        fecha_modificacion: new Date()
      }, { transaction: t })

      // Registrar en historial
      await HistorialStock.create({
        insumo_id,
        tipo_movimiento: 'AJUSTE_MANUAL',
        cantidad_anterior: stockAnterior,
        cantidad_movimiento: movimiento,
        cantidad_nueva: stockNuevo,
        us_cod,
        observaciones: observaciones || 'Ajuste manual de stock'
      }, { transaction: t })

      return await this.getInsumoById(insumo_id)
    })
  }

  // =========================
  // DESCONTAR STOCK POR VENTA
  // =========================
  static async descontarStockPorVenta(venta_id, ventaItems, transaction = null) {
    const t = transaction || await sequelize.transaction()

    try {
      const movimientos = []

      for (const item of ventaItems) {
        // Obtener receta del producto
        const recetas = await ProductoInsumos.findAll({
          where: { prod_cod: item.prod_cod },
          transaction: t
        })

        // Si no tiene receta, continuar (productos sin insumos)
        if (recetas.length === 0) continue

        // Descontar cada insumo
        for (const receta of recetas) {
          const insumo = await Insumos.findByPk(receta.insumo_id, { transaction: t })
          
          if (!insumo) continue

          const cantidadADescontar = Number(receta.cantidad_requerida) * item.cantidad
          const stockAnterior = Number(insumo.stock_actual)
          const stockNuevo = stockAnterior - cantidadADescontar

          // Actualizar stock (permite negativos para no bloquear venta)
          await insumo.update({
            stock_actual: stockNuevo,
            fecha_modificacion: new Date()
          }, { transaction: t })

          // Registrar movimiento
          await HistorialStock.create({
            insumo_id: insumo.insumo_id,
            tipo_movimiento: 'VENTA',
            cantidad_anterior: stockAnterior,
            cantidad_movimiento: -cantidadADescontar,
            cantidad_nueva: stockNuevo,
            venta_id,
            observaciones: `Venta de ${item.cantidad}x ${item.nombre}`
          }, { transaction: t })

          movimientos.push({
            insumo_id: insumo.insumo_id,
            insumo_nombre: insumo.insumo_nombre,
            stock_anterior: stockAnterior,
            stock_nuevo: stockNuevo,
            descontado: cantidadADescontar
          })
        }
      }

      if (!transaction) {
        await t.commit()
      }

      return movimientos

    } catch (error) {
      if (!transaction) {
        await t.rollback()
      }
      throw error
    }
  }

  // =========================
  // OBTENER INSUMOS CRÍTICOS
  // =========================
  static async getInsumosCriticos(suc_cod) {
    return await Insumos.findAll({
      where: {
        suc_cod,
        insumo_activo: true,
        [Op.or]: [
          // Stock por debajo del mínimo
          sequelize.where(
            sequelize.col('stock_actual'),
            Op.lte,
            sequelize.col('stock_minimo')
          ),
          // Stock negativo (inconsistencia)
          { stock_actual: { [Op.lt]: 0 } }
        ]
      },
      order: [
        [sequelize.literal('stock_actual - stock_minimo'), 'ASC']
      ]
    })
  }

  // =========================
  // HISTORIAL DE MOVIMIENTOS
  // =========================
  static async getHistorialStock(insumo_id, { limit = 50 } = {}) {
    return await HistorialStock.findAll({
      where: { insumo_id },
      include: [{
        model: Usuarios,
        as: 'Usuario',
        attributes: ['us_nomape']
      }],
      order: [['fecha_movimiento', 'DESC']],
      limit
    })
  }

  // =========================
  // ELIMINAR (DESACTIVAR)
  // =========================
  static async deleteInsumo(insumo_id) {
    const insumo = await Insumos.findByPk(insumo_id)
    
    if (!insumo) {
      throw new Error('Insumo no encontrado')
    }

    // Verificar si está siendo usado en recetas
    const recetas = await ProductoInsumos.count({
      where: { insumo_id }
    })

    if (recetas > 0) {
      // No eliminar físicamente, solo desactivar
      await insumo.update({ insumo_activo: false })
      return { 
        message: 'Insumo desactivado (está siendo usado en recetas)',
        desactivado: true 
      }
    }

    // Si no está en uso, eliminar
    await insumo.destroy()
    return { 
      message: 'Insumo eliminado correctamente',
      eliminado: true 
    }
  }
}

export default InsumosController