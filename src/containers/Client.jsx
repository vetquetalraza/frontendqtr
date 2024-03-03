import React, { useEffect, useState } from 'react';
import '../styles/global.scss';

const Client = () => {
    return (
        <>
        <label for="" className="title">Clientes</label>
        <div class="table-header">
            <input class="input-inset" type="text" placeholder="Buscar"/> 
            <a class="button button-new" href="#popup1">Nuevo Cliente</a>
        </div>
        <table class="table">
            <thead>
            <tr>
                <th>N°</th>
                <th>DNI</th>
                <th>Nombres y Apellidos</th>
                <th>Dirección</th>
                <th>Celular</th>
                <th>Correo</th>
                <th>Acciones</th>
            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>78787878</td>
                                <td>María Paz</td>
                                <td>Av. Flores 345</td>
                                <td>999999999</td>
                                <td>maria@gmail.com</td>
                                <td>
                                    <a class="button button-edit" href="#popup1">Editar</a>
                                    <a class="button button-delete" href="#popup2">Eliminar</a>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>78787878</td>
                                <td>María Paz</td>
                                <td>Av. Flores 345</td>
                                <td>999999999</td>
                                <td>maria@gmail.com</td>
                                <td>
                                    <a class="button button-edit" href="#popup1">Editar</a>
                                    <a class="button button-delete" href="#popup2">Eliminar</a>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>78787878</td>
                                <td>María Paz</td>
                                <td>Av. Flores 345</td>
                                <td>999999999</td>
                                <td>maria@gmail.com</td>
                                <td>
                                    <a class="button button-edit" href="#popup1">Editar</a> 
                                    <a class="button button-delete" href="#popup2">Eliminar</a>
                                </td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>78787878</td>
                                <td>María Paz</td>
                                <td>Av. Flores 345</td>
                                <td>999999999</td>
                                <td>maria@gmail.com</td>
                                <td>
                                    <a class="button button-edit" href="#popup1">Editar</a>
                                    <a class="button button-delete" href="#popup2">Eliminar</a>
                                </td>
                            </tr>        
                </tbody>
            </table>
        </>      
    );
};

export default Client;