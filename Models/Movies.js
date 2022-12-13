//Llamar dependencia mongoose para trabajar con la DB MongoAtlas
const mongoose = require("mongoose");

//Crear el modelo (schema) para las pelis, colección "Movies"
const moviesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "este campo es obligatorio"],
      unique: true,
    },
    director: { type: String, required: [true, "este campo es obligatorio"] },
    year: {
      type: Number,
      required: [true, "este campo es obligatorio"],
      min: [
        1878,
        "el mínimo es 1878, año de la primera película conocida, un cortometraje llamado The Horse in Motion",
      ],
      max: [2022, "Máximo este año, 2022"],
    },
    genre: {
      type: [String],
      enum: {
        values: [
          "Action",
          "Sci-Fi",
          "Animation",
          "Adventure",
          "Comedy",
          "Romance",
          "Drama",
          "Crime",
          "War",
          "Fantasy",
          "Thriller",
          "Biography",
          "History",
          "Documentary",
          "Short",
          "Experimental",
          "Horror",
          "Western",
          "Musical",
          "Family",
          "Mystery",
        ],
        message: "Genero no permitido",
      },
    },
    image:String
  },
  //Opciones de configuración del Schema. Timestamp para apuntar fecha de creación o edicion
  { timestamps: true }
);

//Creando la colección Movies, utilizando el moviesSchema
const Movies = mongoose.model("Movies", moviesSchema);

//Exportando colección Movies
module.exports = Movies;
