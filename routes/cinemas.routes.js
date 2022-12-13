//Activo dependencia express para poder crear router
const express = require("express");
const { find } = require("../models/Cinemas.js");

//Importo la coleccion Cinemas
const Cinemas = require("../models/Cinemas.js");


//Importo funcición para crear mensajes de error
const createError = require("../utils/errors/create-errors.js");

//Aqui creamos el router
const cinemasRouter = express.Router();

//Aqui establecemos la lógica del end point get general, devuelve todos los cines, con toda la información. Luego añadimos el comando 'populate' para mostrar toda la información del documento movie referenciado. En la DB solo se inserta el id de la pelicula.
cinemasRouter.get("/", async (req, res, next) => {
  try {
    const cinemas = await Cinemas.find().populate('movies');
    if (cinemas) {
      return res.status(200).json(cinemas);
    } else {
      next(createError("No hay registros en la base de datos", 404));
    }
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point para buscar el cine por su Id.
cinemasRouter.get("/id/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const cinema = await Cinemas.findById(id);
    if (cinema) {
      return res.status(200).json(cinema);
    } else {
      next(createError("No existe cine con el id indicado", 404));
    }
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point "post" (Create), para crear un nuevo documento tipo Cinema en la base de datos. Utilizamos código de status 201 para creación exitosa.

cinemasRouter.post("/", async (req, res, next) => {
  try {
    const newCinema = new Cinemas({ ...req.body });
    const createdCinema = await newCinema.save();
    return res.status(201).json(createdCinema);
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point Delete, para eliminar un documento de la colección Cinema, de la base de datos, indicando su id. Utilizamos código de status 200 para indicar que se ha eliminado exitosamente.

cinemasRouter.delete("/:id", async (req, res, next) => {
  try {
    const cinemaId = req.params.id;
    const cinema = await Cinemas.findById(cinemaId);
    await Cinemas.findByIdAndDelete(cinemaId);
    return res.status(200).json(`El cine " ${cinema.name} " ha sido eliminado`);
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point para insertar peliculas al cine, creando la relación entre ambas colecciones (Movies  y Cinemas)

cinemasRouter.put("/insertMovie", async (req, res, next) => {
  try {
    const { cinemaId, movieId } = req.body;
    //verificamos que si recibimos un id de cine, caso negado lanzamos mensaje de error
    if (!cinemaId) {
      return next(
        createError(
          "se necesita un id de cinema para poder añadir el cine", 500)
      );
    }
    //verificamos que si recibimos un id de pelicula, caso negado lanzamos mensaje de error
    if (!movieId) {
      return next(
        createError("se necesita un id de pelicula para poder añadirla", 500)
      );
    }
    //Actualizamos la colección Cinemas, añadiendo la pelicula según las instrucciones previamente indicadas.
    const updatedCinema = await Cinemas.findByIdAndUpdate(
      cinemaId,
      { $push: { 'movies': movieId } },
      { new: true }
    );
    // lanzamos el mensaje 200 de modificación exitosa
    return res.status(200).json(updatedCinema);
  } catch (err) {
    next(err);
  }
});

cinemasRouter.get("/cinemaByMovieId/:id", async (req, res, next) => {
  try {
      const movieId = req.params.id;
      const cinemas = await Cinemas.find();
      // const movie = await Movies.findById(movieId);
      const cinemaList = cinemas.filter((cine) => {
        cine.movies.includes(movieId,'utf8');
      }); 
      return res.status(200).json(cinemaList);
    }catch (err) {
    next(err);
  }
});

//Exporto el Router
module.exports = cinemasRouter;
