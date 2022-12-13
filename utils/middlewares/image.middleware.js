const multer = require('multer');
const path = require('path');

//Array que define los tipos de archivos aceptados en nuestra carpeta public
const VALID_FILE_TYPES = ['image/png','image/jpg' , 'image/jpeg'];

//Filtro de archivos, para no dejar entrar archivos no aceptados
const fileFilter = (req,file,cb) => {
if(!VALID_FILE_TYPES.includes(file.mimetype)){
    cb(createError('El tipo de archivo no es valido'));
}else{
    cb(null, true);
}
};

//Almacén de archivos
const storage = multer.diskStorage({
//Función que impide que suban productos repetidos en forma masiva. Utiliza Date.now para hacer diferencia entre archivos con el mismo nombre.
    filename: (req,file,cb) => {
        cb(null,Date.now()+file.originalname);
    },
//Función para crear la ruta hacia la carpeta public, donde se guardaran las imagenes.
    destination: (req,file,cb) => {
        cb(null, path.join(__dirname,'../../public/upload/'));
    }
});


// Middleware
const upload = multer({
storage,
fileFilter
});

// Exportamos la función del middleware para subir las fotos
module.exports = upload;



