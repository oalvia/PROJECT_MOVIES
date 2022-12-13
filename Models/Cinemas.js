//Llamar dependencia mongoose para trabajar con la DB MongoAtlas
const mongoose = require("mongoose");
const Movies = require("./Movies");

//Crear el modelo (schema) para las salas de cine, colección "Cinemas"
const cinemasSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    //Incluyo la relación con la colección Movies a través del Id de cada movie. Movies es la referencia.
    movies: [{ type: mongoose.Types.ObjectId, ref:'Movies'}]
  },
  //Opciones de configuración del Schema. Timestamp para apuntar fecha de creación o edicion
  { timestamps: true }
);
//Creamos la colección Cinemas, utilizando el cinemasSchema
const Cinemas = mongoose.model('Cinemas', cinemasSchema);

//Exportando la colección Cinemas
module.exports = Cinemas;
