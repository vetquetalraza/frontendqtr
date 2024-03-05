import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Reports = () => {

    const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('https://api-vet-2utn.onrender.com/api/v1/reportes')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

return (
    <>
        <label for="" className="title">Reportes</label>
    </>
);

}

export default Reports;