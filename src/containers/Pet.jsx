import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Pet = () => {

    const [data, setData] = useState([])
    var url='https://api-vet-2utn.onrender.com/api/v1/pets'
    useEffect(()=>{
        axios.get(url)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, [])

    function getEdad(dateString) {
        let hoy = new Date()
        let fechaNacimiento = new Date(dateString)
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

    const [values, setValues] = useState({
        client: '',
        namepet: '',
        idspecie: '',
        idgender: '',
        idorigin: '',
        race: '',
        color: '',
        birthdate: '',
        signs: '',
        photo: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values)
        axios.post(url,values)
        .then(res => console.log(res))
        .catch(err => console.log(err))
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
                    <td>{ getEdad(pet.birthdatepet) } años</td>
                    <td>
                        <a class="button button-edit" href="#popup1">Editar</a>
                        <a class="button button-delete" href="#popup2">Eliminar</a>
                    </td>
                </tr>
            })} 
            </tbody>
        </table>
        <div id="popup1" className="overlay">
            <div className="popup-pet">
                <div className="popup-header">
                    <label className="title">Datos mascota</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">

                    <form action="/" className="form" onSubmit={handleSubmit}>
                            
                        <label for="name" className="label">DNI Cliente</label>
                        <input type="text" id="dni" placeholder="DNI del Usuario" onChange={e => setValues({...values,client: e.target.value})} className="input input-text"/>
                          
                        <label for="name" className="label">Cliente</label>
                        <input type="text" id="name" placeholder="Nombre del usuario" className="input input-text" readonly/>

                        <label for="name" className="label">Nombre mascota</label>
                        <input type="text" id="pet" placeholder="Nombre de la mascota" onChange={e => setValues({...values,namepet: e.target.value})} className="input input-name"/>
                            
                        <div className="group-data-pet">
                            <div>
                                <label for="specie" className="label label-pet">Especie</label>
                                <select id="specie" name="specie" onChange={e => setValues({...values,idspecie: e.target.value})} className="input" >
                                    <option disabled selected>Seleccionar</option>
                                    <option value="1">Gato</option>
                                    <option value="2">Perro</option>
                                </select>
                            </div>
                            <div>
                                <label for="gender" className="label label-pet">Género</label>
                                <select id="gender" name="gender" onChange={e => setValues({...values,idgender: e.target.value})}className="input">
                                    <option disabled selected>Seleccionar</option>
                                    <option value="1">Hembra</option>
                                    <option value="2">Macho</option>
                                </select>
                            </div>
                            <div>
                                <label for="origin" className="label label-pet">Procedencia</label>
                                <select id="origin" name="origin" onChange={e => setValues({...values,idorigin: e.target.value})}className="input">
                                    <option disabled selected>Seleccionar</option>
                                    <option value="1">Costa</option>
                                    <option value="2">Sierra</option>
                                    <option value="3">Selva</option>
                                </select>
                            </div>
                        </div>
                        <div className="group-data-pet">
                            <div>
                                <label for="race" className="label label-pet">Raza</label>
                                <input type="text" id="race" placeholder="Raza de la mascota" onChange={e => setValues({...values,race: e.target.value})}className="input input-name" />
                            </div>
                            <div>
                                <label for="color" className="label label-pet">Color</label>
                                <input type="text" id="color" onChange={e => setValues({...values,color: e.target.value})} className="input input-name" />
                            </div>
                        </div>

                        <label for="birthday" className="label">Fecha de Nacimiento</label>
                        <input type="date" id="birthday"onChange={e => setValues({...values,birthdate: e.target.value})}  className="input input-name"/>
               
                        <label for="description" className="label">Señas particulares</label>
                        <textarea className="textarea" rows="3" id="description"placeholder="Caracteristicas resaltantes de la mascota" onChange={e => setValues({...values,signs: e.target.value})} ></textarea>
                        
                        <label for="" className="label">¿Deseas que conoscamos más a tu mascota?</label>
                        <label for="photo" className="button photo-file">Sube una foto!</label>
                        <input id="photo" type="file" placeholder="" onChange={e => setValues({...values,photo: e.target.value})}/>
                        <div className="preview-pet"><img src="images/mascotas.png" alt=""></img></div>
                            
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

export default Pet;