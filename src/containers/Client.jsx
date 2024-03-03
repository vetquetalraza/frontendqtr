import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Client = () => {

    const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('https://api-vet-2utn.onrender.com/api/v1/clients')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

    return (
        <>
        <label for="" className="title">Clientes</label>
        <div class="table-header">
            <input class="input-inset" type="text" placeholder="Buscar"/> 
            <a class="button button-new" href="#popup1">Nuevo Cliente</a>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>DNI</th>
                    <th>Nombres y Apellidos</th>
                    <th>Dirección</th>
                    <th>Celular</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
            {data.map((client,index) => {
            return <tr key={index}> 
                    <td>{index + 1}</td>
                    <td>{client.dniclient} </td>
                    <td>{client.nameclient} {client.surnameclient}</td>
                    <td>{client.addressclient}</td>
                    <td>{client.phoneclient}</td>
                    <td>{client.emailclient}</td>
                    <td>
                        <a className="button button-edit" href="#popup1">Editar</a>
                        <a className="button button-delete" href="#popup2">Eliminar</a>
                    </td>
                </tr>
            })}      
            </tbody>
        </table>
    </>      
    );
};

export default Client;