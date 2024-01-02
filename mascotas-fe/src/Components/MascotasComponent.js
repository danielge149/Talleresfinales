// Importar las bibliotecas y componentes necesarios
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";

// Definir el componente principal llamado MascotasComponent
const MascotasComponent = () => {
  // URL de la API para obtener datos de mascotas
  const url = "http://localhost:8000/mascotas";
  // Estados para almacenar la lista de mascotas, la página actual y la cantidad de mascotas por página
  const [mascotas, setMascotas] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const mascotasPerPage = 3;

  // Efecto secundario para obtener mascotas al montar el componente
  useEffect(() => {
    getMascotas();
  }, []);

  // Función para obtener mascotas desde la API
  const getMascotas = async () => {
    const respuesta = await axios.get(`${url}/buscarMascota`);
    setMascotas(respuesta.data);
  };
  
// Función para manejar el cambio de página en la paginación
const handlePageClick = (data) => {
  setCurrentPage(data.selected);
};

// Calcular el índice de inicio de las mascotas en la página actual
const offset = currentPage * mascotasPerPage;
// Crear un subconjunto de mascotas correspondiente a la página actual
const currentMascotas = mascotas.slice(offset, offset + mascotasPerPage);



  return (
    <div className="App">
      <div className="container-fluid">
        <div style={{marginLeft: '100px'}}>
          <img src="/mascota.webp" alt="Toggle Navigation" style={{ width: '100px', height: '100px' }} />
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {currentMascotas.map((mascota) => (
                <div key={mascota.id_mascota} className="col">
                  <div className="card ">
                  <h5 className="card-title text-center">{mascota.nombre}</h5>
                    <img
                      src={`http://localhost:8000/imagenes/${mascota.imagen}`}
                      alt={`Imagen de ${mascota.nombre}`}
                      style={{ width: '100%', height: '300px' }}
                    />
                    <div className="card-body">
                      <p className="card-text mb-1">
                        <strong>Tipo:</strong> {mascota.tipo}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Edad:</strong> {mascota.edad}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Descripción:</strong> {mascota.descripcion}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Disponible:</strong>{" "}
                        {mascota.disponible ? "Sí" : "No"}
                      </p>
                      <div className="d-flex justify-content-between ">
                        <Link to={`/detalles/${mascota.id_mascota}`} className="btn btn-info">
                          <i className="fa-solid fa-eye"></i> Detalles
                        </Link>
                        <Link to={`/adoptar/${mascota.id_mascota}`} className="btn btn-success">
                          <i className="fa-solid fa-heart"></i> Adoptar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination-container text-center mt-4">
              <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Siguiente"}
                breakLabel={"..."}
                pageCount={Math.ceil(mascotas.length / mascotasPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// EXPORT
export default MascotasComponent;
