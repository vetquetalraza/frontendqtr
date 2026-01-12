import '../styles/header.scss';
import sidebar from '../assets/icons/lista.png';
import user from '../assets/icons/user.png'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = ({toggleSidebar}) => {

    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [open, setOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const toggleMenu = (e) => {
        e.stopPropagation();
        setOpen(!open);
    };

    useEffect(() => {
        const close = () => setOpen(false);
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, []);

    return (

        <nav className="navbar">
            <div className="navbar-left">
                <button onClick={toggleSidebar} className="button-sidebar"><img src={sidebar} alt="logo" className="icon-sidebar"/></button>
                <span className="brand">Que tal Raza</span>
            </div>
            <div className="navbar-right">
                <span className="username">{username}</span>
                <div className="dropdown">
                <button className="dropbtn" onClick={toggleMenu}>
                    <img src={user} alt="usuario" className="nav-user"/>
                </button>

                <div className={`dropdown-content ${open ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <button className="menu-item">Configuración</button>
                    <button className="menu-item" onClick={logout}>Cerrar Sesión</button>
                </div>
                </div>

                {/* <div className="dropdown">
                    <button className="dropbtn"><img src={user} alt="usuario" className="nav-user"/></button>
                    <div className="dropdown-content">
                        <a href="#">Configuración</a>
                        <a href="#" onClick={logout}>Cerrar Sesión</a>
                    </div>
                </div> */}
            </div>
        </nav>
    
    );
}

export default Header;