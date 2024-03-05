import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Pet = () => {

    const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('https://api-vet-2utn.onrender.com/api/v1/mascotas')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

return (
    <>
        <label for="" class="title">Mascotas</label>
        <div class="table-header">
            <input class="input-inset" type="text" placeholder="Buscar"/> 
            <a class="button button-new" href="#popup1">Nueva Mascota</a>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Especie</th>
                    <th>Raza</th>
                    <th>Género</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Arenita</td>
                    <td>Gato</td>
                    <td>Europeo pelo corto</td>
                    <td>Hembra</td>
                    <td>3 años</td>
                    <td>
                        <a class="button button-edit" href="#popup1">Editar</a>
                        <a class="button button-delete" href="#popup2">Eliminar</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
);

}

export default Pet;