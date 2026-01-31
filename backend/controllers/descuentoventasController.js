import sequelize from '../config/database.js'

import Ventas from '../models/ventas.js'
import VentasItems from '../models/ventas_items.js'
import DescuentoVentas from '../models/descuentoventas.js'
import VentasController from './ventaController.js'

class DescuentoVentasController {

  // =========================
  // APLICAR DESCUENTO
  // =========================
  static async aplicarDescuento({ venta_id, nombre, valor }) {

    return await sequelize.transaction(async (t) => {

      const venta = await Ventas.findByPk(venta_id, {
        include: [{ model: VentasItems, as: 'Items' }],
        transaction: t
      })

      if (!venta) {
        throw new Error('Venta no encontrada')
      }

      if (venta.venta_estado !== 'ABIERTA') {
        throw new Error('La venta está cerrada')
      }

      if (!['FIJO', 'PORCENTAJE'].includes(nombre)) {
        throw new Error('Tipo de descuento inválido')
      }

      if (Number(valor) <= 0) {
        throw new Error('El valor del descuento debe ser mayor a 0')
      }

      const subtotal = venta.Items.reduce(
        (acc, i) => acc + Number(i.subtotal),
        0
      )

      let importe_aplicado = 0

      if (nombre === 'FIJO') {
        importe_aplicado = Number(valor)
      }

      if (nombre === 'PORCENTAJE') {
        importe_aplicado = subtotal * (Number(valor) / 100)
      }

      // 🔒 solo un descuento activo por venta
      await DescuentoVentas.destroy({
        where: { venta_id },
        transaction: t
      })

      await DescuentoVentas.create({
        venta_id,
        nombre,
        valor,
        importe_aplicado
      }, { transaction: t })

      // 🔁 recalcular totales de la venta
      await VentasController.recalcularTotales(venta_id, t)

      // 📤 devolver venta actualizada
      return await VentasController.getVentaById(venta_id, t)
    })
  }

  // =========================
  // QUITAR DESCUENTO
  // =========================
  static async quitarDescuento(venta_id) {
    return await sequelize.transaction(async (t) => {

      await DescuentoVentas.destroy({
        where: { venta_id },
        transaction: t
      })

      await VentasController.recalcularTotales(venta_id, t)

      return await VentasController.getVentaById(venta_id, t)
    })
  }
}

export default DescuentoVentasController
