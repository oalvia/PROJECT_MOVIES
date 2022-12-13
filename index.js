//Importar dependencias necesarias
const express = require("express");

const cors = require("cors");

//Importar los routers que he creado en ficheros separados
const moviesRouter = require("./routes/movies.routes.js");
const cinemasRouter = require("./routes/cinemas.routes.js");
const usersRouter = require("./routes/users.routes");

//Importar la dependencia/libreria para manejo de sesiones
const session = require("express-session");

//Importar la funcion "connect" para poder conectar servidor y base de datos
const connect = require("./utils/db/connect.js");
const { json } = require("express");

//Importar la función para crear mensajes de error
const createError = require("./utils/errors/create-errors.js");

//Importar el passport, para activar la estrategia de autenticación
const passport = require("passport");

//Importar dependencia connect-mongo para guardar sesiones
const MongoStore = require("connect-mongo");

//Importar path
const path = require("path");

//URL de MongoAtlas y mi contraseña
const DB_URL =
  "mongodb+srv://root:cW9jnU9DUefRVMuN@movies-oscar.da2oiuf.mongodb.net/?retryWrites=true&w=majority";

//Creando servidor en puerto 4000
const PORT = 4000;
const server = express();

//Llamo a la función connect para ejecutarla y conectar servidor<-->BD
connect();

//Llamo la dependencia CORS para evitar errores
server.use(cors());

//Llamo al Middleware (de express) que transforma (parsea) los bodys de las peticiones, que recibimos como json, para poder ejecutar POST y PUT
server.use(express.json());

//Llamo al Middleware (de express) que transforma (parsea) los bodys de las peticiones, que recibimos como string o arrays, para poder guardarlos en el body.
server.use(express.urlencoded({ extended: false }));

//Activo ruta para archivos estáticos.
server.use(express.static(path.join(__dirname,'public')));

//Importar el passport, para activar la estrategia de autenticación
require("./utils/authentication/passport.js");

//Configuro la gestión de sesiones
server.use(
  session({
    secret: "movies-cinemas",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 90000, //milisegundos
    },
    //donde se guardan las sesiones activas de usuarios
    store: MongoStore.create({
      mongoUrl: DB_URL,
    }),
  })
);

//Llamo al passport de autenticación, se inicializa
server.use(passport.initialize());

//Llamo al manejador de sesiones de passport
server.use(passport.session());

//Llamando los routers
server.use("/users", usersRouter);
server.use("/movies", moviesRouter);
server.use("/cinemas", cinemasRouter);

//Función para manejar errores por ruta no definida
server.use("*", (req, res, next) => {
  next(createError("La ruta solicitada no existe", 404));
});

//Manejador de errores general
server.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || "Unexpected Error");
});

//Servidor escuchando
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Url:http://localhost:${PORT}`);
});
