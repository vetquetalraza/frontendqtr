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
        { name: 'Acciones', cell: row => <><a className="button button-edit" href="" onClick={handleDetails(row.idappointment)} >Ver detalles</a></>}
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

    const getHistory = () => {

        const id = document.getElementById('idpet').value;
        api.get('/history/' + id)
        .then( res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    const handleDetails = (id) => {

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
    </>
);

}

export default History;