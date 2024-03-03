import React from 'react';
import '../styles/global.scss';
import whatsapp from '../assets/icons/whatsapp.png';
import facebook from '../assets/icons/facebook.png';
import instagram from '../assets/icons/instagram.png';
import web from '../assets/icons/sitio-web.png';

const Footer = () => {
    return (

        <footer className="footer">
            <div className="social-footer">
                <div className="social-item">
                    <img src={whatsapp} alt="logo" className="icon-footer"/>
                    <label for="">+51 99999999</label> 
                </div>
                <div className="social-item">
                    <a href="#"><img src={facebook} alt="logo" className="icon-footer"/><label for="">Que Tal Raza Vet</label></a>
                </div>
                <div className="social-item">
                    <a href="#"><img src={instagram} alt="logo" className="icon-footer"/><label for="">quetalraza</label></a>
                </div>
                <div className="social-item">
                    <a href="#"><img src={web} alt="logo" className="icon-footer"/><label for="">www.quetalraza.com</label></a>
                </div>
        </div>
        </footer>
    
    );
}

export default Footer;