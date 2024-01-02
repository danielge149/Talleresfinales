import express from "express";
import { buscarIdSolicitud, crearSolicitud, buscarSolicitudes, 
    actualizarsolicitud, eliminarSolicitud, buscarSolicitudesPendientes,
    aceptarSolicitud, rechazarSolicitud, buscarSolicitudesAceptada,
     buscarSolicitudesRechazada} from "../controladores/solicitudesController.js";
const routerSolicitudes = express.Router();

routerSolicitudes.post("/crearSolicitud",(req,res)=>{
    crearSolicitud(req,res);
});

routerSolicitudes.get("/buscarIdSolicitud/:id",(req,res)=>{
    buscarIdSolicitud(req,res);
});

routerSolicitudes.get("/buscarSolicitudes",(req,res)=>{
    buscarSolicitudes(req,res);
});

routerSolicitudes.get("/buscarSolicitudesPendientes",(req,res)=>{
    buscarSolicitudesPendientes(req,res);
});

routerSolicitudes.get("/buscarSolicitudesAceptada",(req,res)=>{
    buscarSolicitudesAceptada(req,res);
});

routerSolicitudes.get("/buscarSolicitudesRechazada",(req,res)=>{
    buscarSolicitudesRechazada(req,res);
});

routerSolicitudes.put("/actualizarSolicitud/:id",(req,res)=>{
    actualizarsolicitud(req,res);
});
routerSolicitudes.put("/aceptarSolicitud/:id",(req,res)=>{
    aceptarSolicitud(req,res);
});

routerSolicitudes.put("/RechazarSolicitud/:id",(req,res)=>{
    rechazarSolicitud(req,res);
});

routerSolicitudes.delete("/eliminarSolicitud/:id",(req,res)=>{
    eliminarSolicitud(req,res);
});

export{routerSolicitudes}