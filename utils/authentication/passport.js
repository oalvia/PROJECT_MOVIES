const passport = require("passport");
//Importo el modelo para crear de nuevos usuarios.
const User = require("../../Models/Users");
//Importo la dependencia que contiene la estrategia
const LocalStrategy = require("passport-local").Strategy;
//Importo dependencia para encriptar contraseña
const bcrypt = require("bcrypt");
const createError = require("../errors/create-errors");

// Creando autenticador y configuramos la estrategia. La request (req) pasa a la funcion callback.
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    //Funcion callback a ejecutar al registrarse el nuevo usuario.
    //Incluye la función callback "done" que ejecutamos al final del registro.
    async (req, email, password, done) => {
      try {
        //Compruebo que el nuevo usuario no exite en la DB.
        const previousUser = await User.findOne({ email });
        if (previousUser) {
          return done(
            createError("El nombre de usuario ya existe, debes iniciar sesión")
          );
        }

        //Función para encriptar los datos, con 10 iteraciones.
        const encPassword = await bcrypt.hash(password, 10);

        //Crear el nuevo usuario utilizando el modelo en Users.js, le pasamos el password ya encriptado.
        const newUser = new User({
          email,
          password: encPassword,
        });
        // Guardar en la DB el nuevo usuario creado.
        const savedUser = await newUser.save();
        //Ejecutar la función done, le pasamos null (sin errores) y el nombre del nuevo usuario.
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//Crear la estrategia LOGIN
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    //Funcion callback a ejecutar al hacer LOGIN el usuario previamente registrado.
    //Incluye la función callback "done" que ejecutamos al final del registro.
    async (req, email, password, done) => {
      try {
        //Compruebo si el usuario está registrado o no en la DB.
        const currentUser = await User.findOne({ email });
        //Si no existe el usuario registrado devolvemos mensaje de error
        if (!currentUser) {
          return done(createError("No existe usuario, no está registrado"));
        }
        //Sí el email está registrado, procedemos a comprobar si el password es correcto. El comando bcrypt.compare compara una string encriptado con otro no encriptado, arroja respuesta boolean.
        const isValidPassword = await bcrypt.compare(
          password,
          currentUser.password
        );
        //Sí el password es invalido devolvemos mensaje de error
        if (!isValidPassword) {
          return done(createError("La contraseña es incorrecta"));
        }
        //Sí el password es valido ejecutamos la callback done pasando null(error) y los datos del usuario logueado. Por seguridad borramos el password para no mostrarlo.
        currentUser.password = null;
        return done(null, currentUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//Registro de usuario por su id. (serializeUser)
passport.serializeUser((user, done) => {
  //Devuelve id del usuario para verificar correspondencia con la DB
  return done(null, user._id);
});

//Busca un usuario dentro de la DB en base a un id (deserializeUser)
passport.deserializeUser(async (userId, done) => {
  try {
    const existingUser = await User.findById(userId);
    //Devuelve el usuario en la DB que corresponde con el id
    return done(null, existingUser);
  } catch (err) {
    return done(err);
  }
});
