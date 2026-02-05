// controllers/VentasController.js
import sequelize from '../config/database.js'

import Ventas from '../models/ventas.js'
import VentasItems from '../models/ventas_items.js'
import Productos from '../models/productos.js'
import DescuentoVentas from '../models/descuentoventas.js'
import VentaPagos from '../models/ventapagos.js'
import MetodosPago from '../models/metodospago.js'
import Cajas from '../models/cajas.js'
class VentasController {

  // =========================
  // VER SI HAY VENTA ABIERTA (POS)
  // =========================
  static async getVentaAbiertaPorSucursal(suc_cod) {
    return await Ventas.findOne({
      where: {
        suc_cod,
        venta_estado: 'ABIERTA',
      },
      include: [
        { model: VentasItems, as: 'Items' },
        { model: DescuentoVentas, as: 'Descuentos' },
      ],
      order: [['venta_fecha', 'DESC']],
    })
  }

  // =========================
  // CREAR NUEVA VENTA (MODIFICADO)
  // =========================
  static async crearVenta({ suc_cod }) {

    const existe = await Ventas.findOne({
      where: {
        suc_cod,
        venta_estado: 'ABIERTA',
      },
    })

    if (existe) {
      throw new Error('Ya existe una venta abierta')
    }

    // 🔹 BUSCAR CAJA ABIERTA
    const cajaAbierta = await Cajas.findOne({
      where: {
        suc_cod,
        caja_estado: 'ABIERTA'
      }
    })

    if (!cajaAbierta) {
      throw new Error('No hay una caja abierta en esta sucursal. Debe abrir caja primero.')
    }

    // 🔹 CREAR VENTA VINCULADA A LA CAJA
    const venta = await Ventas.create({
      suc_cod,
      caja_id: cajaAbierta.caja_id,  // ✅ Vincular a caja
      venta_estado: 'ABIERTA',
      venta_subtotal: 0,
      descuento: 0,
      venta_total: 0,
    })

    return await this.getVentaById(venta.venta_id)
  }

  // =========================
  // AGREGAR PRODUCTO (CON AGRUPACIÓN)
  // =========================
  static async agregarProducto({ venta_id, prod_cod, cantidad = 1 }) {
    return await sequelize.transaction(async (t) => {

      const venta = await Ventas.findByPk(venta_id, { transaction: t })
      if (!venta) throw new Error('Venta no encontrada')
      if (venta.venta_estado !== 'ABIERTA') {
        throw new Error('La venta está cerrada')
      }

      const producto = await Productos.findByPk(prod_cod, { transaction: t })
      if (!producto) throw new Error('Producto inexistente')

      const precio = Number(producto.prod_pre)

      // 🔹 BUSCAR SI YA EXISTE EL PRODUCTO EN LA VENTA
      const itemExistente = await VentasItems.findOne({
        where: { venta_id, prod_cod },
        transaction: t
      })

      if (itemExistente) {
        // 🔹 INCREMENTAR CANTIDAD
        const nuevaCantidad = itemExistente.cantidad + cantidad
        const nuevoSubtotal = precio * nuevaCantidad

        await itemExistente.update({
          cantidad: nuevaCantidad,
          subtotal: nuevoSubtotal
        }, { transaction: t })
      } else {
        // 🔹 CREAR NUEVO ITEM
        await VentasItems.create({
          venta_id,
          prod_cod,
          nombre: producto.prod_nom,
          cantidad,
          precio_unitario: precio,
          subtotal: precio * cantidad,
        }, { transaction: t })
      }

      await this.recalcularTotales(venta_id, t)

      return await this.getVentaById(venta_id, t)
    })
  }

  // =========================
  // RECALCULAR TOTALES
  // =========================
  static async recalcularTotales(venta_id, transaction) {

    const items = await VentasItems.findAll({
      where: { venta_id },
      transaction,
    })

    const subtotal = items.reduce(
      (acc, i) => acc + Number(i.subtotal),
      0
    )

    const descuentoRow = await DescuentoVentas.findOne({
      where: { venta_id },
      transaction,
    })

    const descuento = descuentoRow
      ? Number(descuentoRow.importe_aplicado)
      : 0

    const total = Math.max(subtotal - descuento, 0)

    await Ventas.update({
      venta_subtotal: subtotal,
      descuento,
      venta_total: total,
    }, {
      where: { venta_id },
      transaction,
    })
  }
// =========================
// ELIMINAR ITEM DE VENTA
// =========================
static async eliminarItem(venta_items_id) {
  return await sequelize.transaction(async (t) => {
    
    const item = await VentasItems.findByPk(venta_items_id, { transaction: t })
    if (!item) throw new Error('Item no encontrado')

    const venta_id = item.venta_id

    // Verificar que la venta esté abierta
    const venta = await Ventas.findByPk(venta_id, { transaction: t })
    if (!venta || venta.venta_estado !== 'ABIERTA') {
      throw new Error('No se puede modificar una venta cerrada')
    }

    // Eliminar el item
    await item.destroy({ transaction: t })

    // Recalcular totales
    await this.recalcularTotales(venta_id, t)

    return await this.getVentaById(venta_id, t)
  })
}

// =========================
// MODIFICAR CANTIDAD DE ITEM
// =========================
static async modificarCantidadItem({ venta_items_id, cantidad }) {
  return await sequelize.transaction(async (t) => {
    
    const item = await VentasItems.findByPk(venta_items_id, { transaction: t })
    if (!item) throw new Error('Item no encontrado')

    const venta_id = item.venta_id

    // Verificar que la venta esté abierta
    const venta = await Ventas.findByPk(venta_id, { transaction: t })
    if (!venta || venta.venta_estado !== 'ABIERTA') {
      throw new Error('No se puede modificar una venta cerrada')
    }

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0')
    }

    // Actualizar cantidad y subtotal
    const nuevoSubtotal = Number(item.precio_unitario) * cantidad
    await item.update({
      cantidad,
      subtotal: nuevoSubtotal
    }, { transaction: t })

    // Recalcular totales
    await this.recalcularTotales(venta_id, t)

    return await this.getVentaById(venta_id, t)
  })
}

