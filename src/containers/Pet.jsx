import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Pet = () => {

    const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('https://api-vet-2utn.onrender.com/api/v1/pets')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

    function getEdad(dateString) {
        let hoy = new Date()
        let fechaNacimiento = new Date(dateString.replace("-","/"))
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
        let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
        if (
          diferenciaMeses < 0 ||
          (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
        ) {
          edad--
        }
        return edad
    }

return (
    <>
        <label for="" class="title">Mascotas</label>
        <div class="table-header">
            <input class="input-inset" type="text" placeholder="Buscar"/> 
            <a class="button button-new" href="#popup1">Nueva Mascota</a>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Nombre</th>
                    <th>Especie</th>
                    <th>Raza</th>
                    <th>Género</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
            {data.map((pet,index) => {
            return <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{pet.namepet}</td>
                    <td>{pet.namespeciepet}</td>
                    <td>{pet.racepet}</td>
                    <td>{pet.namegenderpet}</td>
                    <td>{ getEdad(pet.birthdatepet) }</td>
                    <td>
                        <a class="button button-edit" href="#popup1">Editar</a>
                        <a class="button button-delete" href="#popup2">Eliminar</a>
                    </td>
                </tr>
            })} 
            </tbody>
        </table>
    </>
);

}

export default Pet;