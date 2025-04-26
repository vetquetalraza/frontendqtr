import React from 'react';
import '../styles/global.scss';
import logo from '../assets/icons/lista.png';
import user from '../assets/icons/user.png'
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (

        <nav>
            <div className="navbar-left">
                <img src={logo} alt="logo" className="icon-menu"/>
                <label for="logo">Que tal Raza - Clínica Veterinaria</label>
            </div>
            <div className="navbar-right">
                <label for="">{username}</label>
                <div className="dropdown">
                    <button className="dropbtn"><img src={user} alt="usuario" className="nav-user"/></button>
                    <div className="dropdown-content">
                        <a href="#">Configuración</a>
                        <a href="#" onClick={logout}>Cerrar Sesión</a>
                    </div>
                </div>
            </div>
        </nav>
    
    );
}

export default Header;