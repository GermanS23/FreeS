import Usuarios from '../models/usuarios.js';
import Roles from '../models/roles.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import jwt from 'jsonwebtoken';
import config from '../config/auth.config.js';
import Page from '../utils/getPagingData.js';
import { Op } from 'sequelize';
import UsuariosSucursales from '../models/usuariosSucursales.js';
import Sucursales from '../models/sucursales.js';


const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el Usuario');
  }
};

const getUsuariosById = async (req, res) => {
  try { // Añadir try-catch para un mejor manejo de errores
    const usuarios = await Usuarios.findByPk(req.params.us_cod, {
      include: [{
        model: Sucursales, // Incluye el modelo de Sucursales
        through: { model: UsuariosSucursales, attributes: [] }, // Usa la tabla intermedia sin atributos adicionales
        as: 'Sucursales' // Asegúrate de que este 'as' coincida con el alias en tu asociación (verificar en Usuarios.js)
      }]
    });
    if (usuarios) {
      res.json(usuarios);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el Usuario por ID');
  }
};

const createUsuario = async (req, res) => {
  try {
    const { us_user, us_pass, us_nomape, us_email, us_tel, roles_rol_cod, sucursales } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const usuarioCreando = await Usuarios.findByPk(req.user.id);

    if (!usuarioCreando) {
      return res.status(404).json({ message: 'Usuario creador no encontrado' });
    }

    const rolCreando = await Roles.findByPk(usuarioCreando.roles_rol_cod);
    const rolNuevo = await Roles.findByPk(roles_rol_cod);

    // Lógica para validar la jerarquía de roles (mantengo tu lógica existente)
    let canCreateUser = false;
    if (rolCreando.rol_desc === 'ADMIN') {
      canCreateUser = true;
    } else if (rolCreando.rol_desc === 'DUEÑO') {
      if (rolNuevo.rol_desc === 'ENCARGADO') {
        canCreateUser = true;
      } else {
        return res.status(403).json({ message: 'Un dueño solo puede crear usuarios con el rol de Encargado' });
      }
    } else if (rolCreando.rol_desc === 'ENCARGADO') {
      return res.status(403).json({ message: 'Un encargado no puede crear usuarios' });
    } else {
      return res.status(403).json({ message: 'No tienes permisos para crear usuarios' });
    }

    if (canCreateUser) {
      const hashedPassword = await hashPassword(us_pass, 10);

      const nuevoUsuario = await Usuarios.create({
        us_nomape,
        us_user,
        us_email,
        us_tel,
        roles_rol_cod,
        us_pass: hashedPassword,
      });

      // Asociar el usuario con las sucursales (si se proporcionan)
      if (sucursales && Array.isArray(sucursales) && sucursales.length > 0) {
        await Promise.all(sucursales.map(suc_cod =>
          UsuariosSucursales.create({
            // Asegúrate de que estos nombres de columna sean los correctos
            // Basado en tu error anterior: 'UsuarioUsCod' y 'SucursaleSucCod'
            UsuarioUsCod: nuevoUsuario.us_cod,    
            SucursaleSucCod: suc_cod,             
          })
        ));
      }

      const usuarioConSucursales = await Usuarios.findByPk(nuevoUsuario.us_cod, {
        include: [{
          model: Sucursales,
          through: { model: UsuariosSucursales, attributes: [] },
          as: 'Sucursales'
        }]
      });

      return res.status(201).json(usuarioConSucursales); // Usa return aquí
    }
  } catch (error) {
    console.error(error); // MUY IMPORTANTE: Ver el error completo en tu consola de Node.js

    // Manejo específico del error de restricción de unicidad
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0].path; // Obtiene el nombre del campo que causó el error (ej: 'us_email')
      let message = 'Ya existe un usuario con la información proporcionada.';
      
      if (field === 'us_email') {
        message = 'El correo electrónico ya está registrado.';
      } else if (field === 'us_user') { // Si tu campo de usuario también es único
        message = 'El nombre de usuario ya está en uso.';
      }
      
      return res.status(409).json({ message }); // 409 Conflict es un código de estado apropiado
    }

    // Manejo genérico para otros errores
    return res.status(500).send('Error al crear el usuario');
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { us_pass, sucursales, ...restOfBody } = req.body; // Extraer sucursales y posible us_pass

    const usuario = await Usuarios.findByPk(req.params.us_cod);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Si se proporciona una nueva contraseña, hashearla
    if (us_pass) {
      restOfBody.us_pass = await hashPassword(us_pass, 10);
    }

    await usuario.update(restOfBody); // Actualizar los campos del usuario

    // --- Manejo de la relación con sucursales ---
    if (sucursales !== undefined) { // Solo si se envían sucursales en el request
      // Eliminar todas las asociaciones existentes del usuario con sucursales
      await UsuariosSucursales.destroy({
        where: {
          UsuarioUsCod: usuario.us_cod // Asegúrate de que 'UsuarioUsCod' es el nombre correcto de la FK
        }
      });

      // Crear nuevas asociaciones si se proporcionaron sucursales
      if (Array.isArray(sucursales) && sucursales.length > 0) {
        await Promise.all(sucursales.map(suc_cod =>
          UsuariosSucursales.create({
            UsuarioUsCod: usuario.us_cod,    // Usar el nombre de columna correcto
            SucursaleSucCod: suc_cod,        // Usar el nombre de columna correcto
          })
        ));
      }
    }
    // --- Fin manejo de sucursales ---

    // Opcional: Volver a buscar el usuario con las sucursales actualizadas para la respuesta
    const usuarioActualizado = await Usuarios.findByPk(usuario.us_cod, {
      include: [{
        model: Sucursales,
        through: { model: UsuariosSucursales, attributes: [] },
        as: 'Sucursales'
      }]
    });

    res.json(usuarioActualizado);

  } catch (error) {
    console.error(error);
    // Manejo específico para UniqueConstraintError en actualización (similar al de creación)
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      let message = 'Ya existe un usuario con la información proporcionada.';
      if (field === 'us_email') {
        message = 'El correo electrónico ya está registrado.';
      } else if (field === 'us_user') {
        message = 'El nombre de usuario ya está en uso.';
      }
      return res.status(409).json({ message });
    }
    res.status(500).send('Error al actualizar el Usuario');
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const td = await Usuarios.findByPk(req.params.us_cod);
    if (td) {
      await td.destroy();
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el Usuario');
  }
};

