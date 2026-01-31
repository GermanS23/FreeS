import sequelize from '../config/database.js'

import Ventas from '../models/ventas.js'
import VentasItems from '../models/ventas_items.js'
import Productos from '../models/productos.js'
import DescuentoVentas from '../models/descuentoventas.js'

class VentasController {

  // =========================
  // OBTENER O CREAR VENTA ACTUAL (POS)
  // =========================
  static async getVentaActualPorSucursal(suc_cod) {
    let venta = await Ventas.findOne({
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

    if (!venta) {
      venta = await Ventas.create({
        suc_cod,
        venta_estado: 'ABIERTA',
        venta_subtotal: 0,
        descuento: 0,
        venta_total: 0,
      })

      venta = await Ventas.findByPk(venta.venta_id, {
        include: [
          { model: VentasItems, as: 'Items' },
          { model: DescuentoVentas, as: 'Descuentos' },
        ],
      })
    }

    return venta
  }

  // =========================
  // GET ALL POR SUCURSAL
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
  // AGREGAR PRODUCTO
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

      await VentasItems.create({
        venta_id,
        prod_cod,
        nombre: producto.prod_nom,
        cantidad,
        precio_unitario: precio,
        subtotal: precio * cantidad,
      }, { transaction: t })

      await this.recalcularTotales(venta_id, t)

      return await this.getVentaById(venta_id, t)
    })
  }

  // =========================
  // RECALCULAR TOTALES
  // =========================
  static async recalcularTotales(venta_id, transaction) {

    // Subtotal
    const items = await VentasItems.findAll({
      where: { venta_id },
      transaction,
    })

    const subtotal = items.reduce(
      (acc, i) => acc + Number(i.subtotal),
      0
    )

    // Descuento (ya calculado en descuento_ventas)
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
  // CERRAR VENTA
  // =========================
  static async cerrarVenta(venta_id) {
    return await sequelize.transaction(async (t) => {

      const venta = await Ventas.findByPk(venta_id, {
        include: [
          { model: VentasItems, as: 'Items' },
          { model: DescuentoVentas, as: 'Descuentos' },
        ],
        transaction: t,
      })

      if (!venta || venta.venta_estado !== 'ABIERTA') {
        throw new Error('No se puede cerrar la venta')
      }

      await Ventas.update({
        venta_estado: 'CERRADA',
        venta_fecha_cierre: new Date(),
      }, {
        where: { venta_id },
        transaction: t,
      })

      return await this.getVentaById(venta_id, t)
    })
  }

  // =========================
  // HELPERS
  // =========================
  static async getVentaById(venta_id, transaction = null) {
    return await Ventas.findByPk(venta_id, {
      include: [
        { model: VentasItems, as: 'Items' },
        { model: DescuentoVentas, as: 'Descuentos' },
      ],
      transaction,
    })
  }
}

export default VentasController
