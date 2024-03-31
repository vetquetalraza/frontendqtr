import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Care = () => {

    var now = new Date(),
    day = now.getDate(),
    month = now.getMonth() + 1,
    year = now.getFullYear()

    var dayT = day < 10 ? 0 + day : day,
    monthT = month < 10 ? 0 + month.toString() : month,
    dateT = year + "-" + monthT + "-" + dayT

    const [data, setData] = useState([])
    useEffect(()=>{
        var id = dateT
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+id)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

return (
    <>
        <label for="" className="title">Atenciones</label>
        <div className="table-header">
            <input className="input-inset" type="text" placeholder="Buscar"/> 
            <input type="date" id="dateCare" className="input input-text"/>
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