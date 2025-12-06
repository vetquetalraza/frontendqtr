//import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
//import axios from 'axios';

const Reports = () => {

    // const [data, setData] = useState([])
    // useEffect(()=>{
    //     axios.get('https://api-vet-2utn.onrender.com/api/v1/reports')
    //     .then(res => setData(Array.from(res.data)))
    //     .catch(err => console.log(err));
    // }, [])

return (
    <>
        <label for="" className="title">Reportes</label>

        <a class="button button-new" href="#">Generar reporte clientes</a>
        <a class="button button-new" href="#">Generar reporte mascotas</a>
        <a class="button button-new" href="#">Generar reporte citas</a>
        <a class="button button-new" href="#">Generar reporte inventario</a>
    </>
);

}

export default Reports;