import {mascotas} from "../modelos/mascotasModelo.js";
import {solicitudes} from "../modelos/solicitudesModelo.js";

const crearSolicitud = (req, res) => {
    // Verificar si el idMascota está presente y no es nulo
    if (!req.body.idMascota || !req.body.nombreSolicitante || !req.body.correoSolicitante) {
        return res.status(400).json({
            mensaje: "idMascota, nombreSolicitante y correoSolicitante son campos requeridos y no pueden ser nulos."
        });
    }

    // Verificar si la mascota con el idMascota existe y está disponible
    mascotas.findByPk(req.body.idMascota)
        .then((mascota) => {
            if (!mascota) {
                return res.status(404).json({
                    mensaje: `La mascota con ID = ${req.body.idMascota} proporcionado no existe.`
                });
            }

            if (!mascota.disponible) {
                return res.status(400).json({
                    mensaje: "La mascota no está disponible para adopción."
                });
            }

            // Crear un objeto dataset con los campos relevantes
            const dataset = {
                idMascota: req.body.idMascota,
                nombreSolicitante: req.body.nombreSolicitante,
                correoSolicitante: req.body.correoSolicitante,
            };

            // Utilizar Sequelize para crear el recurso
            solicitudes.create(dataset)
                .then((resultado) => {
                    res.status(200).json({
                        mensaje: "Registro creado correctamente",
                        resultado: resultado
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        mensaje: `Error al crear el registro: ${err.message}`
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                mensaje: `Error al buscar la mascota: ${err.message}`
            });
        });
};


const buscarIdSolicitud = (req, res) => {
    const id = req.params.id;

    // Validar si el id es nulo o indefinido
    if (id == null) {
        res.status(203).json({
            mensaje: `El id no puede estar vacío`
        });
        return;
    }

    // Validar si el id es un número válido
    if (isNaN(id)) {
        res.status(203).json({
            mensaje: `El id debe ser un número válido`
        });
        return;
    }

    solicitudes.findByPk(id)
        .then((resultado) => {
            if (resultado) {
                // Si el resultado existe, devolverlo
                res.status(200).json(resultado);
            } else {
                // Si el resultado no existe, devolver un mensaje de error
                res.status(404).json({
                    mensaje: `Registro no encontrado`
                });
            }
        })
        .catch((err) => {
            // Si ocurre un error durante la búsqueda, devolver un mensaje de error
            res.status(500).json({
                mensaje: `Error al buscar el registro ::: ${err}`
            });
        });
}

const buscarSolicitudes = (req, res)=>{
    
    solicitudes.findAll().then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            mensaje: `No se encontraron Registros ::: ${err}`
        });
    });

};

const buscarSolicitudesPendientes = (req, res)=>{
    
    solicitudes.findAll({ where: { estadoSolicitud: "Pendiente" }}).then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            mensaje: `No se encontraron Registros ::: ${err}`
        });
    });

};

const buscarSolicitudesAceptada = (req, res)=>{
    
    solicitudes.findAll({ where: { estadoSolicitud: "Aceptada" }}).then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            mensaje: `No se encontraron Registros ::: ${err}`
        });
    });

};

const buscarSolicitudesRechazada = (req, res)=>{
    
    solicitudes.findAll({ where: { estadoSolicitud: "Rechazada" }}).then((resultado)=>{
        res.status(200).json(resultado);    
    }).catch((err)=>{
        res.status(500).json({
            mensaje: `No se encontraron Registros ::: ${err}`
        });
    });

};






const actualizarsolicitud = (req, res) => {
    const id_Solicitud = req.params.id;
    
    // Verificar si el registro de solicitud existe antes de intentar actualizar
    solicitudes.findByPk(id_Solicitud)
        .then((registroExistente) => {
            if (!registroExistente) {
                return res.status(404).json({
                    mensaje: "Registro no encontrado"
                });
            }

            // El registro existe, ahora procedemos con la actualización
            if (!req.body.idMascota && !req.body.nombreSolicitante && !req.body.correoSolicitante && !req.body.estadoSolicitud) {
                return res.status(400).json({
                    mensaje: "No se encontraron datos para actualizar"
                });
            }

            const idMascota = req.body.idMascota || registroExistente.idMascota;

            // Verificar si la mascota con el idMascota existe
            mascotas.findByPk(idMascota)
                .then((mascotaExistente) => {
                    if (!mascotaExistente) {
                        return res.status(400).json({
                            mensaje: `La mascota con el ID = ${req.body.idMascota} no existe `
                        });
                    }

                    const nombreSolicitante = req.body.nombreSolicitante || registroExistente.nombreSolicitante;
                    const correoSolicitante = req.body.correoSolicitante || registroExistente.correoSolicitante;
                    const estadoSolicitud = req.body.estadoSolicitud || registroExistente.estadoSolicitud;

                    solicitudes.update({ idMascota, nombreSolicitante, correoSolicitante, estadoSolicitud }, { where: { id_Solicitud } })
                        .then(() => {
                            res.status(200).json({
                                mensaje: "Registro actualizado correctamente"
                            });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                mensaje: `Error al actualizar registro ::: ${err}`
                            });
                        });
                })
                .catch((err) => {
                    res.status(500).json({
                        mensaje: `Error al verificar la existencia de la mascota ::: ${err}`
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                mensaje: `Error al verificar la existencia del registro de solicitud ::: ${err}`
            });
        });
};


