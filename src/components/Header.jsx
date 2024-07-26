import React from 'react';
import '../styles/global.scss';
import logo from '../assets/icons/lista.png';
import user from '../assets/icons/user.png'

const Header = () => {
    return (

        <nav>
            <div className="navbar-left">
                <img src={logo} alt="logo" className="icon-menu"/>
                <label for="logo">Que tal Raza - Clínica Veterinaria</label>
            </div>
            <div className="navbar-right">
                <label for="">Admin Que tal Raza</label>
                <div className="dropdown">
                    <button className="dropbtn"><img src={user} alt="usuario" className="nav-user"/></button>
                    <div className="dropdown-content">
                        <a href="#">Configuración</a>
                        <a href="#">Cerrar Sesión</a>
                    </div>
                </div>
            </div>
        </nav>
    
    );
}

export default Header;