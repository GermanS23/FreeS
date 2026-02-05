import sequelize from '../config/database.js'
import Cajas from '../models/cajas.js'
import Ventas from '../models/ventas.js'
import VentaPagos from '../models/ventapagos.js'
import MetodosPago from '../models/metodospago.js'
import Usuarios from '../models/usuarios.js'

class CajasController {

  // =========================
  // ABRIR CAJA
  // =========================
  static async abrirCaja({ suc_cod, us_cod, monto_inicial }) {
    return await sequelize.transaction(async (t) => {

      // Verificar que no haya caja abierta en esta sucursal
      const cajaAbierta = await Cajas.findOne({
        where: {
          suc_cod,
          caja_estado: 'ABIERTA'
        },
        transaction: t
      })

      if (cajaAbierta) {
        throw new Error('Ya existe una caja abierta en esta sucursal')
      }

      // Crear nueva caja
      const caja = await Cajas.create({
        suc_cod,
        us_cod,
        caja_monto_inicial: monto_inicial || 0,
        caja_estado: 'ABIERTA'
      }, { transaction: t })

      return await this.getCajaById(caja.caja_id, t)
    })
  }

  // =========================
  // OBTENER CAJA ABIERTA POR SUCURSAL
  // =========================
  static async getCajaAbiertaPorSucursal(suc_cod) {
    return await Cajas.findOne({
      where: {
        suc_cod,
        caja_estado: 'ABIERTA'
      },
      include: [
        { 
          model: Usuarios, 
          as: 'Usuario',
          attributes: ['us_cod', 'us_nomape']
        }
      ],
      order: [['caja_fecha_apertura', 'DESC']]
    })
  }

  // =========================
  // CERRAR CAJA (ARQUEO)
  // =========================
  static async cerrarCaja({ caja_id, monto_efectivo_real, observaciones }) {
    return await sequelize.transaction(async (t) => {

      const caja = await Cajas.findByPk(caja_id, { transaction: t })
      if (!caja) throw new Error('Caja no encontrada')
      if (caja.caja_estado !== 'ABIERTA') {
        throw new Error('La caja ya está cerrada')
      }

      // 📊 CALCULAR TOTALES DE VENTAS
      const ventas = await Ventas.findAll({
        where: {
          caja_id,
          venta_estado: 'CERRADA'
        },
        transaction: t
      })

      const totalVentas = ventas.reduce(
        (sum, v) => sum + Number(v.venta_total),
        0
      )

      // 💰 CALCULAR TOTAL EN EFECTIVO ESPERADO
      const ventasIds = ventas.map(v => v.venta_id)

      let totalEfectivoEsperado = Number(caja.caja_monto_inicial)

      if (ventasIds.length > 0) {
        const pagosEfectivo = await VentaPagos.findAll({
          where: { venta_id: ventasIds },
          include: [{
            model: MetodosPago,
            as: 'MetodoPago',
            where: { mp_nombre: 'Efectivo' }
          }],
          transaction: t
        })

        const sumaEfectivo = pagosEfectivo.reduce(
          (sum, p) => sum + Number(p.vp_monto),
          0
        )

        totalEfectivoEsperado += sumaEfectivo
      }

      // 🔍 CALCULAR DIFERENCIA
      const efectivoReal = Number(monto_efectivo_real)
      const diferencia = efectivoReal - totalEfectivoEsperado

      // 🔒 CERRAR CAJA
      await caja.update({
        caja_fecha_cierre: new Date(),
        caja_total_ventas: totalVentas,
        caja_total_efectivo_esperado: totalEfectivoEsperado,
        caja_total_efectivo_real: efectivoReal,
        caja_monto_final: efectivoReal,
        caja_diferencia: diferencia,
        caja_estado: 'CERRADA',
        caja_observaciones: observaciones || null
      }, { transaction: t })

      return await this.getCajaById(caja_id, t)
    })
  }