const login = async (req, res) => {
  try {
    const { us_user, us_pass } = req.body;

    const user = await Usuarios.findOne({ where: { us_user } });

    if (!user) {
      return res.status(404).send({ message: 'Usuario incorrecto!' });
    }

    const passwordIsValid = await comparePassword(req.body.us_pass, user.us_pass);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Contraseña Incorrecta!',
      });
    }

    const token = jwt.sign({ id: user.us_cod }, config.secretkey, {
      expiresIn: config.tokenExpiration,
    });

    res.status(200).send({
      id: user.us_cod, 
      us_cod: user.us_cod,  
      us_user: user.us_user,
      us_email: user.us_email,
      rol: user.roles_rol_cod,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const usList = async (req, res) => {
  let { page, size, title } = req.query;
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  if (title == undefined) {
    title = '';
  }

  Usuarios.findAndCountAll({
    include: [
      {
        model: Roles,
        as: 'roles',
      },
    ],
    where: {
      [Op.or]: [
        {
          us_user: {
            [Op.like]: '%' + title + '%',
          },
        },
        {
          us_nomape: {
            [Op.like]: '%' + title + '%',
          },
        },
      ],
    },
    order: [['us_cod', 'DESC']],
    limit,
    offset,
  })
    .then((data) => {
      const response = new Page(data, Number(req.query.page), limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving tutorials.',
      });
    });
};

export default {
  getUsuarios,
  getUsuariosById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  login,
  usList,
};