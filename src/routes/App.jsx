import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../containers/PrivateRoute';
import Layout from '../containers/Layout';
import Appointment from '../containers/Appointment';
import Care from '../containers/Care';
import Client from '../containers/Client';
import History from '../containers/History';
import Home from '../containers/Home';
import Inventory from '../containers/Inventory';
import Login from '../containers/Login';
import Pet from '../containers/Pet';
import Report from '../containers/Reports';
import '../styles/global.css';

const App = () => {

    return(
        <BrowserRouter>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />
    
            {/* Rutas protegidas bajo /system */}
            <Route 
              path="/system"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="home" element={<Home />} />
              <Route path="appointment" element={<Appointment />} />
              <Route path="care" element={<Care />} />
              <Route path="clients" element={<Client />} />
              <Route path="history" element={<History />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="pets" element={<Pet />} />
              <Route path="reports" element={<Report />} />
              {/* Ruta por defecto dentro de /system */}
              <Route path="*" element={<Home />} />
            </Route>
  
            {/* Fallback general fuera de /system */}
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>

    );
}

export default App;

