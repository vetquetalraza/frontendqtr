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

                    <form action="/" className="form" onSubmit="">
                            
                        <label for="name" className="label">DNI Cliente</label>
                        <input type="text" id="dni" placeholder="" className="input input-text"/>
                          
                        <label for="name" className="label">Cliente</label>
                        <input type="text" id="name" placeholder="María Paz" className="input input-text" readonly/>

                        <label for="name" className="label">Nombre mascota</label>
                        <input type="text" id="pet" className="input input-name"/>
                            
                        <div className="group-data-pet">
                            <div>
                                <label for="specie" className="label label-pet">Especie</label>
                                <select id="specie" name="specie" className="input" >
                                    <option selected>Seleccionar</option>
                                    <option value="">Gato</option>
                                    <option value="">Perro</option>
                                </select>
                            </div>
                            <div>
                                <label for="gender" className="label label-pet">Género</label>
                                <select id="gender" name="gender" className="input">
                                    <option selected>Seleccionar</option>
                                    <option value="">Hembra</option>
                                    <option value="">Macho</option>
                                </select>
                            </div>
                            <div>
                                <label for="origin" className="label label-pet">Procedencia</label>
                                <select id="origin" name="origin" className="input">
                                    <option selected>Seleccionar</option>
                                    <option value="">Costa</option>
                                    <option value="">Sierra</option>
                                    <option value="">Selva</option>
                                </select>
                            </div>
                        </div>
                        <div className="group-data-pet">
                            <div>
                                <label for="race" className="label label-pet">Raza</label>
                                <input type="text" id="race" className="input input-name" />
                            </div>
                            <div>
                                <label for="color" className="label label-pet">Color</label>
                                <input type="text" id="color" className="input input-name" />
                            </div>
                        </div>

                        <label for="birthday" className="label">Fecha de Nacimiento</label>
                        <input type="date" id="birthday" className="input input-name"/>
               
                        <label for="description" className="label">Señas particulares</label>
                        <textarea className="textarea" rows="3" id="description"></textarea>

                        <label for="" className="label">¿Deseas que conoscamos más a tu mascota?</label>
                        <label for="photo" className="button photo-file">Sube una foto!</label>
                        <input id="photo" type="file" placeholder="" />
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