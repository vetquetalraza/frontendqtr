import React, { useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    const [token, setToken] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
  
    const login = async () => {
    console.log("iniciando")
      try {
        const res = await axios.post('https://api-vet-2utn.onrender.com/api/v1/users/login', values);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setMensaje('¡Login exitoso!');
        navigate("/system/home");
      } catch (err) {
        console.log(err)
        setMensaje(err.response?.data?.message || 'Error en login');
      }
    };

return (
    <>
        <label for="" className="title">Inicio de Sesión</label>
        
            <label for="username" className="label">Usuario</label>
            <input type="text" id="username" name="username" className="input input-text" maxLength="50" onChange={e => setValues({...values,username: e.target.value})}/>

            <label for="password" className="label">Contraseña</label>
            <input type="password" id="password" name="password" className="input input-text" maxLength="100" onChange={e => setValues({...values,password: e.target.value})} />

            <div className="button-section">
                <button onClick={login} className="button primary-button">Acceder</button>
                <p>{mensaje}</p>
            </div>

        
    </>
);

}

export default Login;