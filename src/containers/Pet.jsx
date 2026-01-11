import { useEffect, useState } from 'react';
import '../styles/pet.scss';
import Swal from 'sweetalert2';
import MyDataTable from '../components/Datatable';
import api from '../services/api';
import Select from 'react-select'

const Pet = () => {

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
        api.get("/pets/")
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
            api.get('/clients/' + e.target.value)
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
    
        if (Object.keys(validationErrors).length === 0) {

            const close = document.querySelector(".close");

            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
            if (key !== "photo" && value !== null && value !== undefined) {
                formData.append(key, value);
            }
            });

            if (file) {
                formData.append('photoFile', file);
            }

            //console.log(formData);

            api.post("/pets/",formData)
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
                //Subida de foto
                //onUpload();
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
        api.get("/pets/"+id)
        .then(res => {
            //console.log(res.data);
            setNameClient({nameclient: res.data[0].nameclient,surnameclient: res.data[0].surnameclient});
            setFilePath(res.data[0].photopet);
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
                api.delete("/pets/"+id)
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
        const file = event.target.files[0];
        setFile(file);
        setFilePath(URL.createObjectURL(file))
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

    const colorOptions = [
        { value: "NEGRO", label: "NEGRO" },
        { value: "BLANCO", label: "BLANCO" },
        { value: "MARRÓN", label: "MARRÓN" },
        { value: "BEIGE", label: "BEIGE" },
        { value: "GRIS", label: "GRIS" },
        { value: "AMARILLO", label: "AMARILLO" },
        { value: "DORADO", label: "DORADO" },
        { value: "CREMA", label: "CREMA" },
        { value: "ATIGRADO", label: "ATIGRADO" },      
        { value: "NARANJA", label: "NARANJA" },               
        { value: "BICOLOR", label: "BICOLOR" },      
        { value: "TRICOLOR", label: "TRICOLOR" },       
        { value: "AZUL", label: "AZUL" },             
        { value: "VERDE", label: "VERDE" },             
        { value: "ROJO", label: "ROJO" },             
        { value: "PLOMO", label: "PLOMO" },             
        { value: "MOTEADO", label: "MOTEADO" },         
        { value: "MANCHADO", label: "MANCHADO" }       
    ];

    const catOptions = [
        { value: "PERSA", label: "PERSA" },
        { value: "SIAMES", label: "SIAMES" },
        { value: "MAINE COON", label: "MAINE COON" },
        { value: "BENGALÍ", label: "BENGALÍ" },
        { value: "ANGORA", label: "ANGORA" },
        { value: "AZUL RUSO", label: "AZUL RUSO" },
        { value: "SPHYNX", label: "SPHYNX" },
        { value: "BRITISH SHORTHAIR", label: "BRITISH SHORTHAIR" },
        { value: "ABISINIO", label: "ABISINIO" },
        { value: "COMUN EUROPEO", label: "COMUN EUROPEO" },
        { value: "PELO CORTO EUROPEO", label: "PELO CORTO EUROPEO" },
        { value: "CALICO", label: "CALICO" },
        { value: "CRIOLLO", label: "CRIOLLO" },
        { value: "MESTIZO", label: "MESTIZO" },
        { value: "TABBY", label: "TABBY" }
    ];

    const dogOptions = [
        { value: "LABRADOR", label: "LABRADOR" },
        { value: "GOLDEN RETRIEVER", label: "GOLDEN RETRIEVER" },
        { value: "PUG", label: "PUG" },
        { value: "PITBULL", label: "PITBULL" },
        { value: "PASTOR ALEMAN", label: "PASTOR ALEMAN" },
        { value: "ROTTWEILER", label: "ROTTWEILER" },
        { value: "SHIH TZU", label: "SHIH TZU" },
        { value: "BEAGLE", label: "BEAGLE" },
        { value: "BULLDOG FRANCÉS", label: "BULLDOG FRANCÉS" },
        { value: "CHIHUAHUA", label: "CHIHUAHUA" },
        { value: "CRIOLLO", label: "CRIOLLO" },
        { value: "MESTIZO", label: "MESTIZO" },
        { value: "PEQUINES", label: "PEQUINES" },
        { value: "SCHNAUZER", label: "SCHNAUZER" },
        { value: "SHIH TZU", label: "SHIH TZU" },
        { value: "VIRINGO", label: "VIRINGO" }
    ];

    const birdOptions = [
        { value: "PERIQUITO", label: "PERIQUITO" },
        { value: "CANARIO", label: "CANARIO" },
        { value: "COTORRA", label: "COTORRA" },
        { value: "AGAPORNIS", label: "AGAPORNIS" },
        { value: "LORO", label: "LORO" }
    ];

    const otherOptions = [
        { value: "HÁMSTER", label: "HÁMSTER" }
    ];

    const raceOptions =
    values.idspecie === 1
      ? catOptions
      : values.idspecie === 2
      ? dogOptions
      : values.idspecie === 3
      ? birdOptions
      : values.idspecie === 4
      ? otherOptions
      : [];

return (
    <>
        <div class="popup-header-tables">
            <label for="" class="title">Mascotas</label>
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

                        <div className="group-data-pet">
                        
                            <div>
                                <div>
                                    <label for="dni" className="label">DNI Cliente</label>
                                    <input type="text" id="dni" name="dni" onChange={getName} className="input input-text" value={values.client}/>
                                    {errors.dni && <label className="errorMsg">{errors.dni}</label>}
                                </div>


                                <div>
                                    <label for="pet" className="label">Nombre mascota</label>
                                    <input type="text" id="pet" name="namepet" className="input input-name" onChange={e => setValues({...values,namepet: e.target.value})} value={values.namepet} />
                                    {errors.namepet && <label className="errorMsg">{errors.namepet}</label>}
                                </div>

                                
                                <div>
                                    <label for="gender" className="label label-pet">Género</label>
                                   <select id="gender" name="gender" className="input" onChange={e => setValues({...values,idgender: Number(e.target.value)})} value={values.idgender}>
                                        <option  selected>Seleccionar</option>
                                        <option value="1">Hembra</option>
                                        <option value="2">Macho</option>
                                    </select>
                                    {errors.idgender && <label className="errorMsg">{errors.idgender}</label>}
                                </div>
                                <div>
                                    <label for="birthday" className="label">Fecha de Nacimiento</label>
                                    <input type="date" id="birthday" name="birthday" className="input input-name" onChange={e => setValues({...values,birthdate: e.target.value})} value={values.birthdate}/>
                                    {errors.birthdate && <label className="errorMsg">{errors.birthdate}</label>}
                                </div>
                                <div>
                                    <label for="color" className="label label-pet">Color</label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        id="color"
                                        className="label"
                                        placeholder="Seleccionar"
                                        options={colorOptions}
                                        value={colorOptions.find(opt => opt.value === values.color) || null}
                                        onChange={option => {
                                            setValues({ ...values, color: option ? option.value : "" });
                                        }}
                                    />
                                    {/* <input type="text" id="color" name ="color" className="input input-name" onChange={e => setValues({...values,color: e.target.value})} value={values.color}/> */}
                                    {errors.color && <label className="errorMsg">{errors.color}</label>}
                                </div>
                                <div>
                                    <label for="description" className="label">Señas particulares</label>
                                    <textarea className="textarea" rows="3" id="description" onChange={e => setValues({...values,signs: e.target.value})} value={values.signs}></textarea>                        
                                </div>
                            </div>  
                            <div>
                                <div>
                                    <label for="name"  className="label">Cliente</label>
                                    <input type="text" disabled id="name" name="name" className="input input-text" value={nameClient.nameclient+ ' ' + nameClient.surnameclient}/>
                                    {errors.name && <label className="errorMsg">{errors.name}</label>}
                                </div>
                                <div>
                                    <label for="specie" className="label label-pet">Especie</label>
                                    <select id="specie" name="specie" className="input" onChange={e => setValues({...values,idspecie: Number(e.target.value)})} value={values.idspecie}>
                                        <option  selected>Seleccionar</option>
                                        <option value="1">Gato</option>
                                        <option value="2">Perro</option>
                                        <option value="3">Ave</option>
                                        <option value="4">Otro</option>
                                    </select>
                                    {errors.idspecie && <label className="errorMsg">{errors.idspecie}</label>}
                                </div>
                                <div>
                                    <label for="origin" className="label label-pet">Procedencia</label>
                                    <select id="origin" name="origin" className="input" onChange={e => setValues({...values,idorigin: Number(e.target.value)})} value={values.idorigin}>
                                        <option  selected>Seleccionar</option>
                                        <option value="1">Costa</option>
                                        <option value="2">Sierra</option>
                                        <option value="3">Selva</option>
                                        <option value="4">Extranjera</option>
                                    </select>
                                    {errors.idorigin && <label className="errorMsg">{errors.idorigin}</label>}
                                </div>

                                <div>
                                    <label for="race" className="label label-pet">Raza</label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        id="race"
                                        className="label"
                                        placeholder="Seleccionar"
                                        options={raceOptions}
                                        value={raceOptions.find(opt => opt.value === values.race) || null}
                                        onChange={option => {
                                            setValues({ ...values, race: option ? option.value : "" });
                                        }}
                                    />
                                    {/* <input type="text" id="race" name="race" className="input input-name" onChange={e => setValues({...values,race: e.target.value})} value={values.race}/> */}
                                    {errors.race && <label className="errorMsg">{errors.race}</label>}
                                </div>

                                <div>
                                    <label for="" className="label">¿Deseas que conoscamos más a tu mascota?</label>
                                    
                                    <div className="group-photo">
                                        <input id="photo" type="file" onChange={onFileChange}/>
                                    </div>
                                    <div className="photo-preview"><img accept=".jpg, .jpeg, .png" src={filePath}/></div>
                                </div>
                            </div>
                        </div> 
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