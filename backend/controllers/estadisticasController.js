import sequelize from '../config/database.js'
import { Op } from 'sequelize'
import Ventas from '../models/ventas.js'
import VentasItems from '../models/ventas_items.js'
import Productos from '../models/productos.js'
import Cajas from '../models/cajas.js'
import VentaPagos from '../models/ventapagos.js'
import MetodosPago from '../models/metodospago.js'
import Usuarios from '../models/usuarios.js'

class EstadisticasController {

  // =========================
  // RESUMEN GENERAL (HOY)
  // =========================
  static async getResumenHoy(suc_cod) {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    const mañana = new Date(hoy)
    mañana.setDate(mañana.getDate() + 1)

    // Ventas de hoy
    const ventasHoy = await Ventas.findAll({
      where: {
        suc_cod,
        venta_estado: 'CERRADA',
        venta_fecha: {
          [Op.gte]: hoy,
          [Op.lt]: mañana
        }
      }
    })

    const totalVentas = ventasHoy.reduce((sum, v) => sum + Number(v.venta_total), 0)
    const cantidadVentas = ventasHoy.length

    // Ticket promedio
    const ticketPromedio = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0

    // Caja actual
    const cajaAbierta = await Cajas.findOne({
      where: { suc_cod, caja_estado: 'ABIERTA' }
    })

    return {
      totalVentas: Number(totalVentas.toFixed(2)),
      cantidadVentas,
      ticketPromedio: Number(ticketPromedio.toFixed(2)),
      cajaAbierta: cajaAbierta ? {
        caja_id: cajaAbierta.caja_id,
        monto_inicial: Number(cajaAbierta.caja_monto_inicial)
      } : null
    }
  }

  // =========================
  // VENTAS POR HORA (HOY)
  // =========================
  static async getVentasPorHora(suc_cod) {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    const mañana = new Date(hoy)
    mañana.setDate(mañana.getDate() + 1)

    const ventas = await Ventas.findAll({
      where: {
        suc_cod,
        venta_estado: 'CERRADA',
        venta_fecha: {
          [Op.gte]: hoy,
          [Op.lt]: mañana
        }
      },
      attributes: ['venta_fecha', 'venta_total']
    })

    // Agrupar por hora
    const ventasPorHora = Array(24).fill(0).map((_, hora) => ({
      hora: `${hora.toString().padStart(2, '0')}:00`,
      total: 0,
      cantidad: 0
    }))

    ventas.forEach(venta => {
      const hora = new Date(venta.venta_fecha).getHours()
      ventasPorHora[hora].total += Number(venta.venta_total)
      ventasPorHora[hora].cantidad += 1
    })

    // Filtrar solo horas con ventas
    return ventasPorHora
      .filter(h => h.cantidad > 0)
      .map(h => ({
        ...h,
        total: Number(h.total.toFixed(2))
      }))
  }

  // =========================
  // PRODUCTOS MÁS VENDIDOS (ÚLTIMOS 7 DÍAS)
  // =========================
  static async getProductosMasVendidos(suc_cod, limit = 10) {
    const hace7Dias = new Date()
    hace7Dias.setDate(hace7Dias.getDate() - 7)

    const productos = await VentasItems.findAll({
      attributes: [
        'prod_cod',
        'nombre',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_vendido'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'ingresos']
      ],
      include: [{
        model: Ventas,
        as: 'Venta',
        where: {
          suc_cod,
          venta_estado: 'CERRADA',
          venta_fecha: {
            [Op.gte]: hace7Dias
          }
        },
        attributes: []
      }],
      group: ['prod_cod', 'nombre'],
      order: [[sequelize.literal('total_vendido'), 'DESC']],
      limit,
      raw: true
    })

    return productos.map(p => ({
      prod_cod: p.prod_cod,
      nombre: p.nombre,
      cantidad: Number(p.total_vendido),
      ingresos: Number(Number(p.ingresos).toFixed(2))
    }))
  }

