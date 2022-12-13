//Dependencia que permite conecta con la base de datos MongoDB
const mongoose = require("mongoose");

//URL de MongoAtlas y mi contraseña
const DB_URL =
  "mongodb+srv://root:cW9jnU9DUefRVMuN@movies-oscar.da2oiuf.mongodb.net/?retryWrites=true&w=majority";

//Funcion "connect" para conectar el servidor a la BD
const connect = () => {
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  //Exportar la función "connect"
};
module.exports = connect;