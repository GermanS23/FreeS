import Usuarios from '../models/usuarios.js'
import Roles from '../models/roles.js'
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import jwt from 'jsonwebtoken'
import config from '../config/auth.config.js'
import Page from '../utils/getPagingData.js'
import { Op } from 'sequelize'


const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll()
    res.json(usuarios)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al obtener el Usuario')
  }
}

const getUsuariosById = async (req, res) => {
  const usuarios = await Usuarios.findByPk(req.params.us_cod)
  if (usuarios) {
    res.json(usuarios)
  } else {
    res.status(404).send('Usuario no encontrado')
  }
}

const createUsuario = async (req, res) => {
  try {
      const { us_user, us_pass, us_nomape, us_email, us_tel, roles_rol_cod } = req.body;

      // Validar que el rol del usuario que está creando sea válido según la jerarquía
      const usuarioCreando = await Usuarios.findByPk(req.user.us_cod); // Obtener información del usuario que está realizando la solicitud
      const rolCreando = await Roles.findByPk(usuarioCreando.roles_rol_cod);
      const rolNuevo = await Roles.findByPk(roles_rol_cod);

      // Lógica para validar la jerarquía de roles
      if (rolCreando.rol_desc === 'Admin') {
          // Un administrador puede crear cualquier rol
      } else if (rolCreando.rol_desc === 'Dueño') {
          if (rolNuevo.rol_desc !== 'Encargado') {
              return res.status(403).json({ message: 'Un dueño solo puede crear usuarios con el rol de Encargado' });
          }
      } else {
          return res.status(403).json({ message: 'No tienes permisos para crear usuarios' });
      }


      const hashPassword = await hashPassword(us_pass);

      // Crear el nuevo usuario
      const newUser = await Usuarios.create({
          us_user,
          us_pass: hashPassword,
          us_nomape,
          us_email,
          us_tel,
          roles_rol_cod
      });

      res.status(201).json(newUser);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el usuario');
  }
};

const updateUsuario = async (req, res) => {
  try {
    const usuarios = await Usuarios.findByPk(req.params.us_cod)
    if (usuarios) {
      await usuarios.update(req.body)
      res.json(usuarios)
    } else {
      res.status(404).send('Usuario no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar el Usuario')
  }
  if (req.body.us_pass){
   req.body.us_pass = await hashPassword(req.body.us_pass)
  }
}

const deleteUsuario = async (req, res) => {
  try {
    const td = await Usuarios.findByPk(req.params.us_cod)
    if (td) {
      await td.destroy()
      res.json({ message: 'Usuario eliminado' })
    } else {
      res.status(404).send('Usuario no encontrado')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar el Usuario')
  }
}

const login = async (req, res) => {
  try {
      const { us_user, us_pass } = req.body;

      const user = await Usuarios.findOne({ where: { us_user } });

      if (!user) {
          return res.status(404).send({ message: "Usuario incorrecto!" });
      }

      const passwordIsValid = await comparePassword(req.body.us_pass , user.us_pass);

      if (!passwordIsValid) {
          return res.status(401).send({
              accessToken: null,
              message: "Contraseña Incorrecta!"
          });
      }

      const token = jwt.sign({ id: user.us_cod}, config.secretkey, { expiresIn: 
        config.tokenExpiration }); // tiempo para que el token expire (9 horas)

      res.status(200).send({
          id: user.us_cod,
          us_user: user.us_user,
          us_email: user.us_email,
          rol: user.roles_rol_cod,
          accessToken: token
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
    title = "";
  }

  Usuarios.findAndCountAll({
    include: [
      {
        model: Roles,
        as: "roles"
      }
    ],
    where: {
      [Op.or]: [
        {
          us_user: {
            [Op.like]: "%" + title + "%",
          },
        },
        {
          us_nomape: {
            [Op.like]: "%" + title + "%",
          },
        }
      ],
    },
    order: [["us_cod", "DESC"]],
    limit,
    offset,
  })
    .then((data) => {
      const response = new Page(data, Number(req.query.page), limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
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
  usList
}
