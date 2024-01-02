import {mascotas} from "../modelos/mascotasModelo.js";
import {solicitudes} from "../modelos/solicitudesModelo.js";

// Importar la biblioteca 'multer' para manejar la carga de archivos
import multer from 'multer';

// Configuración del almacenamiento de archivos usando multer
const storage = multer.diskStorage({
  // Definir el directorio de destino para almacenar los archivos
  destination: function (req, file, cb) {
    cb(null, 'imagenes'); // La carpeta 'imagenes' debe existir en el servidor
  },
  // Definir el nombre del archivo en el servidor como el nombre original del archivo
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const upload = multer({ storage: storage });

//Crear un recurso 
const crearMascota = (req, res) => {
    // Verificar si el nombre, tipo, edad y id_mascota están presentes y no son nulos
    if (!req.body.id_mascota || !req.body.nombre || !req.body.tipo ) {
        return res.status(400).json({
            tipo: "success",
            mensaje: "id_mascota, nombre, tipo y edad son campos requeridos y no pueden ser nulos."
        });
    }

    if (!req.file) {
        return res.status(400).json({
          tipo: 'error',
          mensaje: 'Debes cargar una imagen para la mascota.',
        });
    }

   // Obtener el nombre del archivo de imagen cargado desde la solicitud POST
    const imagen = req.file.filename;


    // Crear un objeto dataset con los campos relevantes
    const dataset = {
        id_mascota: req.body.id_mascota,
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        edad: req.body.edad,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible, 
        imagen: imagen,
        raza: req.body.raza,
        detalle: req.body.detalle
    };

    // Utilizar Sequelize para crear el recurso
    mascotas.create(dataset)
        .then((resultado) => {
            res.status(200).json({
                tipo: "success",
                mensaje: "Registro creado correctamente",
                resultado: resultado
            });
        })
        .catch((err) => {
            res.status(500).json({
                tipo: "error",
                mensaje: `Error al crear el registro: ${err.message.errors}`
            });
        });
};



//Buscar recurso por ID
const buscarIdMascotas = (req,res)=>{
    const id = req.params.id;
    if(id == null){
        res.status(203).json({
            tipo: "success",
            mensaje: `El id no puede estar vacio`
        });
        return;
    }

    mascotas.findByPk(id).then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            tipo: "error",
            mensaje: `Registro no encontrado ::: ${err}`
        });
    });

}

const buscarMascotasDiponibles = (req,res)=>{

    mascotas.findAll({ where: { disponible: true }}).then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            tipo: "error",
            mensaje: `No se encontraron Registros ::: ${err}`
        });
    });

}


const buscarGatos = (req,res)=>{

    mascotas.findAll({ where: { tipo: "gato" }}).then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            tipo: "error",
            mensaje: `No se encontraron Registros ::: ${err}`
        });
    });

}

const buscarPerros = (req,res)=>{

    mascotas.findAll({ where: { tipo: "perro" }}).then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            tipo: "error",
            mensaje: `No se encontraron Registros ::: ${err}`
        });
    });

}


//Buscar recurso todos
const buscarMascotas = (req, res)=>{
    
    mascotas.findAll().then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            tipo: "error",
            mensaje: `No se encontraron Registros ::: ${err}`
        });
    });

};

//Actualizar un recurso

const actualizarMascota = (req, res) => {
    const id_mascota = req.params.id;

    // Verificar si el registro existe antes de intentar actualizar
    mascotas.findByPk(id_mascota)
        .then((registroExistente) => {
            if (!registroExistente) {
                return res.status(404).json({
                    tipo: "error",
                    mensaje: "Registro no encontrado"
                });
            }
            

            // El registro existe, ahora procedemos con la actualización
            const nombre = req.body.nombre || registroExistente.nombre;
            const tipo = req.body.tipo || registroExistente.tipo;
            const edad = req.body.edad || registroExistente.edad;
            const descripcion = req.body.descripcion || registroExistente.descripcion;
            const disponible = req.body.disponible || registroExistente.disponible;
            const imagen = req.file ? req.file.filename : (registroExistente.imagen || '');
            const raza = req.body.raza || registroExistente.raza;
            const detalle = req.body.detalle || registroExistente.detalle;


            mascotas.update({ nombre, tipo, edad, descripcion, disponible, imagen, raza, detalle}, { where: { id_mascota } })
                .then(() => {

                    res.status(200).json({
                        tipo: "success",
                        mensaje: "Registro actualizado correctamente"
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        tipo: "error",
                        mensaje: `Error al actualizar registro: ${err.message || err}`
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                tipo: "error",
                mensaje: `Error al verificar la existencia del registro: ${err.message || err}`
            });
        });
};




const eliminarMascota = (req, res) => {
    const id_mascota = req.params.id;

    if (id_mascota == null) {
        res.status(203).json({
            tipo: "success",
            mensaje: `El id no puede estar vacío`
        });
        return;
    }

    // Verificar si la mascota con el id_mascota existe antes de intentar eliminar
    mascotas.findByPk(id_mascota)
        .then((mascotaExistente) => {
            if (!mascotaExistente) {
                return res.status(404).json({
                    tipo: "success",
                    mensaje: "Mascota no encontrada"
                });
            }

            // Verificar si la mascota se utiliza como clave foranea en otraTabla
            solicitudes.findOne({ where: { idMascota : id_mascota } })
                .then((otraTablaExistente) => {
                    if (otraTablaExistente) {
                        return res.status(400).json({
                            tipo: "success",
                            mensaje: "La mascota está siendo utilizada como clave foranea en solicitudes. No se puede eliminar."
                        });
                    }

                    // La mascota no se utiliza como clave foranea, procedemos con la eliminación
                    mascotas.destroy({ where: { id_mascota } })
                        .then((resultado) => {
                            res.status(200).json({
                                tipo: "success",
                                mensaje: `Registro Eliminado`
                            });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                tipo: "error",
                                mensaje: `Error al eliminar Registro ::: ${err}`
                            });
                        });
                })
                .catch((err) => {
                    res.status(500).json({
                        tipo: "error",
                        mensaje: `Error al verificar la existencia en otraTabla ::: ${err}`
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                tipo: "error",
                mensaje: `Error al verificar la existencia de la mascota ::: ${err}`
            });
        });
};



export {crearMascota,buscarIdMascotas,buscarMascotas,actualizarMascota,
    eliminarMascota, buscarMascotasDiponibles , buscarGatos, buscarPerros, upload}  