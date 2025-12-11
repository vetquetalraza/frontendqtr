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
        { name: 'Acciones', cell: row => row.idvetservices === 1 ? <><a className="button button-edit" onClick={() => getGrooming(row.idappointment)} href="#popup1">Ver detalles</a></> : row.idvetservices === 2  ? <><a className="button button-edit" onClick={ () => getMedical(row.idappointment)} href="#popup2">Ver detalles</a></> : <><a className="button button-edit" onClick={ () => getPlan(row.idappointment)} href="#popup3">Ver detalles</a></> }
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

    const [filePath, setFilePath] = useState('');
    const [filePath2, setFilePath2] = useState('');
    
    const getGrooming = (id) => {
        api.get('/history/grooming/'+id)
        .then(res => {
            console.log(res.data);
      
            setGrooming({...grooming,
                idappo:res.data[0].idappointment,
                before:res.data[0].photobeforegroomingpet,
                after:res.data[0].photoaftergroomingpet,
                comment:res.data[0].commentsgroomingpet,
                date:res.data[0].createat,});
            
            setFilePath('https://api-vet-2utn.onrender.com' +"/uploads/"+res.data[0].photobeforegroomingpet);
            setFilePath2('https://api-vet-2utn.onrender.com' +"/uploads/"+res.data[0].photoaftergroomingpet);
        }).catch(err => console.log(err))
    }

    const handleClearGrooming = () => {
        setGrooming({...grooming,
            idappo: '',
            before: '',
            after: '',
            comment: '',
            date: ''
        })
    }

    //Obtener detalles de Consulta Medica

    const [medical, setMedical] = useState({
        idpetcare: '',
        idappo: '',
        anamnesis: '',
        weight: '',
        temperature: '',
        symptoms: [],
        diagnosis: [],
        medicines: [],
        treatment: '',
        date: ''
    })

    const getMedical = (id) => {
        api.get('/history/medical/'+id)
        .then(res => {
            console.log(res.data);
            
            setMedical({...medical,
                idpetcare: res.data[0].idpetcare,
                idappo:res.data[0].idappointment,
                anamnesis:res.data[0].anamnesispetcare,
                weight:res.data[0].weightpetcare,
                temperature:res.data[0].temperaturepetcare,
                treatment:res.data[0].treatmentpetcare,
                date: res.data[0].createat,
                symptoms: res.data[0].symptoms,
                diagnosis: res.data[0].diagnosis,
                medicines: res.data[0].medicines});
        }).catch(err => console.log(err))

    }

    const handleClearMedical = () => {
        setMedical({...medical,
            idpetcare: '',
            idappo: '',
            anamnesis: '',
            weight: '',
            temperature: '',
            symptoms: [],
            diagnosis: [],
            medicines: [],
            treatment: '',
            date: ''
        })
    }

    //Obtener detalles de Plan de vacunación
    const [plan, setPlan] = useState({
        idschedule: '',
        idappo: '',
        weight: '',
        temperature: '',
        comments: '',
        date: '',
        vaccines: []
    })

    const getPlan = (id) => {
         api.get('/history/plan/'+id)
        .then(res => {
            //console.log(res.data);
      
            setPlan({...plan,
                idschedule: res.data[0].idvaccinescheduling,
                idappo:res.data[0].idappointment,
                weight:res.data[0].weigthvaccine,
                temperature:res.data[0].temperaturevaccine,
                comments:res.data[0].commentsvaccine,
                date: res.data[0].createat,
                vaccines: res.data[0].vaccines})
        
        }).catch(err => console.log(err))  
    }

    const handleClearPlan = () => {
        setPlan({...plan,
            idschedule: '',
            idappo: '',
            weight: '',
            temperature: '',
            comments: '',
            date: '',
            vaccines: []
        })
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
                    <a className="close" href="#" onClick={handleClearGrooming}>&times;</a>
                </div>
                <div className="report-content">
                    <label htmlFor="" className="label">1. Fecha y Hora Atención: {grooming.date}</label>
                    <label for="dcotor" className="label">2. Personal: Valeria Campos Ramos</label>
                    <div className="content-photos">
                         <div className="column-photo">
                            <label for="before" className="label">3. Foto del antes!</label>
                            <div className="preview-pet"><img src={filePath} alt=""></img></div>
                            <label id="label_before"></label>
                        </div>
                        <div className="column-photo">
                            <label for="after" className="label">4. Foto de ahora!</label>
                            <div className="preview-pet"><img src={filePath2} alt=""></img></div>
                        </div>
                    </div>
                    <label for="comment" className="label">5. Observaciones: {grooming.comment}</label>
                </div>
                {/* <div className="button-section">
                    <input type="submit" value="Imprimir" className="button print-button"/> 
                </div> */}
            </div>
        </div>
        <div id="popup2" className="overlay">
            <div className="popup popup-care">
                <div className="popup-header">
                    <label className="title">Datos atención médica</label>
                    <a className="close" href="#" onClick={handleClearMedical}>&times;</a>
                </div>
                <div className="report-content"> 
                    <label className="label">1. Fecha y Hora Atención: {medical.date}</label>
                    <label for="dcotor" className="label">2. Médico: OSCAR MARAVI RIVEROS</label>
                    <p className="label">3. Anamnesis: {medical.anamnesis}</p>
                    <label for="temperature" className="label">4. Temperatura: {medical.temperature} (c°)</label>
                    <label for="weight" className="label">5. Peso: {medical.weight} (kg)</label>
                    <label className="label">6. Síntomas: </label>
                    <ul className="label">
                        { medical.symptoms ? medical.symptoms.map((row,index) => ( <li>{row.name}</li>)) : ""}
                    </ul>
                    <label className="label">7. Diagnóstico:</label>
                    <ul className="label">
                        { medical.diagnosis ? medical.diagnosis.map((row,index) => ( <li>{row.name}</li>)): ""}
                    </ul>      
                    <label className="label">8. Medicamentos e insumos utilizados durante la atención: </label>
                    <table className="table-inventory">
                        <thead>
                        <tr>
                            <th>N°</th>
                            <th>Medicamento / Insumo</th>
                            <th>Dosis</th>
                        </tr>
                        </thead>
                        <tbody>
                        { medical.medicines ? medical.medicines.map( (row,index) => (
                            <tr key={row.id}>
                            <td>{index + 1}</td>
                            <td>{row.name + " "+ row.presentation}</td>
                            <td>{row.dosage}</td>
                            </tr>
                        )) : ""}
                        </tbody>
                    </table>
                    <p className="label">9. Tratamiento: {medical.treatment}</p>
                </div>
                {/* <div className="button-section">
                    <input type="submit" value="Imprimir" className="button print-button"/> 
                </div> */}
            </div>
        </div>
        <div id="popup3" className="overlay">
            <div className="popup popup-care">
                <div className="popup-header">
                    <label className="title">Datos Vacunación</label>
                    <a className="close" href="#" onClick={handleClearPlan}>&times;</a>
                </div>
                <div className="report-content">
                    <label className="label">1. Fecha y Hora Atención: {plan.date}</label>
                    <label for="dcotor" className="label">2. Médico: OSCAR MARAVI RIVEROS</label>
                    <label for="idvaccine" className="label">3. Vacunas aplicadas en la cita:</label>
                    <table className="table-inventory">
                        <thead>
                            <tr>
                                <th>N°</th> 
                                <th>Número de dosis</th>
                                <th>Nombre vacuna</th>
                            </tr>
                        </thead>
                        <tbody>
                        {plan.vaccines.map((vaccine,index) => {
                        return <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{vaccine.number}</td>
                                <td>{vaccine.name + " "+ vaccine.presentation }</td>
                            </tr>
                        })} 
                        </tbody> 
                    </table>
                    <label for="temperature" className="label">4. Temperatura: {plan.temperature} (c°) </label>
                    <label for="weight" className="label">5. Peso: {plan.weight} (kg) </label>
                    <p className="label">6. Observaciones: {plan.comments}</p>
                </div>
                {/* <div className="button-section">
                    <input type="submit" value="Imprimir" className="button print-button"/> 
                </div> */}
            </div>
        </div>
    </>
);

}

export default History;