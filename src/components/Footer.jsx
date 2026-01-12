import '../styles/footer.scss';
import whatsapp from '../assets/icons/whatsapp.png';
import facebook from '../assets/icons/facebook.png';
import instagram from '../assets/icons/instagram.png';
import web from '../assets/icons/sitio-web.png';

const Footer = () => {
    return (

        <footer className="footer">
        <div className="social-footer">

            <div className="social-item">
            <img src={whatsapp} alt="WhatsApp" className="icon-footer"/>
            <span>+51 99999999</span>
            </div>

            <a className="social-item" href="https://facebook.com" target="_blank">
            <img src={facebook} alt="Facebook" className="icon-footer"/>
            <span>Que Tal Raza Vet</span>
            </a>

            <a className="social-item" href="https://instagram.com" target="_blank">
            <img src={instagram} alt="Instagram" className="icon-footer"/>
            <span>@quetalraza</span>
            </a>

            <a className="social-item" href="https://quetalraza.com" target="_blank">
            <img src={web} alt="Web" className="icon-footer"/>
            <span>www.quetalraza.com</span>
            </a>

        </div>
        </footer>
    
    );
}

export default Footer;