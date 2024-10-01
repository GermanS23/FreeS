import jwt from 'jsonwebtoken'
import config from '../config/auth.config.js'

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if(!token ){
    return res.status(403).send({message:'No token provided!'});
  }

  jwt.verify(token, config.secretkey, (err, decored) => {
    if(err){
       return res.status(404).send({message:'Unauthorized!'})
    }
    req.userId = decored.id;
    next();
  })
}

const permit = (...permittedRoles) => {
  // return a middleware function
  return (req, res, next) => {
    Usuarios.findByPk(req.us_cod)
      .then((user) => {
        if (user && permittedRoles.includes(user.rol)) {
          next(); // role is allowed, so continue on the next middleware
        } else {
          res.status(403).json({ message: "Forbidden" }); // user is forbidden   

        }
      })
      .catch((error) => {
        console.error(error);
        response.status(500).json({ message: "Internal Server Error" });
      });
  };
};

const authJwt = {
  verifyToken,
  permit,
};

export default authJwt;