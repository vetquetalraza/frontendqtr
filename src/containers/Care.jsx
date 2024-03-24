import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Care = () => {

    const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

return (
    <>
        <label for="" className="title">Atenciones</label>
        <div className="table-header">
            <input className="input-inset" type="text" placeholder="Buscar"/> 
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Fecha y Hora</th>
                    <th>Cliente</th>
                    <th>Mascota</th>
                    <th>Especie</th>
                    <th>Servicio</th>
                    <th>Estado</th>
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
                    <td className="text-wait">En espera</td>
                    <td>
                        <a className="button button-edit" href="#popup1">Atender</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
);

}

export default Care;