  // =========================
  // MÉTODOS DE PAGO (ÚLTIMOS 7 DÍAS)
  // =========================
  static async getMetodosPagoStats(suc_cod) {
    const hace7Dias = new Date()
    hace7Dias.setDate(hace7Dias.getDate() - 7)

    const ventas = await Ventas.findAll({
      where: {
        suc_cod,
        venta_estado: 'CERRADA',
        venta_fecha: {
          [Op.gte]: hace7Dias
        }
      },
      attributes: ['venta_id']
    })

    const ventasIds = ventas.map(v => v.venta_id)

    if (ventasIds.length === 0) {
      return []
    }

    const pagos = await VentaPagos.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('VentaPagos.vp_id')), 'cantidad'],
        [sequelize.fn('SUM', sequelize.col('VentaPagos.vp_monto')), 'total']
      ],
      where: {
        venta_id: {
          [Op.in]: ventasIds
        }
      },
      include: [{
        model: MetodosPago,
        as: 'MetodoPago',
        attributes: ['mp_nombre']
      }],
      group: ['MetodoPago.mp_cod', 'MetodoPago.mp_nombre'],
      raw: true
    })

    return pagos.map(p => ({
      metodo: p['MetodoPago.mp_nombre'],
      cantidad: Number(p.cantidad),
      total: Number(Number(p.total).toFixed(2))
    }))
  }

  // =========================
  // VENTAS SEMANALES (ÚLTIMOS 7 DÍAS)
  // =========================
  static async getVentasSemanales(suc_cod) {
    const hace7Dias = new Date()
    hace7Dias.setDate(hace7Dias.getDate() - 7)

    const ventas = await Ventas.findAll({
      where: {
        suc_cod,
        venta_estado: 'CERRADA',
        venta_fecha: {
          [Op.gte]: hace7Dias
        }
      },
      attributes: ['venta_fecha', 'venta_total']
    })

    // Agrupar por día
    const ventasPorDia = {}
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

    ventas.forEach(venta => {
      const fecha = new Date(venta.venta_fecha)
      const dia = fecha.toISOString().split('T')[0]
      
      if (!ventasPorDia[dia]) {
        ventasPorDia[dia] = {
          fecha: dia,
          dia: diasSemana[fecha.getDay()],
          total: 0,
          cantidad: 0
        }
      }
      
      ventasPorDia[dia].total += Number(venta.venta_total)
      ventasPorDia[dia].cantidad += 1
    })

    return Object.values(ventasPorDia)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .map(d => ({
        ...d,
        total: Number(d.total.toFixed(2))
      }))
  }

  // =========================
  // ESTADÍSTICAS DE CAJEROS (MES ACTUAL)
  // =========================
  static async getEstadisticasCajeros(suc_cod) {
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const cajas = await Cajas.findAll({
      where: {
        suc_cod,
        caja_fecha_apertura: {
          [Op.gte]: inicioMes
        }
      },
      include: [{
        model: Usuarios,
        as: 'Usuario',
        attributes: ['us_nomape']
      }],
      attributes: [
        'us_cod',
        [sequelize.fn('COUNT', sequelize.col('caja_id')), 'turnos'],
        [sequelize.fn('SUM', sequelize.col('caja_total_ventas')), 'total_ventas']
      ],
      group: ['us_cod', 'Usuario.us_cod', 'Usuario.us_nomape']
    })

    return cajas.map(c => ({
      cajero: c.Usuario?.us_nomape || 'Desconocido',
      turnos: Number(c.get('turnos')),
      totalVentas: Number(Number(c.get('total_ventas') || 0).toFixed(2))
    }))
  }

  // =========================
  // COMPARATIVA MENSUAL (ÚLTIMOS 6 MESES)
  // =========================
  static async getComparativaMensual(suc_cod) {
    const hace6Meses = new Date()
    hace6Meses.setMonth(hace6Meses.getMonth() - 6)
    hace6Meses.setDate(1)
    hace6Meses.setHours(0, 0, 0, 0)

    const ventas = await Ventas.findAll({
      where: {
        suc_cod,
        venta_estado: 'CERRADA',
        venta_fecha: {
          [Op.gte]: hace6Meses
        }
      },
      attributes: ['venta_fecha', 'venta_total']
    })

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const ventasPorMes = {}

    ventas.forEach(venta => {
      const fecha = new Date(venta.venta_fecha)
      const mesAño = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`
      
      if (!ventasPorMes[mesAño]) {
        ventasPorMes[mesAño] = {
          mes: meses[fecha.getMonth()],
          año: fecha.getFullYear(),
          total: 0,
          cantidad: 0
        }
      }
      
      ventasPorMes[mesAño].total += Number(venta.venta_total)
      ventasPorMes[mesAño].cantidad += 1
    })

    return Object.values(ventasPorMes)
      .sort((a, b) => {
        if (a.año !== b.año) return a.año - b.año
        return meses.indexOf(a.mes) - meses.indexOf(b.mes)
      })
      .map(m => ({
        ...m,
        total: Number(m.total.toFixed(2))
      }))
  }
}

export default EstadisticasController