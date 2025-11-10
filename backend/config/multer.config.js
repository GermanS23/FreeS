// Configuración de Multer para manejo de archivos
// Multer es un middleware de Node.js para manejar multipart/form-data (archivos)

import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Definir la carpeta donde se guardarán las imágenes
// Usamos path.join para crear rutas compatibles con cualquier sistema operativo
const uploadDir = path.join(__dirname, "../../frontend/public/uploads/plantillas")

// Crear la carpeta si no existe
// recursive: true permite crear carpetas anidadas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log(`[v0] Carpeta de uploads creada: ${uploadDir}`)
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  // destination: define dónde se guardarán los archivos
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  // filename: define cómo se nombrarán los archivos
  filename: (req, file, cb) => {
    // Generar un nombre único usando timestamp + número aleatorio
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    // Mantener la extensión original del archivo
    const ext = path.extname(file.originalname)
    // Formato final: plantilla-1234567890-123456789.jpg
    cb(null, "plantilla-" + uniqueSuffix + ext)
  },
})

// Filtro para validar que solo se suban imágenes
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos para imágenes
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

  if (allowedTypes.includes(file.mimetype)) {
    // Archivo válido
    cb(null, true)
  } else {
    // Archivo no válido
    cb(new Error("Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)"), false)
  }
}

// Configuración final de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
  },
})

export default upload
