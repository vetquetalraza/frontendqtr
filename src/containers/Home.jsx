import image1 from '../assets/images/Pet1.png';
import image2 from '../assets/images/Pet2.png';
import image3 from '../assets/images/Pet3.png';
import '../styles/global.scss';
import '../styles/home.scss';

const Home = () => {
    return (
    <>  
        <h3>Veterinaria Que Tal Raza Huancayo</h3>
        <div className="container-services">
            <div className="card-service">
                <img src={image1} alt="" />
                <p>Medicina Veterinaria. Cuidado profesional para la salud y bienestar de tu mascota.</p>
            </div>
            <div className="card-service">
                <img src={image2} alt="" />
                <p>Grooming. Baño, corte y cuidado estético para que tu mascota luzca y se sienta bien.</p>
            </div>
            <div className="card-service">
                <img src={image3} alt="" />
                <p>Otros servicios. Venta de alimentos, juguetes y accesorios para su felicidad y comodidad.</p>
            </div>
        </div>
    </>

    )
};

export default Home;