// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <img src="/mascota.webp" alt="Toggle Navigation" style={{ width: '100px', height: '100px' }} />
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Mascotas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
            {/* Agrega más elementos según tus necesidades */}
          </ul>
        </div>
        {/* Campo de búsqueda */}
        <div className="d-flex me-2">
          <input
            type="text"
            placeholder="Buscar"
            className="form-control me-2"
            aria-label="Search"
          />
          <button className="btn btn-outline-light" type="button">
            Buscar
          </button>


        </div>
        {/* Botón de inicio de sesión */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/mascota">iniciar session</Link>
            </li>
            {/* Agrega más elementos según tus necesidades */}
          </ul>
      </div>
    </nav>
  );
};

export default Navbar;
