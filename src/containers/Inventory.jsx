import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Inventory = () => {
    const [data, setData] = useState([])
    const [option, setOption] = useState([])

    const listMediciones = () => {
        setOption(1);
        axios.get('https://api-vet-2utn.onrender.com/api/v1/medicines')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    const listVaccines = () => {
        setOption(2);
        axios.get('https://api-vet-2utn.onrender.com/api/v1/vaccines')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }
    
    useEffect(()=>{

    }, [])


return (
    <>
        <label for="" class="title">Inventario</label>
        <div class="table-header">
            <div class="dropdown">
                <button class="dropbtn-filter">Filtrar por</button>
                <div class="dropdown-filter">
                    <a href="#" onClick={listMediciones}>Medicamentos</a>
                    <a href="#" onClick={listVaccines}>Vacunas</a>
                </div>
            </div>
            <div class="group-inventory">
                <input class="input-inset" type="text" placeholder="Buscar"/> 
                <a class="button button-new" href="#popup1">Nuevo ingreso</a>
            </div>      
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Descripción</th>
                    <th>Lote</th>
                    <th>Stock Actual</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
            {data.map((inventory,index) => {
                return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{ option == 1 ? inventory.namemedicine : inventory.namevaccine }</td>
                        <td>{ option == 1 ? inventory.brandmedicine : inventory.brandvaccine }</td>
                        <td>{ option == 1 ? inventory.descriptionmedicine : inventory.descriptionvaccine }</td>
                        <td>{ option == 1 ? inventory.batchmedicine : inventory.batchvaccine }</td>
                        <td>{ option == 1 ? inventory.stockmedicine : inventory.stockvaccine }</td>
                        <td>
                        <a class="button button-edit" href="#popup3">Agregar</a>
                        <a class="button button-delete" href="#popup1">Editar</a>
                        </td>
                    </tr>
                })}  
            </tbody>
        </table>
    </>
);

}

export default Inventory;