  // =========================
  // OBTENER RESUMEN DE CAJA ABIERTA
  // =========================
  static async getResumenCajaAbierta(caja_id) {
    const caja = await Cajas.findByPk(caja_id)
    if (!caja) throw new Error('Caja no encontrada')

    // Ventas de esta caja
    const ventas = await Ventas.findAll({
      where: {
        caja_id,
        venta_estado: 'CERRADA'
      }
    })

    const totalVentas = ventas.reduce(
      (sum, v) => sum + Number(v.venta_total),
      0
    )

    const cantidadVentas = ventas.length

    // Pagos por método
    const ventasIds = ventas.map(v => v.venta_id)

    let pagosPorMetodo = []

    if (ventasIds.length > 0) {
      const pagos = await VentaPagos.findAll({
        where: { venta_id: ventasIds },
        include: [{
          model: MetodosPago,
          as: 'MetodoPago'
        }]
      })

      // Agrupar por método
      const grupos = {}

      pagos.forEach(pago => {
        const metodo = pago.MetodoPago?.mp_nombre || 'Desconocido'
        if (!grupos[metodo]) {
          grupos[metodo] = 0
        }
        grupos[metodo] += Number(pago.vp_monto)
      })

      pagosPorMetodo = Object.entries(grupos).map(([metodo, total]) => ({
        metodo,
        total: Number(total.toFixed(2))
      }))
    }

    // Efectivo esperado
    const efectivoEsperado = Number(caja.caja_monto_inicial) + 
      (pagosPorMetodo.find(p => p.metodo === 'Efectivo')?.total || 0)

    return {
      caja_id: caja.caja_id,
      caja_fecha_apertura: caja.caja_fecha_apertura,
      caja_monto_inicial: Number(caja.caja_monto_inicial),
      cantidad_ventas: cantidadVentas,
      total_ventas: Number(totalVentas.toFixed(2)),
      pagos_por_metodo: pagosPorMetodo,
      efectivo_esperado: Number(efectivoEsperado.toFixed(2)),
      caja_estado: caja.caja_estado
    }
  }

  // =========================
  // HISTORIAL DE CAJAS
  // =========================
  static async getCajasPorSucursal(suc_cod, { page = 0, size = 20 } = {}) {
    const offset = page * size

    const { count, rows } = await Cajas.findAndCountAll({
      where: { suc_cod },
      include: [{
        model: Usuarios,
        as: 'Usuario',
        attributes: ['us_cod', 'us_nomape']
      }],
      order: [['caja_fecha_apertura', 'DESC']],
      limit: size,
      offset
    })

    return {
      cajas: rows,
      total: count,
      totalPages: Math.ceil(count / size),
      currentPage: page
    }
  }

  // =========================
  // OBTENER CAJA POR ID
  // =========================
  static async getCajaById(caja_id, transaction = null) {
    return await Cajas.findByPk(caja_id, {
      include: [
        {
          model: Usuarios,
          as: 'Usuario',
          attributes: ['us_cod', 'us_nomape', 'us_user']
        },
        {
          model: Ventas,
          as: 'Ventas',
          where: { venta_estado: 'CERRADA' },
          required: false
        }
      ],
      transaction
    })
  }

  // =========================
  // ELIMINAR CAJA (SOLO SI ESTÁ VACÍA)
  // =========================
  static async eliminarCaja(caja_id) {
    return await sequelize.transaction(async (t) => {

      const caja = await Cajas.findByPk(caja_id, { transaction: t })
      if (!caja) throw new Error('Caja no encontrada')

      // Verificar que no tenga ventas
      const ventas = await Ventas.count({
        where: { caja_id },
        transaction: t
      })

      if (ventas > 0) {
        throw new Error('No se puede eliminar una caja con ventas registradas')
      }

      await caja.destroy({ transaction: t })

      return { message: 'Caja eliminada correctamente' }
    })
  }
}

export default CajasController