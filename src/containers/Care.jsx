import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import moment from 'moment'; 

const Care = () => {

    const [dateCare, setDateCare] = useState("")
    const [data, setData] = useState([])
    const [vaccine , setVaccine] = useState([])

    const handleChange = (event) => {
        setDateCare(event.target.value);
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+event.target.value)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    };

    const [ vaccineSel, setVaccineSel] = useState([])

    const [values, setValues] = useState({
        idappo: '',
        idvaccine: [],
        weight: '',
        temperature: '',
        comments: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values,idvaccine: vaccineSel})
        console.log(values)
        console.log(vaccineSel)
        axios.post('https://api-vet-2utn.onrender.com/api/v1/plan',values)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    const handleOpen = (event) => {
        setValues({...values,idappo: event.target.dataset.appo})
        axios.get('https://api-vet-2utn.onrender.com/api/v1/vaccines')
        .then(res => setVaccine(Array.from(res.data)))
        .catch(err => console.log(err));
    }

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
                            <a className="button button-edit" data-appo={care.idappointment} onClick={handleOpen} href="#popup2">Atender</a>
                        </td>
                    </tr>
                })}  
            </tbody>
        </table>
        <div id="popup2" className="overlay">
            <div className="popup-care">
                <div className="popup-header">
                    <label className="title">Datos Vacunación</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmit}>
                        <label for="idvaccine" className="label">Plan de vacunación</label>
                        <select id="idvaccine" name="vaccine" className="input" onChange={e => setVaccineSel(vaccineOld => [...vaccineOld,e.target.value])}>
                            <option selected>Seleccionar</option>
                            {vaccine.map((vaccine,index) => {
                                return <option value={vaccine.idvaccine}>{vaccine.namevaccine}</option>
                            })}     
                        </select>

                        <label for="temperature" className="label">Temperatura (c°)</label>
                        <input type="number" id="temperature" className="input input-text" onChange={e => setValues({...values,temperature: e.target.value})}/>

                        <label for="weight" className="label">Peso (kg)</label>
                        <input type="number" id="weight" className="input input-text" onChange={e => setValues({...values,weight: e.target.value})}/>

                        <label for="name" className="label">Histórico</label>

                        <table className="table-inventory">
                            <tr>
                                <td>N°</td>
                                <td>Fecha - Hora</td>
                                <td>Vacuna</td>
                            </tr>
                            <tr>
                                <td>Primera dosis</td>
                                <td>23/11/2023</td>
                                <td>ID2345HJ</td>
                            </tr>
                            <tr>
                                <td>Segunda dosis</td>
                                <td>23/12/2023</td>
                                <td>5834FG5</td>
                            </tr>
                            <tr>
                                <td>Tercera dosis</td>
                                <td>23/01/2024</td>
                                <td><input type="text" className="input input-table"/></td>
                            </tr>
                        </table>
                            
                        <label for="anamnesis" className="label">Observaciones</label>
                        <textarea className="textarea" rows="3" id="comments" onChange={e => setValues({...values,comments: e.target.value})}></textarea>
            
                        <div className="button-section">
                            <input type="submit" value="Guardar" className="button primary-button"/> 
                        </div>
                            
                    </form>
                </div>
            </div>
        </div>
    </>
);

}

export default Care;