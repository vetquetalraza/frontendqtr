import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import MyDataTable from '../components/Datatable';
import api from '../services/api';

const History = () => {

    const [data, setData] = useState([])

    // Definimos las columnas para el DataTable
    const columns = [
        { name: "N°", cell: (row, index) => index + 1},
        { name: 'Fecha y Hora', selector: row => row.dateappointment + " " + row.timeappointment, sortable: true },
        { name: 'Servicio', selector: row => row.namevetservices, sortable: true },
        { name: 'Estado', selector: row => row.statusappointment === '3' ? 'Atendido' : '', sortable: true },
        { name: 'Acciones', cell: row => row.idvetservices === 1 ? <><a className="button button-edit" onClick={getGrooming(row.idappointment)} href="#popup1">Ver detalles</a></> : row.idvetservices === 2  ? <><a className="button button-edit" onClick={getMedical(row.idappointment)} href="#popup2">Ver detalles</a></> : <><a className="button button-edit" onClick={getPlan(row.idappointment)} href="#popup3">Ver detalles</a></> }
    ];

    useEffect(()=>{
        setNameClient({nameclient: "",surnameclient: ""});
    }, [])

    //Listar nombres de cliente
    const [nameClient, setNameClient] = useState([])

    const getName = (e) =>{
        if (e.target.value.length >= 8) {
            api.get('/clients/' + e.target.value)
            .then( res => {
                if(res.data[0]){
                    setNameClient(res.data[0]);
                    getPets(e.target.value);
                }
                else{
                    setNameClient({nameclient: "Usuario",surnameclient: "Desconocido"});
        }})
            //.then(res => console.log((res.data[0])))
            .catch(err => console.log(err));
        }
    else {
        setNameClient({nameclient: "Nombre del",surnameclient: "Usuario"});
    }
    }

    //Listar nombres de mascotas
    const [namePets, setNamePets] = useState([])

    const getPets = (id) =>{

        api.get('/pets/client/' + id)
        .then( res => setNamePets(Array.from(res.data)))
        .catch(err => console.log(err));

    }

    //Obtener listado de atenciones
    const getHistory = () => {

        const id = document.getElementById('idpet').value;
        api.get('/history/' + id)
        .then( res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    //Obtener detalles de grooming
    const [grooming, setGrooming] = useState({  
        idappo: '',
        before: '',
        after: '',
        comment: '',
        date: ''
    })

    const getGrooming = (id) => {
        api.get('/history/grooming/'+id)
        .then(res => {
            //console.log(res.data);
      
            setGrooming({...grooming,
                idappo:res.data[0].idappointment,
                before:res.data[0].photobeforegroomingpet,
                after:res.data[0].photoaftergroomingpet,
                comment:res.data[0].commentsgroomingpet,
                date:res.data[0].createat,});
        }).catch(err => console.log(err))
    }

    //Obtener detalles de Consulta Medica

    const [medical, setMedical] = useState({
        idappo: '',
        anamnesis: '',
        weight: '',
        temperature: '',
        symptoms: [],
        diagnosis: [],
        treatment: '',
        date: ''
    })

    const getMedical = (id) => {
        api.get('/history/medical/'+id)
        .then(res => {
            //console.log(res.data);
      
            setMedical({...medical,
                idappo:res.data[0].idappointment,
                anamnesis:res.data[0].anamnesispetcare,
                weight:res.data[0].weightpetcare,
                temperature:res.data[0].temperaturepetcare,
                treatment:res.data[0].treatmentpetcare,
                date: res.data[0].createat});
        }).catch(err => console.log(err))
    }

    //Obtener detalles de Plan de vacunación
    const [plan, setPlan] = useState({
        idappo: '',
        idvaccine: [],
        weight: '',
        temperature: '',
        comments: '',
        date: ''
    })

    const getPlan = (id) => {
        api.get('/history/plan/'+id)
        .then(res => {
            //console.log(res.data);
      
            setPlan({...plan,
                idappo:res.data[0].idappointment,
                weight:res.data[0].weigthvaccine,
                temperature:res.data[0].temperaturevaccine,
                comments:res.data[0].commentsvaccine,
                date: res.data[0].createat});
        }).catch(err => console.log(err))
    }

return (
    <>
        <label for="" class="title">Historial Médico</label>
        <div class="table-header-history">
            <div>
            <label for="dni" className="label">DNI Cliente</label>
            <input type="text" id="dni" placeholder="" className="input input-text" onChange={getName} />
            </div>
            <div>
            <label for="name" className="label">Cliente</label>
            <input type="text" id="name" disabled placeholder="Nombre del usuario" className="input input-text" value={nameClient.nameclient+ ' ' + nameClient.surnameclient}/>
            
            </div>
            <div>
            <label for="idpet" className="label">Nombre mascota</label>
            <select id="idpet" name="idpet" className="input">
                <option selected>Seleccionar</option>
                {namePets.map((pet,index) => {
                return <option value={pet.idpet}>{pet.namepet}</option>
                })}
            </select>
            </div>     
            <button className="button primary-button" onClick={getHistory}> Buscar</button>
        </div>

        <MyDataTable columns={columns} data={data} />
        
        <div id="popup1" className="overlay">
            <div className="popup popup-care">
                <div className="popup-header">
                    <label className="title">Datos grooming</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="report-content">
                    <div>
                        <label htmlFor="" className="label">Fecha y Hora Atención: {grooming.date}</label>
                    </div>
                    <div className="content-photos">
                         <div className="column-photo">
                            <label for="before" className="label">Foto del antes!</label>
                            <div className="preview-pet"><img src={grooming.before} alt=""></img></div>
                            <label id="label_before"></label>
                        </div>
                        <div className="column-photo">
                            <label for="after" className="label">Foto de ahora!</label>
                            <div className="preview-pet"><img src={grooming.after} alt=""></img></div>
                        </div>
                    </div>
                    <div>
                        <label for="comment" className="label">Observaciones: {grooming.comment}</label>
                    </div>
                </div>
            </div>
        </div>
        <div id="popup2" className="overlay">
            <div className="popup popup-medical">
                <div className="popup-header">
                    <label className="title">Datos atención médica</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="report-content"> 
                    <label className="label">Fecha y Hora Atención: {medical.date}</label>
                    <div className="column1">  
                        <div className="column2">
                            <p className="label label-care">Anamnesis: {medical.anamnesis}</p>
                            <label for="temperature" className="label">Temperatura: {medical.temperature} (c°)</label>
                           
                            <label for="weight" className="label">Peso: {medical.weight} (kg)</label>
                      
                        </div>
                        <div className="column2">
                            <label for="sintomas" className="label label-care">Síntomas</label>
           
                            <label for="diagnostico" className="label label-care">Diagnóstico</label>
                                       
                            <label for="materials" className="label label-care">Medicamentos e insumos utilizados durante la atención: </label>
        
                            <table className="table-inventory">
                                <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Medicamento / Insumo</th>
                                    <th>Dosis</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* {rows.map( (row,index) => (
                                    <tr key={row.id}>
                                    <td>{index + 1}</td>
                                    <td>{row.material}</td>
                                    <td>{row.dosis}</td>
                                    </tr>
                                ))} */}
                                </tbody>
                            </table>
                        </div> 
                    </div> 

                    <p className="label label-care">Tratamiento: {medical.treatment}</p>

                </div>
            </div>
        </div>
        <div id="popup3" className="overlay">
            <div className="popup popup-care">
                <div className="popup-header">
                    <label className="title">Datos Vacunación</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="report-content">
                    <label className="label">Fecha y Hora Atención: {plan.date}</label>
                    <div>
                        <label for="idvaccine" className="label">Vacunas aplicadas en la cita:</label>
                        <table className="table-inventory">
                            <thead>
                                <tr>
                                    <th>N°</th> 
                                    <th>Número de dosis</th>
                                    <th>Nombre vacuna</th>
                                    <th>Fecha aplicación</th>
                                </tr>
                            </thead>
                            <tbody>
                            {/* {history.map((history,index) => {
                            return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{history.numbervaccine}</td>
                                    <td>{history.namedrug}</td>
                                    <td>{history.dateappointment}</td>
                                </tr>
                            })}  */}
                            </tbody> 
                        </table>
                    </div>

                    <div className="col">
                        <div>
                            <label for="temperature" className="label">Temperatura: {plan.temperature} (c°) </label>
                           
                        </div>
                        <div>
                            <label for="weight" className="label">Peso: {plan.weight} (kg) </label>
                            
                        </div>
                    </div>
                    <div className="col">
                        <p className="label">Observaciones: {plan.comments}</p>
                    </div>
 

                </div>
            </div>
        </div>
    </>
);

}

export default History;