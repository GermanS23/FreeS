import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import config from '../config/auth.config.js';
import Usuarios from '../models/usuarios.js';
import Roles from '../models/roles.js';

const login = (req, res) => {
    Usuarios.findOne({
        where: {
            us_user: req.body.us_user,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "Usuario no registrado" });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.us_pass,
                user.us_pass 
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Contraseña incorrecta",
                });
            }

            const token = jwt.sign({ id: user.us_cod }, config.secretkey, {
                 expiresIn: 86400 // 24 hours - Puedes agregar expiración si lo deseas
            });

            // Obtener el rol del usuario
            Roles.findByPk(user.roles_rol_cod)
                .then((role) => {
                    res.status(200).send({
                        id: user.us_cod,
                        username: user.us_user,
                        email: user.us_email,
                        roles: role.rol_desc.toUpperCase(), // Obtener el nombre del rol
                        accessToken: token,
                    });
                })
                .catch((err) => {
                    res.status(500).send({ message: err.message });
                });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

const logger = (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "Sin token provisto!",
        });
    }

    jwt.verify(token, config.secretkey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "No autorizado!",
            });
        }
        req.userId = decoded.id;

        Usuarios.findByPk(req.userId, {
            include: [{
                model: Roles,
                as: 'roles',
                attributes: ['rol_desc']
            }]
        })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ message: 'Usuario no encontrado' });
                }
                res.send({ message: "Token OK", body: user });
            })
            .catch((error) => {
                console.log(error);
                res.status(400).send(error);
            });
    });
};

export default { login, logger };