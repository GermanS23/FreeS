import MetodosPago from '../models/metodospago.js'

class MetodosPagoController {

  // =========================
  // LISTAR MÉTODOS ACTIVOS
  // =========================
  static async getMetodosActivos() {
    return await MetodosPago.findAll({
      where: { mp_activo: true },
      order: [['mp_nombre', 'ASC']]
    })
  }

  // =========================
  // LISTAR TODOS (ADMIN)
  // =========================
  static async getAll() {
    return await MetodosPago.findAll({
      order: [['mp_nombre', 'ASC']]
    })
  }

  // =========================
  // OBTENER POR ID
  // =========================
  static async getById(mp_cod) {
    const metodo = await MetodosPago.findByPk(mp_cod)
    if (!metodo) throw new Error('Método de pago no encontrado')
    return metodo
  }

  // =========================
  // CREAR MÉTODO
  // =========================
  static async create({ mp_nombre }) {
    // Validar nombre único
    const existe = await MetodosPago.findOne({
      where: { mp_nombre }
    })

    if (existe) {
      throw new Error('Ya existe un método de pago con ese nombre')
    }

    return await MetodosPago.create({ mp_nombre })
  }

  // =========================
  // ACTUALIZAR
  // =========================
  static async update(mp_cod, { mp_nombre, mp_activo }) {
    const metodo = await MetodosPago.findByPk(mp_cod)
    if (!metodo) throw new Error('Método de pago no encontrado')

    // Si cambia nombre, validar que no exista
    if (mp_nombre && mp_nombre !== metodo.mp_nombre) {
      const existe = await MetodosPago.findOne({
        where: { mp_nombre }
      })
      if (existe) {
        throw new Error('Ya existe un método de pago con ese nombre')
      }
    }

    await metodo.update({
      ...(mp_nombre && { mp_nombre }),
      ...(mp_activo !== undefined && { mp_activo })
    })

    return metodo
  }

  // =========================
  // ELIMINAR (SOFT DELETE)
  // =========================
  static async delete(mp_cod) {
    const metodo = await MetodosPago.findByPk(mp_cod)
    if (!metodo) throw new Error('Método de pago no encontrado')

    // Desactivar en lugar de eliminar (por integridad referencial)
    await metodo.update({ mp_activo: false })

    return { message: 'Método de pago desactivado' }
  }
}

export default MetodosPagoController