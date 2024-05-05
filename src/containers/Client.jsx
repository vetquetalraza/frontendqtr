import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import Swal from 'sweetalert2'

const Client = () => {

    var url = 'https://api-vet-2utn.onrender.com/api/v1/clients/'
    const [data, setData] = useState([])
    useEffect(()=>{
        loadData()
    }, [])

    const loadData = () => {
        axios.get(url)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    const [values, setValues] = useState({
        dni: '',
        name: '',
        surname: '',
        address: '',
        email: '',
        phone: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        const close = document.querySelector(".close");
        axios.post(url,values)
        .then(res => {
            console.log(res);
            close.click();
            Swal.fire({
                position: "bottom-end",
                icon: "success",
                title: "Datos guardados correctamente.",
                showConfirmButton: false,
                timer: 1500
              });
            //Limpiar campos
            e.target.reset();

            //Cargar lista de datos nuevamente
            loadData()
        })
        .catch(err => {
            console.log(err);
            Swal.fire({
                position: "bottom-end",
                icon: "error",
                title: "Ha ocurrido un error.",
                showConfirmButton: false,
                timer: 1500
              });
        })
    }

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
        <div id="popup1" className="overlay">
            <div className="popup">
                <div className="popup-header">
                    <label className="title">Datos cliente</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmit}>
        
                        <label for="name" className="label">DNI</label>
                        <input type="text" id="dni" placeholder="" onChange={e => setValues({...values,dni: e.target.value})} className="input input-text"/>
                           
                        <label for="name" className="label">Nombres </label>
                        <input type="text" id="name" placeholder="" onChange={e => setValues({...values,name: e.target.value})} className="input input-text"/>
        
                        <label for="name" className="label">Apellidos</label>
                        <input type="text" id="surname" placeholder="" onChange={e => setValues({...values,surname: e.target.value})} className="input input-text"/>
        
                        <label for="name" className="label">Dirección</label>
                        <textarea name="" id="address" cols="20" rows="3" onChange={e => setValues({...values,address: e.target.value})} className="textarea"></textarea>
        
                        <label for="email" className="label">Email</label>
                        <input type="text" id="email" placeholder="" onChange={e => setValues({...values,email: e.target.value})} className="input input-email"/>
        
                        <label for="name" className="label">N° de celular</label>
                        <input type="text" id="phone" placeholder="" onChange={e => setValues({...values,phone: e.target.value})} className="input input-text"/>
                            
                        <div className="button-section">
                            <input type="submit" value="Guardar" className="button primary-button"/> 
                        </div>
                            
                    </form>
                </div>
            </div>
        </div>
    </>      
    );
};

export default Client;