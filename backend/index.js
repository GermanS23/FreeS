import express from "express"
import dotenv from "dotenv"
import sequelize from "./config/database.js"
import cors from "cors"
import bcryp from "bcrypt"
import path from "path"
import { fileURLToPath } from "url"
import {
  rolesRouter,
  catprodRouter,
  catsabRouter,
  usuariosRouter,
  tdRouter,
  sucursalesRouter,
  sabheladosRouter,
  productosRouter,
  plantillaRouter,
  pantallaRouter,
  authRouter,
  promocionesRouter,
  ventasRouter,
  descuentoventasRouter,
  metodospagoRouter,
  cajasRouter,
  estadisticasRouter,
  insumosRouter,
  recetasRouter,
} from "./routes/routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// importar las asociaciones
import "./models/associations.js"
import Usuarios from "./models/usuarios.js"
import Rol from "./models/roles.js"

//Importar modelo para la inicialización
import { seedMetodosPago } from "./utils/seedMetodosPago.js"
dotenv.config() // Cargamos variables de entorno al inicio de la aplicación

const app = express()

// CORS configurado correctamente - DEBE IR PRIMERO
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true,
  })
)

// Manejar explícitamente las peticiones OPTIONS (preflight)
app.options('*', cors())

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.use("/uploads", express.static(path.join(__dirname, "../frontend/public/uploads")))
console.log("[v0] Sirviendo archivos estáticos desde:", path.join(__dirname, "../frontend/public/uploads"))

app.use("/api", rolesRouter)
app.use("/api", catprodRouter)
app.use("/api", catsabRouter)
app.use("/api", usuariosRouter)
app.use("/api", tdRouter)
app.use("/api", sucursalesRouter)
app.use("/api", sabheladosRouter)
app.use("/api", productosRouter)
app.use("/api", plantillaRouter)
app.use("/api", pantallaRouter)
app.use("/api", authRouter)
app.use("/api", promocionesRouter)
app.use("/api", ventasRouter) 
app.use("/api", descuentoventasRouter) 
app.use("/api", metodospagoRouter)
app.use("/api", cajasRouter)
app.use("/api", estadisticasRouter)
app.use("/api", insumosRouter)
app.use("/api", recetasRouter)
initial(); //Comando para inicializar la base de datos y crear el usuario admin

const PORT = process.env.PORT ?? 3000

;(async () => {
  try {
    await sequelize.authenticate()
    console.log("Conexión a la base de datos establecida correctamente.")
    // Sincroniza todos los modelos con la base de datos
    await sequelize.sync()
    console.log("Modelos sincronizados con exito")
    await seedMetodosPago() // Sembrar métodos de pago iniciales
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error)
  }
})()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


async function initial() {
  
  try {
    await Rol.create({
      rol_cod: 4,
      rol_desc: "ADMIN",
    })
    await Rol.create({
      rol_cod: 2,
      rol_desc: "ENCARGADO",
    })
    await Rol.create({
      rol_cod: 1,
      rol_desc: "DUEÑO",
    })
   await Usuarios.create({
      us_cod: 1,
      us_user: "admin",
      us_pass: bcryp.hashSync("123456", 10),
      us_nomape: "German Uriel Sanchez",
      us_email: "german99sanchez@gmail.com",
      us_tel: "3482297539",
      roles_rol_cod: 4,
    })
    console.log("Usuario creado correctamente") 
  } catch (error) {
    console.error("Error al crear el usuario admin", error)
 
  }
}