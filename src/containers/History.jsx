import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const History = () => {

    const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('https://api-vet-2utn.onrender.com/api/v1/historial')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

return (
    <>
        <label for="" class="title">Historial Médico</label>
        <div class="table-header">
            <input class="input-inset" type="text" placeholder="Buscar por DNI o nombre cliente"/> 
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Fecha y Hora</th>
                    <th>Cliente</th>
                    <th>Mascota</th>
                    <th>Especie</th>
                    <th>Servicio</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>27/01/2024 13:00</td>
                    <td>Luisa Perez</td>
                    <td>Arenita</td>
                    <td>Gato</td>
                    <td>Consulta Médica</td>
                    <td>
                        <a class="button button-edit" href="#popup1">Detalles</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
);

}

export default History;