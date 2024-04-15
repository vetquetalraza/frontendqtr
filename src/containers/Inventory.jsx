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

    const [values, setValues] = useState({
        name: '',
        description: '',
        batch: '',
        duedate: '',
        brand: '',
        stock: ''
    })


    const handleSubmit = (e) => {
        e.preventDefault();
        var url = ''
        if(option==1)
        {
            url='https://api-vet-2utn.onrender.com/api/v1/medicines'
        }
        else
            url='https://api-vet-2utn.onrender.com/api/v1/vaccines'

        console.log(values)
        axios.post(url,values)
        .then(res => console.log(res))
        .catch(err => console.log(err))
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
                <a class="button button-new" href="#popup2">Nuevo ingreso</a>
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
        <div id="popup2" className="overlay">
            <div className="popup">
                <div className="popup-header">
                    <label className="title">Agregar Inventario</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmit} >

                        <div>
                            <label>

                                <input type="radio" name="seleccion" value="1" onClick={e => setOption(1)}/> Medicinas</label>
                            <label>
                                <input type="radio" name="seleccion" value="2" onClick={e => setOption(2)}/>Vacunas</label>
                        </div>

                        <label for="name" className="label">Nombre Medicina</label>
                        <input type="text" id="dni" placeholder=""  onChange={e => setValues({...values,name: e.target.value})} className="input input-text"/>
                           
                        <label for="name" className="label">Marca Medicina </label>
                        <input type="text" id="name" placeholder=""  onChange={e => setValues({...values,brand: e.target.value})} className="input input-text"/>
        
                        <label for="name" className="label">Descripcion Medicina</label>
                        <input type="text" id="surname" placeholder=""   onChange={e => setValues({...values,description: e.target.value})} className="input input-text"/>
              
                        <label for="email" className="label">Lote de Medicinas</label>
                        <input type="text" id="email" placeholder=""  onChange={e => setValues({...values,batch: e.target.value})} className="input input-email"/>
        
                        <label for="name" className="label">Stock</label>
                        <input type="text" id="phone" placeholder=""  onChange={e => setValues({...values,stock: e.target.value})} className="input input-text"/>

                        <label for="name" className="label">Fecha de vencimiento</label>
                        <input type="date" id="phone" placeholder=""  onChange={e => setValues({...values,duedate: e.target.value})} className="input input-text"/>
                               
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

export default Inventory;