// =========================
// CANCELAR VENTA
// =========================
static async cancelarVenta(venta_id) {
  return await sequelize.transaction(async (t) => {

    const venta = await Ventas.findByPk(venta_id, { transaction: t })
    if (!venta) throw new Error('Venta no encontrada')
    if (venta.venta_estado !== 'ABIERTA') {
      throw new Error('Solo se pueden cancelar ventas abiertas')
    }

    // Eliminar todos los items
    await VentasItems.destroy({
      where: { venta_id },
      transaction: t
    })

    // Eliminar descuentos
    await DescuentoVentas.destroy({
      where: { venta_id },
      transaction: t
    })

    // Marcar como cancelada
    await Ventas.update({
      venta_estado: 'CANCELADA',
      venta_fecha_cierre: new Date(),
    }, {
      where: { venta_id },
      transaction: t
    })

    return await this.getVentaById(venta_id, t)
  })
}
  // =========================
  // CERRAR VENTA (MODIFICADO)
  // =========================
  static async cerrarVenta(venta_id, pagos) {
    return await sequelize.transaction(async (t) => {

      const venta = await Ventas.findByPk(venta_id, { transaction: t })
      if (!venta || venta.venta_estado !== 'ABIERTA') {
        throw new Error('No se puede cerrar la venta')
      }

      // 🔹 VALIDAR QUE HAYA ITEMS
      const items = await VentasItems.findAll({
        where: { venta_id },
        transaction: t
      })

      if (items.length === 0) {
        throw new Error('No se puede cerrar una venta sin productos')
      }

      // 🔹 VALIDAR PAGOS
      if (!pagos || !Array.isArray(pagos) || pagos.length === 0) {
        throw new Error('Debe especificar al menos un método de pago')
      }

      // Calcular suma de pagos
      const totalPagos = pagos.reduce((sum, p) => sum + Number(p.monto), 0)
      const totalVenta = Number(venta.venta_total)

      // Validar que coincidan (con tolerancia de 0.01 por redondeos)
      if (Math.abs(totalPagos - totalVenta) > 0.01) {
        throw new Error(
          `El total de pagos ($${totalPagos.toFixed(2)}) no coincide con el total de la venta ($${totalVenta.toFixed(2)})`
        )
      }

      // 🔹 REGISTRAR PAGOS
      for (const pago of pagos) {
        // Validar que el método de pago exista y esté activo
        const metodo = await MetodosPago.findOne({
          where: { mp_cod: pago.mp_cod, mp_activo: true },
          transaction: t
        })

        if (!metodo) {
          throw new Error(`Método de pago inválido: ${pago.mp_cod}`)
        }

        if (Number(pago.monto) <= 0) {
          throw new Error('El monto de pago debe ser mayor a 0')
        }

        await VentaPagos.create({
          venta_id,
          mp_cod: pago.mp_cod,
          vp_monto: pago.monto
        }, { transaction: t })
      }

      // 🔹 CERRAR VENTA
      await Ventas.update({
        venta_estado: 'CERRADA',
        venta_fecha_cierre: new Date(),
      }, {
        where: { venta_id },
        transaction: t,
      })

      // Retornar venta completa con pagos
      return await this.getVentaById(venta_id, t)
    })
  }


  // =========================
  // HISTÓRICO
  // =========================
  static async getVentasPorSucursal(suc_cod) {
    return await Ventas.findAll({
      where: { suc_cod },
      include: [
        { model: VentasItems, as: 'Items' },
        { model: DescuentoVentas, as: 'Descuentos' },
      ],
      order: [['venta_fecha', 'DESC']],
    })
  }

 
  // =========================
  // HELPERS (MODIFICAR)
  // =========================
  static async getVentaById(venta_id, transaction = null) {
    return await Ventas.findByPk(venta_id, {
      include: [
        { model: VentasItems, as: 'Items' },
        { model: DescuentoVentas, as: 'Descuentos' },
        { 
          model: VentaPagos, 
          as: 'Pagos',
          include: [{ model: MetodosPago, as: 'MetodoPago' }]
        }
      ],
      transaction,
    })
  }
}

export default VentasController