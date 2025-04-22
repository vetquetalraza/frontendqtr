import React from 'react';
import '../styles/global.scss';
import inicio from '../assets/icons/hogar.png';
import cliente from '../assets/icons/cliente.png';
import mascota from '../assets/icons/huella.png';
import cita from '../assets/icons/cita.png';
import atencion from '../assets/icons/medical.png';
import historial from '../assets/icons/historial-medico.png';
import inventario from '../assets/icons/verificar.png';
import reporte from '../assets/icons/estadisticas.png';
import { Link } from 'react-router-dom';

const Sidebar = () => {

    return (
<>
<div className="sidebar" >
            <ul>
                <li className="option-menu">
                    <img src={inicio} alt="Inicio" className="icon-menu"/>
                    <a href="/system/home" >Inicio</a>
                </li>
                <li className="option-menu">
                    <img src={cliente} alt="Clientes" className="icon-menu"/>
                    <a href="/system/clients">Clientes</a>
                </li>
                <li className="option-menu">
                    <img src={mascota} alt="Mascotas" className="icon-menu"/>
                    <a href="/system/pets">Mascotas</a>
                </li>
                <li className="option-menu">
                    <img src={cita} alt="Citas" className="icon-menu"/>
                    <a href="/system/appointment">Citas</a>
                </li>
                <li className="option-menu">
                    <img src={atencion} alt="Atenciones" className="icon-menu"/>
                    <a href="/system/care">Atenciones</a>
                </li>
                <li className="option-menu">
                    <img src={historial} alt="Historial Clínico" className="icon-menu"/>
                    <a href="/system/history">Historial Clínico</a>
                </li>
                <li className="option-menu">
                    <img src={inventario} alt="Inventario" className="icon-menu"/>
                    <a href="/system/inventory">Inventario</a>
                </li>
                <li className="option-menu">
                    <img src={reporte} alt="Reportes" className="icon-menu"/>
                    <a href="/system/reports">Reportes</a>
                </li>
            </ul>
        </div>
</>
        
    
    
     );
}

export default Sidebar;