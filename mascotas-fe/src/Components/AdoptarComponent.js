// IMPORT
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { mostrarAlerta } from "../functions.js";

// CUERPO COMPONENTE
const AdoptarComponent = () => {
  // URL base para las solicitudes HTTP
  const url = "http://localhost:8000/solicitudes";

  // Obtener el parámetro 'id' de la URL utilizando react-router-dom
  const { id: idMascotaSeleccionada } = useParams();

  // Configurar la navegación utilizando react-router-dom
  const navigate = useNavigate();

  // Estados para almacenar datos del formulario
  const [idMascota, setIdMascota] = useState("");
  const [nombreSolicitante, setNombreSolicitante] = useState("");
  const [correoSolicitante, setCorreoSolicitante] = useState("");

  // Efecto para establecer el ID de la mascota seleccionada al cargar el componente
  useEffect(() => {
    setIdMascota(idMascotaSeleccionada);
  }, [idMascotaSeleccionada]);

  // Función para validar el formulario antes de enviar la solicitud
  const validar = () => {
    if (nombreSolicitante.trim() === "") {
      mostrarAlerta("Debe ingresar un nombre de solicitante");
    } else if (correoSolicitante.trim() === "") {
      mostrarAlerta("Debe ingresar un correo de solicitante");
    } else {
      enviarSolicitud();
    }
  };

  // Función para enviar la solicitud de adopción al servidor
  const enviarSolicitud = async () => {
    try {
      // Realizar solicitud POST para crear una solicitud de adopción
      const response = await axios.post(`${url}/crearSolicitud`, {
        idMascota: idMascota.trim(),
        nombreSolicitante: nombreSolicitante.trim(),
        correoSolicitante: correoSolicitante.trim(),
      });

      // Determinar el tipo de alerta según el estado de la solicitud
      const tipo = response.data.resultado.estadoSolicitud === 'Pendiente' ? 'success' : 'error';
      const mensaje = response.data.mensaje;

      // Mostrar la alerta al usuario
      mostrarAlerta(mensaje, tipo);

      // Limpiar el formulario y regresar a la página principal en caso de éxito
      if (tipo === 'success') {
        limpiarFormulario();
        navigate('/');
      }
    } catch (error) {
      // Manejar diferentes tipos de errores durante la solicitud
      if (error.response) {
        mostrarAlerta(error.response.data.mensaje, 'error');
      } else if (error.request) {
        mostrarAlerta('No se recibió respuesta del servidor', 'error');
      } else {
        mostrarAlerta('Error en la configuración de la solicitud', 'error');
      }
    }
  };

  // Función para manejar el botón de regreso
  const handleRegresar = () => {
    navigate("/");
  };

  // Función para limpiar los campos del formulario
  const limpiarFormulario = () => {
    setNombreSolicitante("");
    setCorreoSolicitante("");
  };

  // Renderizado del componente con el formulario de adopción
  return (
    <div className="container">
      <h2>Formulario de Adopción</h2>
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="fa-solid fa-id-card"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="ID de Mascota"
          value={idMascota}
          disabled // Deshabilitar la edición del campo
        ></input>
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="fa-solid fa-user"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Nombre del Solicitante"
          value={nombreSolicitante}
          onChange={(e) => setNombreSolicitante(e.target.value)}
        ></input>
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="fa-solid fa-envelope"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Correo del Solicitante"
          value={correoSolicitante}
          onChange={(e) => setCorreoSolicitante(e.target.value)}
        ></input>
      </div>
      <div className="d-grid col-6 mx-auto">
        <button onClick={() => validar()} className="btn btn-success">
          <i className="fa-solid fa-heart"></i> Adoptar
        </button>
      </div>
      <div className="card-footer text-right d-flex justify-content-end p-3">
        <button className="btn btn-primary" onClick={handleRegresar}>
          Regresar
        </button>
      </div>
    </div>
  );
};

// EXPORT
export default AdoptarComponent;
