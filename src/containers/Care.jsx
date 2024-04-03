import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import moment from 'moment'; 

const Care = () => {

    const [dateCare, setDateCare] = useState("");
    const [data, setData] = useState([])

    const handleChange = (event) => {
        setDateCare(event.target.value);
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+event.target.value)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    };

    useEffect(() => {
        let date = moment().format("YYYY-MM-DD")
        setDateCare(date);  
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+date)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, []);

return (
    <>
        <label for="" className="title">Atenciones</label>
        <div className="table-header">
            <input className="input-inset" type="text" placeholder="Buscar"/> 
            <input type="date" value={dateCare} onChange={handleChange} className="input input-text"/>
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
                {data.map((care,index) => {
                return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{care.dateappointment} {care.timeappointment}</td>
                        <td>{care.nameclient} {care.surnameclient}</td>
                        <td>{care.namepet}</td>
                        <td>{care.namespeciepet}</td>
                        <td>{care.namevetservices}</td>
                        <td className="text-wait"> {care.statusappointment}</td>
                        <td>
                            <a className="button button-edit" href="#popup1">Atender</a>
                        </td>
                    </tr>
                })}  
            </tbody>
        </table>
    </>
);

}

export default Care;