const eliminarSolicitud = (req, res) => {
    const id_Solicitud = req.params.id;

    if (id_Solicitud == null) {
        res.status(203).json({
            mensaje: `El id no puede estar vacío`
        });
        return;
    }

    // Verificar si el registro de solicitud existe antes de intentar eliminar
    solicitudes.findByPk(id_Solicitud)
        .then((registroExistente) => {
            if (!registroExistente) {
                return res.status(404).json({
                    mensaje: "Registro no encontrado"
                });
            }

            // El registro existe, ahora procedemos con la eliminación
            solicitudes.destroy({ where: { id_Solicitud } })
                .then((resultado) => {
                    res.status(200).json({
                        mensaje: `Registro Eliminado`
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        mensaje: `Error al eliminar Registro ::: ${err}`
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                mensaje: `Error al verificar la existencia del registro de solicitud ::: ${err}`
            });
        });
};


const aceptarSolicitud = (req, res) => {
    const id_Solicitud = req.params.id;

    if (id_Solicitud == null) {
        return res.status(203).json({
            mensaje: "El id no puede estar vacío"
        });
    }

    // Verificar si la solicitud con el id_Solicitud existe antes de intentar aceptar
    solicitudes.findByPk(id_Solicitud)
        .then((solicitudExistente) => {
            if (!solicitudExistente) {
                return res.status(404).json({
                    mensaje: "Solicitud no encontrada"
                });
            }

            // Verificar si la solicitud ya ha sido aceptada
            if (solicitudExistente.estadoSolicitud === 'Aceptada') {
                return res.status(400).json({
                    mensaje: "La solicitud ya ha sido aceptada previamente"
                });
            }

            // Actualizar el estado de la solicitud a "Aceptada"
            solicitudes.update({ estadoSolicitud: 'Aceptada' }, { where: { id_Solicitud } })
                .then(() => {
                    res.status(200).json({
                        mensaje: "Solicitud aceptada correctamente"
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        mensaje: `Error al aceptar la solicitud ::: ${err}`
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                mensaje: `Error al verificar la existencia de la solicitud ::: ${err}`
            });
        });
};

const rechazarSolicitud = (req, res) => {
    const id_Solicitud = req.params.id;

    if (id_Solicitud == null) {
        return res.status(203).json({
            mensaje: "El id no puede estar vacío"
        });
    }

    // Verificar si la solicitud con el id_Solicitud existe antes de intentar aceptar
    solicitudes.findByPk(id_Solicitud)
        .then((solicitudExistente) => {
            if (!solicitudExistente) {
                return res.status(404).json({
                    mensaje: "Solicitud no encontrada"
                });
            }

            // Verificar si la solicitud ya ha sido aceptada
            if (solicitudExistente.estadoSolicitud === 'Aceptada') {
                return res.status(400).json({
                    mensaje: "La solicitud ya ha sido aceptada previamente"
                });
            }

            // Actualizar el estado de la solicitud a "Aceptada"
            solicitudes.update({ estadoSolicitud: 'Rechazada' }, { where: { id_Solicitud } })
                .then(() => {
                    res.status(200).json({
                        mensaje: "Solicitud rechazada correctamente"
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        mensaje: `Error al rechazada la solicitud ::: ${err}`
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                mensaje: `Error al verificar la existencia de la solicitud ::: ${err}`
            });
        });
};



export{crearSolicitud, buscarIdSolicitud, buscarSolicitudes,actualizarsolicitud, 
    eliminarSolicitud, buscarSolicitudesPendientes, aceptarSolicitud, rechazarSolicitud, buscarSolicitudesAceptada,
    buscarSolicitudesRechazada}