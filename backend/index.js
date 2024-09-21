import express from 'express'
import dotenv from 'dotenv'
import sequelize from './config/database.js'
import cors from 'cors'
// Importar las rutas de los controladores
import { rolesRouter, catprodRouter, catsabRouter, usuariosController, tdController, sucursalesController } from './routes/routes.js'
// importar las asociaciones
import './models/associations.js'
dotenv.config() // Cargamos variables de entorno al inicio de la aplicación

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE'
}))
app.use(express.json())

app.use('/api', rolesRouter)
app.use('/api', catprodRouter)
app.use('/api', catsabRouter)
app.use('/api', sucursalesController)
app.use('/api', tdController)
app.use('/api', usuariosController)

const PORT = process.env.PORT ?? 3000;
((async () => {
  try {
    await sequelize.authenticate()
    console.log('Conexión a la base de datos establecida correctamente.')
    await sequelize.sync() // Sincroniza todos los modelos con la base de datos
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error)
  }
})())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
