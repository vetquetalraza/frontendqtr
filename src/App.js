import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [data, setData] = useState([])
  useEffect(()=>{
      axios.get('https://api-vet-iy2t.onrender.com/api/v1/clients')
      .then(res => setData(Array.from(res.data)))
      .catch(err => console.log(err));
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <table className="">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>DNI</th>
                    <th>Nombres y Apellidos</th>
                    <th>Dirección</th>
                    <th>Celular</th>
                    <th>Correo</th>
                </tr>
            </thead>
            <tbody>
                {data.map((user,index) => {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.dniclient}</td>
                        <td>{user.nameclient} {user.surnameclient}</td>
                        <td>{user.addressclient}</td>
                        <td>{user.phoneclient}</td>
                        <td>{user.emailclient}</td>
                    </tr>
                })}
            </tbody>
           </table>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      
    </div>
  );
}

export default App;
