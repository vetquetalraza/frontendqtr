import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import moment from 'moment'; 
import Swal from 'sweetalert2'
import Select from 'react-select'
import MyDataTable from '../components/Datatable';
import api from '../services/api';


const Care = () => {
    
    const close = document.querySelector(".close");
    const [data, setData] = useState([])
    const [vaccine , setVaccine] = useState([])
    const [vaccineSel, setVaccineSel] = useState([])
    const [history , setHistory] = useState([])
    const [symptoms , setSymptoms] = useState([])
    const [diagnosis , setDiagnosis] = useState([])
    const [medicines , setMedicines] = useState([])

    // Definimos las columnas para el DataTable
    const columns = [
        { name: "N°", cell: (row, index) => index + 1},
        { name: 'Fecha y Hora', selector: row => row.dateappointment + " " + row.timeappointment, sortable: true },
        { name: 'Cliente', selector: row => row.nameclient + " " + row.surnameclient, sortable: true },
        { name: 'Mascota', selector: row => row.namepet, sortable: true },
        { name: 'Especie', selector: row => row.namespeciepet, sortable: true },
        { name: 'Servicio', selector: row => row.namevetservices, sortable: true },
        { name: 'Estado', selector: row => <><label className="text-wait">{row.statusappointment == '1' ? 'Agendado' : ''}</label></>, sortable: true },
        { name: 'Acciones', cell: row => <><a className="button button-edit" data-appo={row.idappointment} data-pet={row.idpet} onClick={handleOpen} href={selectForm(row.idvetservices)}>Atender</a></>}
    ];
    
    const [medical, setMedical] = useState({
        idappo: '',
        anamnesis: '',
        weight: '',
        temperature: '',
        symptoms: [],
        diagnosis: [],
        treatment: ''
    })

    const [grooming, setGrooming] = useState({  
        idappo: '',
        before: '',
        after: '',
        comment: ''
    })

    const [values, setValues] = useState({
        idappo: '',
        idvaccine: [],
        weight: '',
        temperature: '',
        comments: ''
    })

    //Vista Previa de imágenes
    const [ filePreview, setFilePreview] = useState("");
    const [ filePreviewA, setFilePreviewA] = useState("");


    //Actualizar lista de atenciones de acuerdo a la fecha de filtrado
    const handleChange = () => {
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;
        api.get('/care/'+start+"&"+end)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    };

    useEffect(() => {
        loadData();
    }, []);

    //Funciones para diferenciar formularios
    const selectForm = (value) => {
        switch (value) {
            case 1:
              return '#popup1'
            case 2:
                return '#popup2'
            case 3:
                return '#popup3'
            default:
              return ''
          }
    }

    const handleOpen = (event) => {

        setMedical({...medical,idappo: event.target.dataset.appo})
        setValues({...values,idappo: event.target.dataset.appo})
        setGrooming({...grooming,idappo: event.target.dataset.appo})

        //Listar vacunas con stock
        api.get('/vaccines/filter')
        .then(res => setVaccine(Array.from(res.data)))
        .catch(err => console.log(err));

        //Listar historial de vacunas de la mascota
        var pet = event.target.dataset.pet;
        api.get('/plan/'+pet)
        .then(res => setHistory(Array.from(res.data)))
        .catch(err => console.log(err));

        //Listar símtomas
        api.get('/symptoms')
        .then(res => setSymptoms(Array.from(res.data)))
        .catch(err => console.log(err));

        //Listar diagnostico
        api.get('/diagnosis')
        .then(res => setDiagnosis(Array.from(res.data)))
        .catch(err => console.log(err));

        //Listar medicamentos
        api.get('/drugs/med')
        .then(res => setMedicines(Array.from(res.data)))
        .catch(err => console.log(err));

    }


    const loadData = () => {
        let date = moment().format("YYYY-MM-DD")
        api.get('/care/'+date+'&'+date)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    //CONSULTAS MÉDICAS
    
    //Tabla medicamentos e insumos utilizados
    const [rows, setRows] = useState([]);

    // Estado para los campos de entrada
    const [newIdMaterial, setNewIdMaterial] = useState('');
    const [newMaterial, setNewMaterial] = useState('');
    const [newDosage, setNewDosage] = useState('');

    // Función para manejar la eliminación de una fila
    const handleDelete = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    // Función para manejar el agregado de una nueva fila
    const handleAdd = () => {
        if (newIdMaterial && newMaterial && newDosage) {
        const newRow = {
            id: newIdMaterial,
            material: newMaterial,
            dosis: parseInt(newDosage, 10)
        };
        setRows([...rows, newRow]);
        // Limpiar los campos después de agregar
        setNewIdMaterial('');
        setNewMaterial('');
        setNewDosage('');
        
        }
    };

    const handleSubmitMedic = (e) => {
        e.preventDefault();
        console.log(medical)
        api.post('/medical/',medical)
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
            loadData();
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
    }

    //PLAN DE VACUNACIÓN
    const handleSubmitVaccine = (e) => {
        e.preventDefault();
        setValues({...values,idvaccine: vaccineSel});
        console.log(values)
        api.post('/plan/',values)
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
            loadData()
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
    }
    
    const handleAddRow = () => {
        var selected = document.getElementById("idvaccine"),
            text = selected.options[selected.selectedIndex].text,
            val = selected.value;

        const dosage = document.getElementById("id-dosage").value;

        setVaccineSel([...vaccineSel, {id : val, name : text, dosage: dosage}])
        
        setTimeout(() => {

            const tableRows = document.querySelectorAll('#table-vaccine tbody tr');
            var list = [];

            for(let i=0; i<tableRows.length; i++) {
                const row = tableRows[i];
                const number = row.querySelector('.number').innerHTML;
                console.log(number)
                const id = row.querySelector('.id-vaccine').value;
                
                list.push({idvaccine : parseInt(id), dosage : parseInt(number)});
            }

            setValues({...values,idvaccine: list});

        }, 500);

    }

    //GROOMING
    const handlePreview = (event) => {
        let photo1 = event.target.files[0]
        const formdata = new FormData()
        formdata.append('file', photo1)
        axios.post('http://localhost:3001/public/upload',formdata)
        .then(function (res) {
            setGrooming({...grooming,before: res.data})    
        })
        .catch(err => console.log(err))

        setTimeout(() => {
            setFilePreview(URL.createObjectURL(event.target.files[0]))
        }, 500);  
    }

    const handlePreviewA = (event) => {
        let photo1 = event.target.files[0]
        const formdata = new FormData()
        formdata.append('file', photo1)
        axios.post('http://localhost:3001/public/upload',formdata)
        .then(function (res) {
            setGrooming({...grooming,after: res.data})    
        })
        .catch(err => console.log(err))

        setTimeout(() => {
            setFilePreviewA(URL.createObjectURL(event.target.files[0]))
        }, 500); 
    }

    const handleSubmitGrooming = (e) => {
        e.preventDefault();
        console.log(grooming)
        api.post('/grooming/',grooming)
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
            loadData();
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
    }

return (
    <>
        <label for="" className="title">Atenciones</label>
        <div className="table-header-history">
            <div>
                <label htmlFor="" className="label">Inicio</label>
                <input type="date" id="startDate" className="input input-text"/>
            </div>
            <div>
                <label htmlFor="" className="label">Fin</label>
                <input type="date" id="endDate" className="input input-text"/>
            </div>
            <button onClick={handleChange} className="button primary-button">Filtrar</button>
        </div>
        
        <MyDataTable columns={columns} data={data} />

        <div id="popup1" className="overlay">
                <div className="popup popup-care">
                    <div className="popup-header">
                        <label className="title">Datos grooming</label>
                        <a className="close" href="#">&times;</a>
                    </div>
                    <div className="content">

                        <form action="/" className="form" onSubmit={handleSubmitGrooming}>
                            
                            <div className="contentPhotos">
                                <div className="columnPhoto">
                                    <label for="before" className="button photo-file">Sube una foto del antes!</label>
                                    <input id="before" type="file" onChange={handlePreview}/>
                                    <div className="preview-pet"><img src={filePreview} alt="" accept=".jpg, .jpeg, .png" ></img></div>
                                    <label id="label_before"></label>
                                </div>
                                <div className="columnPhoto">
                                    <label for="after" className="button photo-file">Sube una foto de ahora!</label>
                                    <input id="after" type="file" placeholder="" onChange={handlePreviewA}/>
                                    <div className="preview-pet"><img src={filePreviewA} alt="" accept=".jpg, .jpeg, .png"></img></div>
                                </div>
                            </div>
                            <label for="comment" className="label">Observaciones</label>
                            <textarea className="textarea" rows="3" id="comment" onChange={e => setGrooming({...grooming,comment: e.target.value})}></textarea>
            
                            <div className="button-section">
                                <input type="submit" value="Guardar" className="button primary-button"/> 
                            </div>
                            
                        </form>
                    </div>
                </div>
        </div>
        <div id="popup2" className="overlay">
            <div className="popup popup-medical">
                <div className="popup-header">
                    <label className="title">Datos atención médica</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmitMedic}>    
                        <div className="column1">  
                            <div className="column2">
                                <label for="anamnesis" className="label label-care">Anamnesis</label>
                                <label for="" className="label label-care">¿Ha tenido algún problema de salud que necesitara tratamiento? , ¿Está al día con las vacunas?, 
                                ¿Cuándo se realizó la última desparasitación? , ¿Tomo actualmente alguna medicación?, ¿Cómo es la alimentación de tu mascota?, ¿Qué hábitos tiene tu mascota?</label>
                                <textarea className="textarea" rows="3" id="anamnesis" onChange={e => setMedical({...medical,anamnesis: e.target.value})}></textarea>
                                <label for="temperature" className="label">Temperatura (c°)</label>
                                <input type="number" id="temperature" min="0" step="0.1" className="input input-text" onChange={e => setMedical({...medical,temperature: e.target.value})}/>
                                <label for="weight" className="label">Peso (kg)</label>
                                <input type="number" id="weight" min="0" step="0.1" className="input input-text" onChange={e => setMedical({...medical,weight: e.target.value})}/>
                            </div>
                            <div className="column2">
                                <label for="sintomas" className="label label-care">Síntomas</label>
                                <Select
                                    closeMenuOnSelect={false}
                                    id="simptoms"
                                    className="label"
                                    placeholder="Seleccionar"
                                    options={symptoms}
                                    isMulti
                                    onChange={options => {
                                        const values = options.map(option => option.value);
                                        setMedical({...medical,symptoms: values})
                                    }}
                                />
                                <label for="diagnostico" className="label label-care">Diagnóstico</label>
                                <Select
                                    closeMenuOnSelect={true}
                                    id="diagnosis"
                                    className="label"
                                    placeholder="Seleccionar"
                                    options={diagnosis}
                                    isMulti
                                    onChange={options => {
                                        const values = options.map(option => option.value);
                                        setMedical({...medical,diagnosis: values})
                                    }}
                                />
                                <label for="materials" className="label label-care">Medicamentos e insumos utilizados durante la atención</label>
                                <select className="input" onChange={(e) => {
                                    setNewIdMaterial(e.target.value);
                                    setNewMaterial(e.target.selectedOptions[0].label)
                                }}>
                                    <option>Seleccionar</option>
                                    {medicines.map((medicine,index) => {
                                        return <option value={medicine.iddrug}>{medicine.namedrug} - {medicine.presentationdrug} {medicine.quantityperpresentation}</option>
                                    })}  
                                </select>
                                <label for="dosage" className="label label-care">Dosis</label>
                                <input type="number" value={newDosage} id="dosage" min="0" step="0.01" className="input input-text" onChange={(e) => setNewDosage(e.target.value)}/>
                                <a onClick={handleAdd} className="button button-edit">Agregar</a>

                                <table className="table-inventory">
                                    <thead>
                                    <tr>
                                        <th>N°</th>
                                        <th>Medicamento / Insumo</th>
                                        <th>Dosis</th>
                                        <th>Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rows.map( (row,index) => (
                                        <tr key={row.id}>
                                        <td>{index + 1}</td>
                                        <td>{row.material}</td>
                                        <td>{row.dosis}</td>
                                        <td>
                                            <button onClick={() => handleDelete(row.id)}>Eliminar</button>
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div> 
                        </div>  
                        <label for="treatment" className="label label-care">Tratamiento</label>
                        <textarea className="textarea" rows="3" id="treatment" onChange={e => setMedical({...medical,treatment: e.target.value})}></textarea>
                        
                        
                        <div className="button-section">
                                <input type="submit" value="Guardar" className="button primary-button"/> 
                        </div>     
                    </form>
                </div>
             </div>
        </div>
        <div id="popup3" className="overlay">
            <div className="popup popup-care">
                <div className="popup-header">
                    <label className="title">Datos Vacunación</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmitVaccine}>
                        
                        <div className="options-vaccine">
                            <div>
                                <label for="idvaccine" className="label">Seleccione vacuna</label>
                                <select id="idvaccine" name="vaccine" className="input">
                                    <option selected>Seleccionar</option>
                                    {vaccine.map((vaccine,index) => {
                                        return <option value={vaccine.iddrug}>{vaccine.namedrug} - {vaccine.presentationdrug} {vaccine.quantityperpresentation}</option>
                                    })}     
                                </select>
                            </div>
                            <div>
                                <label for="idvaccine" className="label">Seleccione dosis</label>
                                <select name="numero-dosis" className="input" id="id-dosage">
                                    <option selected>Seleccionar</option>
                                    <option value="1">Primera dosis</option>
                                    <option value="2">Segunda dosis</option>
                                    <option value="3">Tercera dosis </option>
                                    <option value="4">Cuarta dosis</option>
                                    <option value="5">Quinta dosis</option>
                                </select>    
                            </div>
                            <a onClick={handleAddRow} className="button button-edit">Agregar</a>
                        </div>
                        <div className="tables-data-vaccine">
                            <div>
                                <label for="idvaccine" className="label">Plan de vacunación</label>
                                <table className="table-inventory" id="table-vaccine">
                                    <thead>
                                        <tr>
                                            <th>N°</th> 
                                            <th>Número de dosis</th>
                                            <th>Nombre vacuna</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {vaccineSel.map((vaccine,index) => {
                                    return <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><label className="number">{vaccine.dosage}</label></td>
                                            <td><input type="number" value={vaccine.id} className="id-vaccine" hidden/>{vaccine.name}</td>
                                        </tr>
                                    })} 
                                    </tbody> 
                                </table>
                            </div>
                            <div>
                                <label for="idvaccine" className="label">Historial de Vacunación</label>
                                <table className="table-inventory">
                                    <thead>
                                        <tr>
                                            <th>N°</th> 
                                            <th>Número de dosis</th>
                                            <th>Nombre vacuna</th>
                                            <th>Fecha aplicación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {history.map((history,index) => {
                                    return <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{history.numbervaccine}</td>
                                            <td>{history.namedrug}</td>
                                            <td>{history.dateappointment}</td>
                                        </tr>
                                    })} 
                                    </tbody> 
                                </table>
                            </div>
                        </div>
                        
                        <div className="options-vaccine-second">
                            <div className="col">
                                <div>
                                    <label for="temperature" className="label">Temperatura (c°) </label>
                                    <input type="number" id="temperature" className="input input-text" min="0" step="0.1" onChange={e => setValues({...values,temperature: e.target.value})}/> 
                                </div>
                                <div>
                                    <label for="weight" className="label">Peso (kg) </label>
                                    <input type="number" id="weight" className="input input-text" min="0" step="0.1" onChange={e => setValues({...values,weight: e.target.value})}/>
                                </div>
                            </div>
                            <div className="col">
                                <label for="comments" className="label">Observaciones</label>
                                <textarea className="textarea" rows="3" id="comments" onChange={e => setValues({...values,comments: e.target.value})}></textarea>
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

export default Care;