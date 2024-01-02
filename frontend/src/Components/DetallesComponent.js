// DetallesMascota.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const DetallesMascota = () => {
  // Obtener el parámetro 'id' de la URL
  const { id } = useParams();
  
  // Configurar la navegación
  const navigate = useNavigate();
  // Estado para almacenar la información de la mascota y controlar la carga
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efecto que se ejecuta al montar el componente y cuando 'id' cambia
  useEffect(() => {
    const getMascotaDetalles = async () => {
      try {
        // Realizar solicitud GET para obtener detalles de la mascota
        const respuesta = await axios.get(`http://localhost:8000/mascotas/buscarMascota/${id}`);
        
        // Almacenar detalles en el estado
        setMascota(respuesta.data);
      } catch (error) {
        // Manejar errores durante la obtención de datos
        console.error("Error al obtener detalles de la mascota", error);
      } finally {
        // Establecer el estado de carga como 'false' independientemente del resultado
        setLoading(false);
      }
    };

    // Llamar a la función para obtener detalles de la mascota
    getMascotaDetalles();
  }, [id]); // El efecto se ejecuta cuando 'id' cambia

  // Función para manejar el botón de regreso
  const handleRegresar = () => {
    // Navegar de vuelta a la página principal
    navigate("/");
  };

  // Renderizado condicional basado en el estado de carga y la existencia de detalles de la mascota
  if (loading) {
    return <div>Cargando detalles...</div>;
  }

  if (!mascota || !mascota.nombre) {
    return <div>No se encontraron detalles de la mascota.</div>;
  }

  // Renderizar la información de la mascota en una estructura de tarjeta
  return (
    <div className="App">
      <div className="container">
        <div style={{ marginLeft: '100px' }}>
          <img src="/mascota.webp" alt="Toggle Navigation" style={{ width: '100px', height: '100px' }} />
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{mascota.nombre}({mascota.raza || 'Raza no disponible'})</h5>
                <br></br>
                <p className="card-text">
                  <strong>Detalle:</strong> {mascota.detalle || 'Detalle no disponible'}
                </p>
                <br></br>
                <div className="card-footer text-right d-flex justify-content-end p-3">
                  <button className="btn btn-primary" onClick={handleRegresar}>
                    Regresar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesMascota;
