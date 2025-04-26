import React, { useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import Swal from 'sweetalert2'
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
      try {
        const res = await axios.post('https://api-vet-2utn.onrender.com/api/v1/users/login', values);
        console.log(res.data)
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        localStorage.setItem('username', res.data.username);
        //setMensaje('¡Login exitoso!');
        navigate("/system/home");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Inicio de sesión exitoso.",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (err) {
        console.log(err)
        setMensaje(err.response?.data?.message || 'Error al iniciar sesión. Intente de nuevo.');
      }
    };

return (
    <>
    <div className="login">
      <div className="form-container-login">
        <div className="form-login">
          <label for="" className="title-login">INICIAR SESIÓN</label>
          
          <label for="username" className="label-login">Usuario</label>
          <input type="text" id="username" name="username" className="input input-text" maxLength="50" onChange={e => setValues({...values,username: e.target.value})}/>

          <label for="password" className="label-login">Contraseña</label>
          <input type="password" id="password" name="password" className="input input-text" maxLength="100" onChange={e => setValues({...values,password: e.target.value})} />
          <p className="label-error">{mensaje}</p>
          <div className="button-section">
              <button onClick={login} className="button primary-button">Acceder</button>
          </div>
        </div> 
      </div>
    </div>
        
    </>
);

}

export default Login;