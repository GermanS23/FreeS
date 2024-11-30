import express from 'express'
import dotenv from 'dotenv'
import sequelize from './config/database.js'
import cors from 'cors'
import bcryp from 'bcrypt'
// Importar las rutas de los controladores
import { rolesRouter, catprodRouter, catsabRouter, usuariosController, tdController, sucursalesController } from './routes/routes.js'
// importar las asociaciones
import './models/associations.js'
import Usuarios from './models/usuarios.js'
import Rol from './models/roles.js'

dotenv.config() // Cargamos variables de entorno al inicio de la aplicación

const app = express()

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173' ],
  methods: 'GET, POST, PUT, DELETE'
}))
app.use(express.json())

app.use('/api', rolesRouter)
app.use('/api', catprodRouter)
app.use('/api', catsabRouter)
app.use('/api', sucursalesController)
app.use('/api', tdController)
app.use('/api', usuariosController)

//initial();


const PORT = process.env.PORT ?? 3000;
((async () => {
  try {
    await sequelize.authenticate()
    console.log('Conexión a la base de datos establecida correctamente.');
  // Sincroniza todos los modelos con la base de datos
    await sequelize.sync() 
    console.log("Modelos sincronizados con exito")
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error)
  }
})())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


function initial() {

  Rol.create({
    rol_cod:4,
    rol_desc:"ADMIN"
  })



  Usuarios.create({
    us_cod: 1,
    us_user: "admin",
    us_pass: bcryp.hashSync("123456",10),
    us_nomape: "German Uriel Sanchez",
    us_email: "german99sanchez@gmail.com",
    us_tel: "3482297539",
    roles_rol_cod: 4
  })

}