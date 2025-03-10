import jwt from 'jsonwebtoken';
import config from '../config/auth.config.js';
import Usuarios from '../models/usuarios.js';
import Roles from '../models/roles.js';

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secretkey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Acceso denegado' });
    }
    req.user = { id: decoded.id }; // Establecer req.user
    next();
  });
};

const getUserLogger = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secretkey, (err, decoded) => { //Usar config.secretkey
    if (err) {
      return res.status(401).send({ message: 'Acceso denegado por Token Invalido' });
    }
    req.user = { id: decoded.id }; // Establecer req.user
    next();
  });
};

const permit = (...permittedRoles) => {
  return async (req, res, next) => {
    if (req.method === 'OPTIONS') {
      return next(); // Permite solicitudes OPTIONS
    }
    try {
      const user = await Usuarios.findByPk(req.user.id, { // Usar req.user.id
        include: [
          {
            model: Roles,
            as: 'roles',
            attributes: ['rol_desc'],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      if (user.roles) {
        const userRole = user.roles.rol_desc;
        if (permittedRoles.includes(userRole)) {
          next();
        } else {
          return res.status(403).json({ message: 'Acceso denegado' });
        }
      } else {
        console.log(user.roles);
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
  getUserLogger,
};

export default authJwt;