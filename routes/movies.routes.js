//Activo dependencia express para poder crear router
const express = require("express");

//Importo la coleccion Movies
const Movies = require("../models/Movies.js");

//Importo funcición para crear mensajes de error
const createError = require("../utils/errors/create-errors.js");

//Importo el middleware de multer
const upload = require('../utils/middlewares/image.middleware.js');

//Aqui creamos el router
const moviesRouter = express.Router();

//Aqui establecemos la lógica del end point general, devuelve todas las pelis, con toda la información.
moviesRouter.get("/", async (req, res, next) => {
  try {
    const movies = await Movies.find();
    if (movies) {
      return res.status(200).json(movies);
    } else {
      next(createError("No hay registros en la base de datos", 404));
    }
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point para buscar una peli por su Id.
moviesRouter.get("/id/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const movies = await Movies.findById(id);
    if (movies) {
      return res.status(200).json(movies);
    } else {
      next(createError("No existe pelicula con el id indicado", 404));
    }
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point para buscar una peli por su titulo.
moviesRouter.get("/title/:title", async (req, res, next) => {
  const title = req.params.title;
  try {
    const movieTitle = await Movies.find({
      title: title,
    });
    if (movieTitle && movieTitle.length > 0) {
      return res.status(200).json(movieTitle);
    } else {
      next(createError("No existe pelicula con el titulo indicado", 404));
    }
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point para buscar todas las pelis por su género.
moviesRouter.get("/genre/:genre", async (req, res, next) => {
  const genre = req.params.genre;
  try {
    const movieGenre = await Movies.find({
      genre: { $in: [genre] },
    });
    if (movieGenre && movieGenre.length > 0) {
      return res.status(200).json(movieGenre);
    } else {
      next(createError("No hay peliculas con el género indicado", 404));
    }
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point para buscar todas las pelis estrenadas a partir de un año cualquiera.
moviesRouter.get("/year/:year", async (req, res, next) => {
  const year = req.params.year;
  try {
    const movieYear = await Movies.find({
      year: { $gte: year },
    });
    if (movieYear && movieYear.length > 0) {
      return res.status(200).json(movieYear);
    } else {
      next(
        createError(
          "No hay peliculas estrenadas en el año indicado o posterior",
          404
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point post (Create), para crear un nuevo documento tipo Movie en la base de datos. Utilizamos código de status 201 para creación exitosa.

//Upload (multer) en modo single --> para subir un solo fichero (una imagen) por pelicula.
//los dos argumentos, el nombre del campo del body donde se va a guardar la imagen y número de archivos a subir, uno en este caso.
moviesRouter.post("/", [upload.single('image')],  async (req, res, next) => {
  try {
    const image = req.file ? req.file.filename : null;
    const newMovie = new Movies({ ...req.body, image });
    const createdMovie = await newMovie.save();
    return res.status(201).json(createdMovie);
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point Delete, para eliminar un documento tipo Movie en la base de datos, indicando su id. Utilizamos código de status 200 para indicar que se ha eliminado exitosamente.

moviesRouter.delete("/:id", async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await Movies.findById(movieId);
    await Movies.findByIdAndDelete(movieId);
    return res
      .status(200)
      .json(`La pelicula " ${movie.title} " ha sido eliminada`);
  } catch (err) {
    next(err);
  }
});

//Aqui establecemos la lógica del end point Update (put), para modificar un documento tipo Movie en la base de datos, indicando su id. Utilizamos código de status 200 para indicar que se ha modificado exitosamente.
 //Extra, añadimos los comandos para actualizar la pelicula por Id, incluyendo la subida de imagenes.

moviesRouter.put("/:id", [upload.single('image')], async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await Movies.findById(movieId);
    const image = req.file ? req.file.filename : null;

    //seleccionamos el body que contiene los datos a modificar
    const movieToUpdate = new Movies({ ...req.body, image });
    //mantenemos el mismo id original, para no crear un nuevo documento
    movieToUpdate._id = movieId;
    //Actualizo la colección Movies incluyendo los nuevos datos, a la pelicula indicada por id. En opciones de configuración forzamos que nos arroje el elemento modificado.
    updatedMovie = await Movies.findByIdAndUpdate(movieId, movieToUpdate, {
      new: true,
    });
    return res
      .status(200)
      .json(
        `La pelicula " ${movie.title} " se ha modificado --> ${updatedMovie}`
      );
  } catch (err) {
    next(err);
  }
});



//Exporto el Router
module.exports = moviesRouter;
