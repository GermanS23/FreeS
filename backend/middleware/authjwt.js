import jwt from 'jsonwebtoken'
import config from '../config/auth.config.js'
import Usuarios from '../models/usuarios.js';
import Roles from '../models/roles.js';

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if(!token ){
    return res.status(403).send({message:'No token provided!'});
  }

  jwt.verify(token, config.secretkey, (err, decored) => {
    if(err){
       return res.status(404).send({message:'Acceso denegado'})
    }
    req.userId = decored.id;
    next();
  })
}

const getUserLogger=(req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Acceso denegado por Token Invalido'
      });
    }
    console.log(decoded)
    req.userId = decoded.id;
    next();
  });
};


const permit = (...permittedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await Usuarios.findByPk(req.userId, {
        include: [{
          model: Roles,
          as: 'roles',
          attributes: ['rol_desc']
        }]
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verifica si el usuario tiene roles asignados y obtiene el rol
      if (user.roles) {
        const userRole = user.roles.rol_desc; // Accede al valor del rol
        if (permittedRoles.includes(userRole)) {
          next(); // Permite el acceso si el rol está en la lista permitida
        } else {
          return res.status(403).json({ message: 'Acceso denegado' });
        }
      } else {
        console.log(user.roles)
        return res.status(403).json({ message: 'El usuario no tiene roles asignados' });
      }
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};
const authJwt = {
  verifyToken,
  permit,
  getUserLogger
};

export default authJwt;