const express = require("express");
const passport = require("passport");

const usersRouter = express.Router();

//Crear el método POST para el REGISTRO del nuevo usuario. Nombre del endpoint '/register'
usersRouter.post("/register", (req, res, next) => {
  //Creamos función done que se exportará a la estrategia en passport.js
  const done = (err, user) => {
    if (err) {
      return next(err);
    }
    // El comando req.logIn permite hacer login con el nuevo usuario. Se ejecuta una callback con las acciones posteriores a un login correcto, o el error si se produce alguno durante el login.
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json(`nuevo usuario creado ${user}`);
    });
  };
  //Crear y llamar al autenticador de Usuarios, al ejecutarlo, le paso la función done a la request de la petición actual.
  passport.authenticate("register", done)(req);
});
module.exports = usersRouter;

//Crear el método POST para el LOGIN del nuevo. Nombre del endpoint '/login'
usersRouter.post("/login", (req, res, next) => {
  //Creamos función done que se exportará a la estrategia en passport.js
  const done = (err, user) => {
    if (err) {
      return next(err);
    }
    // El comando req.logIn permite hacer login con el usuario actual. Se ejecuta una callback con las acciones posteriores a un login correcto, o el error si se produce alguno durante el login.
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json(`login exitoso ${user}`);
    });
  };
  //Crear y llamar al autenticador de Usuarios, al ejecutarlo, le paso la función done a la request de la petición actual.
  passport.authenticate("login", done)(req);
});
module.exports = usersRouter;

//Crear el método POST para el LOGOUT
usersRouter.post("/logout", (req, res, next) => {
  if (req.user) {
    //función para desloguear
    req.logOut(() => {
      //función para cerrar session y borrar la cookie
      req.session.destroy(() => {
        res.clearCookie("connect.sid");  //connect.sid es el nombre de la cookie.
        return res.status(200).json("Hasta luego!");
      });
    });
  } else {
    return res.status(304).json("No hay un usuario logueado en este momento");
  }
});
