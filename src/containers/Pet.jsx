import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import Swal from 'sweetalert2';
import MyDataTable from '../components/Datatable';

const Pet = () => {

    const url='https://api-vet-2utn.onrender.com/api/v1/pets/'

    const [data, setData] = useState([])
    const [nameClient, setNameClient] = useState([])
    const [errors, setErrors] = useState({});

    // Definimos las columnas para el DataTable
    const columns = [
        { name: "N°", cell: (row, index) => index + 1},
        { name: 'Nombre', selector: row => row.namepet, sortable: true },
        { name: 'Especie', selector: row => row.namespeciepet , sortable: true },
        { name: 'Raza', selector: row => row.racepet, sortable: true },
        { name: 'Género', selector: row => row.namegenderpet, sortable: true },
        { name: 'Edad', selector: row => getEdad(row.birthdatepet), sortable: true },
        { name: 'Acciones', cell: row => <><a className="button button-edit" href="#popup1" onClick={() => handleList(row.idpet)}>Editar</a><a className="button button-delete" onClick={() => handleDelete(row.idpet)}>Eliminar</a></>}
    ];

    const [values, setValues] = useState({
        idpet: '',
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

    const handleLoad = () => {
        axios.get(url)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    //Función para devolver la Edad de la mascota
    const getEdad = (dateString) => {
        let hoy = new Date();
        let fechaNacimiento = new Date(dateString);
        let edadAnios = hoy.getFullYear() - fechaNacimiento.getFullYear();
        let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
        let edadMeses = 0;
    
        if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edadAnios--;
            diferenciaMeses += 12;
        }
    
        edadMeses = diferenciaMeses;
        //Aqui se hace el analisis para que muestre la edad en años, meses o menos de un mes y retorna lo que convenga.
        if (edadAnios > 0 && edadMeses > 0) {
            return `${edadAnios} años y ${edadMeses} meses`;
        } else if (edadAnios > 0) {
            return `${edadAnios} años`;
        } else if (edadMeses > 0) {
            return `${edadMeses} meses`;
        } else {
            return "Menos de un mes";
        }
    }

    const getName = (e) =>{
        if (e.target.value.length >= 8) {
            setValues({...values,client: e.target.value})
            axios.get('https://api-vet-2utn.onrender.com/api/v1/clients/' + e.target.value)
            .then( res => {
                if(res.data[0]){
                    setNameClient(res.data[0])
                }
                else{
                    setNameClient({nameclient: "Usuario",surnameclient: "Desconocido"});
        }})
            //.then(res => console.log((res.data[0])))
            .catch(err => console.log(err));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            const close = document.querySelector(".close");
            axios.post(url,values)
            .then(res => {
                console.log(res);
                close.click();
                Swal.fire({
                    position: "bottom-end",
                    icon: "success",
                    title: "Datos guardados correctamente.",
                    showConfirmButton: false,
                    timer: 1500
                });
                //Limpiar campos
                e.target.reset();

                //Cargar lista de datos nuevamente
                handleLoad()
            })
            .catch(err => {
                console.log(err);
                Swal.fire({
                    position: "bottom-end",
                    icon: "error",
                    title: "Ha ocurrido un error.",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
        } else {
            setErrors(validationErrors);
        }   
    }

    const handleList = (id) => {
        axios.get(url+id)
        .then(res => {
            console.log(res.data);
            setNameClient({nameclient: res.data[0].nameclient,surnameclient: res.data[0].surnameclient});
            setValues({...values,
                idpet: res.data[0].idpet,
                client: res.data[0].dniclient,
                namepet: res.data[0].namepet,
                idspecie: res.data[0].idspeciepet,
                idgender: res.data[0].idgenderpet,
                idorigin: res.data[0].idoriginpet,
                race: res.data[0].racepet,
                color: res.data[0].colorpet,
                birthdate: res.data[0].birthdatepet,
                signs: res.data[0].particularsignspet,
                photo: res.data[0].photopet,});
        }).catch(err => console.log(err))
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estas seguro?",
            text: "¡No podrás revertirlo!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#af81db",
            cancelButtonColor: "#525353",
            confirmButtonText: "Sí, eliminarlo."
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(url+id)
                .then(res => {
                    console.log(res);
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El registro fue eliminado.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                      });
                    handleLoad()
                })
                .catch(err => {
                    console.log(err);
                    Swal.fire({
                        icon: "error",
                        title: "Ha ocurrido un error.",
                        text: "El registro no fue eliminado.",
                        showConfirmButton: false,
                        timer: 1500
                      });
            })
            }
          });
    }

    const handleClear = () => {
        setNameClient({nameclient: '',surnameclient: ''});
        setValues({...values,
            idpet: '',
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
    }

    const [file, setFile] = useState(null);
    const [filePath, setFilePath] = useState('');

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
      };

    const onUpload = async () => {
        if (!file) {
          alert('Por favor, selecciona un archivo primero.');
          return;
        }
    
        const formData = new FormData();
        formData.append('photo', file);
        
        console.log(formData);

        try {
          const response = await axios.post('https://api-vet-2utn.onrender.com/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          setValues({...values,photo: response.data.filePath})

          setFilePath(response.data.filePath);
          alert('Archivo subido con éxito');
        } catch (error) {
          console.error('Error al subir el archivo', error);
          alert('Error al subir el archivo');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (values.client.length < 8) {
            newErrors.dni = 'Registre un mínimo de 8 dígitos';
        }

        if (!nameClient.nameclient) {
          newErrors.name = 'El nombre es requerido';
        }

        if (!values.namepet) {
            newErrors.namepet = 'El nombre de la mascota es requerido';
          }

        if (!values.idspecie) {
            newErrors.idspecie = 'La especie es requerido';
        }

        if (!values.idgender) {
            newErrors.idgender = 'El género es requerido';
        }

        if (!values.idorigin) {
            newErrors.idorigin = 'El origen es requerido';
        }

        if (!values.race) {
            newErrors.race = 'La raza es requerido';
        }

        if (!values.color) {
            newErrors.color = 'El color es requerido';
        }

        if (!values.birthdate) {
            newErrors.birthdate = 'La fecha de nacimiento es requerido';
        }

        return newErrors;
    };

    useEffect(()=>{
        handleLoad()
        setNameClient({nameclient: "",surnameclient: ""});
    }, [])

return (
    <>
        <label for="" class="title">Mascotas</label>
        <div class="popup-header">
            <a class="button button-new" href="#popup1" onClick={e => setValues({...values,idpet: 0})}>Nueva Mascota</a>
        </div>

        <MyDataTable columns={columns} data={data} />

        <div id="popup1" className="overlay">
            <div className="popup-pet">
                <div className="popup-header">
                    <label className="title">Datos mascota</label>
                    <a className="close" href="#" onClick={handleClear}>&times;</a>
                </div>
                <div className="content">

                    <form action="/" className="form" onSubmit={handleSubmit}>

                        <input type="text" id="idpet"  className="input input-text" onChange={e => setValues({...values,idpet: e.target.value})}  value={values.idpet} hidden />

                        <label for="dni" className="label">DNI Cliente</label>
                        <input type="text" id="dni" name="dni" onChange={getName} className="input input-text" value={values.client}/>
                        {errors.dni && <label className="errorMsg">{errors.dni}</label>}
                          
                        <label for="name"  className="label">Cliente</label>
                        <input type="text" disabled id="name" name="name" className="input input-text" value={nameClient.nameclient+ ' ' + nameClient.surnameclient}/>
                        {errors.name && <label className="errorMsg">{errors.name}</label>}

                        <label for="pet" className="label">Nombre mascota</label>
                        <input type="text" id="pet" name="namepet" className="input input-name" onChange={e => setValues({...values,namepet: e.target.value})} value={values.namepet} />
                        {errors.namepet && <label className="errorMsg">{errors.namepet}</label>}

                        <div className="group-data-pet">
                            <div>
                                <label for="specie" className="label label-pet">Especie</label>
                                <select id="specie" name="specie" className="input" onChange={e => setValues({...values,idspecie: e.target.value})} value={values.idspecie}>
                                    <option  selected>Seleccionar</option>
                                    <option value="1">Gato</option>
                                    <option value="2">Perro</option>
                                </select>
                                {errors.idspecie && <label className="errorMsg">{errors.idspecie}</label>}
                            </div>
                            <div>
                                <label for="gender" className="label label-pet">Género</label>
                                <select id="gender" name="gender" className="input" onChange={e => setValues({...values,idgender: e.target.value})} value={values.idgender}>
                                    <option  selected>Seleccionar</option>
                                    <option value="1">Hembra</option>
                                    <option value="2">Macho</option>
                                </select>
                                {errors.idgender && <label className="errorMsg">{errors.idgender}</label>}
                            </div>
                            <div>
                                <label for="origin" className="label label-pet">Procedencia</label>
                                <select id="origin" name="origin" className="input" onChange={e => setValues({...values,idorigin: e.target.value})} value={values.idorigin}>
                                    <option  selected>Seleccionar</option>
                                    <option value="1">Costa</option>
                                    <option value="2">Sierra</option>
                                    <option value="3">Selva</option>
                                </select>
                                {errors.idorigin && <label className="errorMsg">{errors.idorigin}</label>}
                            </div>
                        </div>
                        <div className="group-data-pet">
                            <div>
                                <label for="race" className="label label-pet">Raza</label>
                                <input type="text" id="race" name="race" className="input input-name" onChange={e => setValues({...values,race: e.target.value})} value={values.race}/>
                                {errors.race && <label className="errorMsg">{errors.race}</label>}
                            </div>
                            <div>
                                <label for="color" className="label label-pet">Color</label>
                                <input type="text" id="color" name ="color" className="input input-name" onChange={e => setValues({...values,color: e.target.value})} value={values.color}/>
                                {errors.color && <label className="errorMsg">{errors.color}</label>}
                            </div>
                        </div>

                        <label for="birthday" className="label">Fecha de Nacimiento</label>
                        <input type="date" id="birthday" name="birthday" className="input input-name" onChange={e => setValues({...values,birthdate: e.target.value})} value={values.birthdate}/>
                        {errors.birthdate && <label className="errorMsg">{errors.birthdate}</label>}

                        <label for="description" className="label">Señas particulares</label>
                        <textarea className="textarea" rows="3" id="description" onChange={e => setValues({...values,signs: e.target.value})} value={values.signs}></textarea>
                        
                        <label for="" className="label">¿Deseas que conoscamos más a tu mascota?</label>
                        <label for="photo" className="button photo-file">Sube una foto!</label>
                        <input id="photo" type="file" onChange={onFileChange}/>
                        <button className="button secondary-button" onClick={onUpload}>Subir</button>
                        <div className="preview-pet">{filePath && <img src={`https://api-vet-2utn.onrender.com${filePath}`} alt="Uploaded"/>}</div>
                            
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