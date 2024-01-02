//IMPORT
// Importar las bibliotecas y componentes necesarios
import React, { useEffect, useState } from "react";
import axios from "axios";
import { mostrarAlerta } from "../functions.js"; 
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";

// Definir el componente principal llamado MascotasComponent
const MascotasComponent = () => {
  // Definir la URL de la API para obtener datos
  const url = "http://localhost:8000/mascotas";

  // Definir un array de tipos de mascotas
  const tiposMascotas = ['gato', 'perro'];

  // Definir variables de estado utilizando 
  const [mascotas, setMascotas] = useState([]); // Estado para almacenar la lista de mascotas
  const [id_mascota, setId] = useState(""); // Estado para almacenar el ID de una mascota
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre de una mascota
  const [tipo, setTipo] = useState(""); // Estado para almacenar el tipo de una mascota
  const [edad, setEdad] = useState(""); // Estado para almacenar la edad de una mascota
  const [descripcion, setDescripcion] = useState(""); // Estado para almacenar la descripción de una mascota
  const [disponible, setDisponible] = useState(""); // Estado para almacenar la disponibilidad de una mascota
  const [imagen, setImagen] = useState(""); // Estado para almacenar la URL de la imagen de una mascota
  const [raza, setRaza] = useState(""); // Estado para almacenar la raza de una mascota
  const [detalle, setDetalle] = useState(""); // Estado para almacenar detalles adicionales de una mascota
  const [operacion, setOperacion] = useState(""); // Estado para almacenar la operación actual (por ejemplo, "agregar", "editar")
  const [titulo, setTitulo] = useState(""); // Estado para almacenar el título del modal/dialogo


    // Cargar datos de mascotas al montar el componente
  useEffect(() => {
    getMascotas();
  }, []);

  // Definir la función asincrónica getMascotas
  const getMascotas = async () => {
    try {
      // Realizar una solicitud GET a la API para buscar mascotas
      const respuesta = await axios.get(`${url}/buscarMascota`);
      // Actualizar el estado de mascotas con los datos de la respuesta
      setMascotas(respuesta.data);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
    }
  };


  // Función para abrir el modal y configurar los estados según la opción seleccionada
  const openModal = (opcion, id_mascota, nombre, tipo, edad, descripcion, disponible, imagen, raza, detalle) => {
    // Reiniciar todos los estados
    setId('');
    setNombre('');
    setTipo('');
    setEdad('');
    setDescripcion('');
    setDisponible('');
    setImagen('');
    setRaza('');
    setDetalle('');
    // Establecer la operación actual
    setOperacion(opcion);
    // Configurar el título del modal según la opción
    if (opcion === 1) {
        setTitulo("Registrar Mascota");
    } else if (opcion === 2) {
        setTitulo("Editar Mascota");
        // Configurar los estados con los valores de la mascota seleccionada para editar
        setId(id_mascota);
        setNombre(nombre);
        setTipo(tipo);
        setEdad(edad);
        setDescripcion(descripcion);
        setDisponible(disponible);
        setImagen(imagen);
        setRaza(raza);
        setDetalle(detalle);
    }
  };

  // Función para validar y procesar la información de la mascota
  const validar = () => {
    let parametros;
    let metodo;

    // Validar cada uno de los datos de mascota
    if (!id_mascota) {
        console.log("Debe escribir una Id");
        mostrarAlerta("Debe escribir una Id");
    }
    else if (nombre.trim() === '') {
        console.log("Debe escribir un Nombre");
        mostrarAlerta("Debe escribir un Nombre");
    }
    else if (tipo.trim() === '') {
        console.log("Debe escribir una Tipo");
        mostrarAlerta("Debe escribir una Tipo");
    }
    else if (String(edad).trim() === '') {
        console.log("Debe escribir una Edad");
        mostrarAlerta("Debe escribir una Edad");
    }
    else {
        // Configurar los datos para la solicitud según la operación (Registrar o Editar)
        if (operacion === 1) {
            const formData = new FormData();
            formData.append('id_mascota', id_mascota.trim());
            formData.append('nombre', nombre.trim());
            formData.append('tipo', tipo.trim());
            formData.append('edad', edad.trim());
            formData.append('descripcion', descripcion.trim());
            formData.append('disponible', disponible.trim());
            formData.append('imagen', imagen);
            formData.append('raza', raza.trim());
            formData.append('detalle', detalle.trim());

            parametros = {
                urlExt: `${url}/crearMascota`,
                data: formData,
            };
            metodo = "POST";
        } else {
            const formData = new FormData();
            formData.append('nombre', nombre.trim());
            formData.append('tipo', tipo.trim());
            formData.append('edad', edad.trim());
            formData.append('descripcion', descripcion.trim());
            formData.append('disponible', disponible);
            formData.append('imagen', imagen);
            formData.append('raza', raza.trim());
            formData.append('detalle', detalle.trim());

            parametros = {
                urlExt: `${url}/actualizarMascota/${id_mascota}`,
                data: formData,
            };
            metodo = "PUT";
        }

        // Enviar la solicitud con los datos configurados
        enviarSolicitud(metodo, parametros);
    }
  };



  // Función para enviar solicitudes al servidor
  const enviarSolicitud = async (metodo, parametros) => {
    try {
        // Realizar la solicitud utilizando axios
        const response = await axios({
            method: metodo,
            url: parametros.urlExt,
            data: parametros.data,
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });

        // Extraer el tipo y mensaje de la respuesta
        let tipo = response.data.tipo;
        let mensaje = response.data.mensaje;

        // Mostrar una alerta con el mensaje y tipo obtenidos
        mostrarAlerta(mensaje, tipo);

        // Si la solicitud es exitosa, cerrar el modal y actualizar la lista de mascotas
        if (tipo === "success") {
            document.getElementById("btnCerrarModal").click();
            getMascotas();
        }
    } catch (error) {
        // Manejar errores, mostrar alerta y log en consola
        mostrarAlerta(`Error en la solicitud`, error);
        console.log('Error en la solicitud:', error.response);
    }
  };

    
    
  // Función para confirmar y eliminar una mascota
  const eliminarMascota = (id, nombre) => {
    const MySwal = withReactContent(Swal);

    // Mostrar un cuadro de diálogo para confirmar la eliminación
    MySwal.fire({
        title: `¿Estás seguro de eliminar la mascota ${nombre}?`,
        icon: 'question',
        text: 'Se eliminará definitivamente',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        // Verificar la respuesta del usuario
        if (result.isConfirmed) {
            // Configurar el estado de ID y enviar una solicitud DELETE al servidor
            setId(id);
            enviarSolicitud("DELETE", { urlExt: `${url}/eliminarMascota/${id}`, id: id });
        } else {
            // Mostrar una alerta en caso de que el usuario cancele la eliminación
            mostrarAlerta("No se eliminó la mascota", "info");
        }
    });
  };


  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
               onClick={()=>openModal(1)}
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalMascotas"
                >
                  <i className="fa-solid fa-circle-plus"></i>Añadir
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {mascotas.map((mascota, i) => (
                <div key={mascota.id_mascota} className="col">
                  <div className="card">
                    <img
                      src={`http://localhost:8000/imagenes/${mascota.imagen}`}
                      alt={`Imagen de ${mascota.nombre}`}
                      style={{ width: '100%', height: '300px' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{mascota.nombre}</h5>
                      <p className="card-text">
                        <strong>ID:</strong> {mascota.id_mascota}
                      </p>
                      <p className="card-text">
                        <strong>Tipo:</strong> {mascota.tipo}
                      </p>
                      <p className="card-text">
                        <strong>raza:</strong> {mascota.raza}
                      </p>
                      <p className="card-text">
                        <strong>Edad:</strong> {mascota.edad}
                      </p>
                      <p className="card-text">
                        <strong>Descripción:</strong> {mascota.descripcion}
                      </p>
                      <p className="card-text">
                        <strong>Disponible:</strong>{" "}
                        {mascota.disponible ? "Sí" : "No"}
                      </p>
                      <div className="d-grid gap-2">
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              mascota.id_mascota,
                              mascota.nombre,
                              mascota.tipo,
                              mascota.edad,
                              mascota.descripcion,
                              mascota.disponible,
                              mascota.imagen,
                              mascota.raza,
                              mascota.detalle,
                            )
                          }
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalMascotas"
                        >
                          <i className="fa-solid fa-edit"></i> Editar
                        </button>
                        <button
                          onClick={() =>
                            eliminarMascota(
                              mascota.id_mascota,
                              mascota.nombre
                            )
                          }
                          className="btn btn-danger"
                        >
                          <i className="fa-solid fa-trash"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="modalMascotas" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{titulo}</label>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="id_mascota"
                  className="form-control"
                  placeholder="ID"
                  value={id_mascota}
                  onChange={(e) => setId(e.target.value)}
                  readOnly={operacion === 2}  // readOnly solo cuando la operación es editar
                  disabled={operacion === 2}   // Deshabilitar el campo
                ></input>
              </div>
              <input type="hidden" id="nombre"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="raza"
                  className="form-control"
                  placeholder="Raza"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                ></input>
              </div>
              
              <div className="input-group mb-3">
                <label className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </label>
                <select
                  id="tipo"
                  className="form-select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="" disabled>Seleccione un tipo</option>
                  {tiposMascotas.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <input type="hidden" id="edad"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="edad"
                  className="form-control"
                  placeholder="Edad"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                ></input>
              </div>
              <input type="hidden" id="descripcion"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="descripcion"
                  className="form-control"
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                ></input>
              </div>
              <input type="hidden" id="disponible"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="disponible"
                  className="form-control"
                  placeholder="Disponible"
                  value={disponible}
                  onChange={(e) => setDisponible(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="file"
                  id="imagen"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="detalle"
                  className="form-control"
                  placeholder="Detalle"
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                ></input>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i>Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="btnCerrarModal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

//EXPORT
export default MascotasComponent;
