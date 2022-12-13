//Modulo para insertar la información de la seed en la DB, datos iniciales, contenidos en el fichero json.

//Activo mongoose para poder comunicarme con la DB
const mongoose = require('mongoose');

//Activo fs para poder leer el fichero json
const fs = require('fs');

//importo la colección de Cinemas
const Cinemas = require('../../models/Cinemas.js');

//importo URL y clave para acceder a la BD en MongoAtlas
const DB_URL =
  "mongodb+srv://root:cW9jnU9DUefRVMuN@movies-oscar.da2oiuf.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    //find para seleccionar todos los documentos de la colección Cinemas
    const allCinemas = await Cinemas.find();

    //funcion if para verificar si hay elementos dentro de la colección Cinemas
    if (allCinemas.length) {
      //Limpiamos la colección Cinemas: Sí allCinemas.lenght es truthy, drop para eliminar todos los elementos dentro de la colección Cinemas
      await Cinemas.collection.drop();
      console.log("Se ha reseteado la base de datos, colección Cinemas, se eliminan registros anteriores!");
    }
  })
  .catch((err) => {
    console.log("Error eliminando datos de la colección Cinemas");
  })

  //función para añadir los nuevos datos a la colección Cinemas
  .then(async () => {
    //leer los datos de la seed, objenemos un string tipo buffer
    const data = fs.readFileSync("./utils/seeds/seeds_db/cinemas.json");

    //el producto del fs.readFileSync anterior lo parseamos para obtener datos tipo json
    const parsedData = JSON.parse(data);

    //mapeamos los datos y uno a uno, y los vamos convirtiendo en un nuevo documento utilizando el schema en Models/Cinemas.js
    const cineDocs = parsedData.map((cine) => {
      return new Cinemas(cine);
    });
    //insertar todos nuevos documentos en la colección Cinemas
    await Cinemas.insertMany(cineDocs);
    console.log(
      "la información de la seed se ha cargado correctamente en la base de datos MongoAtlas"
    );
  })
  .catch((err) => {
    console.log(
      `Ha habido un error insertando los documentos a la base de datos:${err}`
    );
  })
  //desconecta la DB
  .finally(() => mongoose.disconnect());
