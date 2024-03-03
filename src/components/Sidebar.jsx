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

const Sidebar = () => {
    return (
<>
<div className="sidebar" >
            <ul>
                <li>
                    <img src={inicio} alt="Inicio" className="icon-menu"/>
                    <a href="index.html">Inicio</a>
                </li>
                <li>
                    <img src={cliente} alt="Clientes" className="icon-menu"/>
                    <a href="/clients">Clientes</a>
                </li>
                <li>
                    <img src={mascota} alt="Mascotas" className="icon-menu"/>
                    <a href="list_pet.html">Mascotas</a>
                </li>
                <li>
                    <img src={cita} alt="Citas" className="icon-menu"/>
                    <a href="list_appointment.html">Citas</a>
                </li>
                <li>
                    <img src={atencion} alt="Atenciones" className="icon-menu"/>
                    <a href="list_attend.html">Atenciones</a>
                </li>
                <li>
                    <img src={historial} alt="Historial Clínico" className="icon-menu"/>
                    <a href="list_history.html">Historial Clínico</a>
                </li>
                <li>
                    <img src={inventario} alt="Inventario" className="icon-menu"/>
                    <a href="list_inventory.html">Inventario</a>
                </li>
                <li>
                    <img src={reporte} alt="Reportes" className="icon-menu"/>
                    <a href="reports.html">Reportes</a>
                </li>
            </ul>
        </div>
</>
        
    
    
     );
}

export default Sidebar;