// utils/seedMetodosPago.js (NUEVO)
import MetodosPago from '../models/metodospago.js'

export async function seedMetodosPago() {
  const metodos = [
    { mp_nombre: 'Efectivo' },
    { mp_nombre: 'Tarjeta Débito' },
    { mp_nombre: 'Tarjeta Crédito' },
    { mp_nombre: 'Transferencia' },
    { mp_nombre: 'Mercado Pago' },
    { mp_nombre: 'Billetera Virtual' },
  ]

  for (const metodo of metodos) {
    const existe = await MetodosPago.findOne({
      where: { mp_nombre: metodo.mp_nombre }
    })

    if (!existe) {
      await MetodosPago.create(metodo)
      console.log(`✓ Método de pago creado: ${metodo.mp_nombre}`)
    }
  }

  console.log('Seed de métodos de pago completado')
}