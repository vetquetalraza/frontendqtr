import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';

const Inventory = () => {
    const [data, setData] = useState([])

    var text;
    // const sayHello = () => {
    //     alert("Hello!")
    //   };
         const fnfiltrar = () => {
             text = "medicines";
         }
             //console.log(text)
        //      useEffect(()=>{

        //         // var opt1 = document.getElementById("med");
        //          //console.log(opt1)
        //         // opt1.addEventListener("click",fnfiltrar,true)
        //        //  var opt2 = document.getElementById("vac");
        //         // opt2.addEventListener("click",fnfiltrar2,true)
             
             
        //          axios.get('https://api-vet-2utn.onrender.com/api/v1/medicines')
        //          //.then(res => setData(Array.from(res.data)))
        //          .then(res=>console.log(res))
        //          .catch(err => console.log(err));
             
             
        //          }, [])
        // };
        // const fnfiltrar(){
        //     text = "medicines";
        //     console.log(text)
        // }
        const fnfiltrar2 = () => {
            text = "vaccines";
            // //console.log(text)
            // useEffect(()=>{

            //     // var opt1 = document.getElementById("med");
            //      //console.log(opt1)
            //     // opt1.addEventListener("click",fnfiltrar,true)
            //    //  var opt2 = document.getElementById("vac");
            //     // opt2.addEventListener("click",fnfiltrar2,true)
             
             
            //      axios.get('https://api-vet-2utn.onrender.com/api/v1/vaccines')
            //      //.then(res => setData(Array.from(res.data)))
            //      .then(res=>console.log(res))
            //      .catch(err => console.log(err));
             
             
            //      }, [])
       };
        // function fnfiltrar2(){
        //     text = "vaccines";
        //     console.log(text)
        // }
    
        useEffect(()=>{
            if(text=="medicines")
            {
                axios.get('https://api-vet-2utn.onrender.com/api/v1/medicines')
                //.then(res => setData(Array.from(res.data)))
                .then(res=>console.log(res))
                .catch(err => console.log(err));
            }else if(text=="vaccines"){
                axios.get('https://api-vet-2utn.onrender.com/api/v1/vaccines')
                //.then(res => setData(Array.from(res.data)))
                .then(res=>console.log(res))
                .catch(err => console.log(err));
            }

    }, [])
    
    
return (
    <>
        <label for="" class="title">Inventario</label>
        <div class="table-header">
            <div class="dropdown">
                <button class="dropbtn-filter">Filtrar por</button>
                <div class="dropdown-filter">
                    <a id="med" href="#" onClick={fnfiltrar()} >Medicamentos</a>
                    {/* <a href="#">Productos</a> */}
                    <a id="vac" href="#" onClick={fnfiltrar2()} >Vacunas</a>
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
                {
                    
                        data.map((inventory,index) => {
                        return <tr key={index}> 
                                <td>{index + 1}</td>
                                <td>{inventory.namemedicine} </td>
                                <td>{inventory.brandmedicine}</td>
                                <td>{inventory.descriptionmedicine}</td>
                                <td>{inventory.batchmedicine}</td>
                                <td>{inventory.stockmedicine}</td>
                                <td>
                                    <a class="button button-edit" href="#popup3">Agregar</a>
                                    <a class="button button-delete" href="#popup1">Editar</a>   
                                </td>
                            </tr>
                        })
                    
            
                }  

            </tbody>
        </table>
    </>
);

}

export default Inventory;