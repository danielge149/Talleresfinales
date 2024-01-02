import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MascotasComponent from './Components/MascotasComponent';
import AdminComponent from './Components/AdminComponent';
import DetallesComponent from './Components/DetallesComponent';
import AdoptarComponent from './Components/AdoptarComponent';


const App = () => {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<MascotasComponent />} />
        <Route path="/admin" element={<AdminComponent />} />
        <Route path="/detalles/:id" element={<DetallesComponent/>} />
        <Route path="/adoptar/:id" element={<AdoptarComponent/>} />
      </Routes>
    </Router>
  );
};

export default App;
