import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import Calendar from '../components/Calendar';
import axios from 'axios';

const Appointment = () => {

    const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('https://api-vet-2utn.onrender.com/api/v1/appointments')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

return (
    <>
        <label for="" className="title">Citas</label>
        <div class="table-header"><a className="button button-new" href="#popup1" id="btnPopup" hidden>Nueva cita</a></div>
        
        <Calendar />
    </>
);

}

export default Appointment;