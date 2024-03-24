import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Inventory = () => {

    const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('https://api-vet-2utn.onrender.com/api/v1/inventory')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

return (
    <>
        <label for="" class="title">Inventario</label>
        <div class="table-header">
            <div class="dropdown">
                <button class="dropbtn-filter">Filtrar por</button>
                <div class="dropdown-filter">
                    <a href="#">Medicamentos</a>
                    <a href="#">Productos</a>
                    <a href="#">Vacunas</a>
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
                    <th>Medida</th>
                    <th>Stock Actual</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Vacuna Triple Felina</td>
                    <td>Bravecto</td>
                    <td>Plan de vacunación</td>
                    <td>Unidad</td>
                    <td>10</td>
                    <td>
                        <a class="button button-edit" href="#popup3">Agregar</a>
                        <a class="button button-delete" href="#popup1">Editar</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
);

}

export default Inventory;