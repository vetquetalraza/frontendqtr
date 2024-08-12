import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import moment from 'moment'; 
import Swal from 'sweetalert2'
import Select from 'react-select'

const Care = () => {
    
    const close = document.querySelector(".close");
    const [data, setData] = useState([])
    const [vaccine , setVaccine] = useState([])
    const [vaccineSel, setVaccineSel] = useState([])
    const [history , setHistory] = useState([])
    const [symptoms , setSymptoms] = useState([])
    const [diagnosis , setDiagnosis] = useState([])

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
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+start+"&"+end)
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
        axios.get('https://api-vet-2utn.onrender.com/api/v1/vaccines/filter')
        .then(res => setVaccine(Array.from(res.data)))
        .catch(err => console.log(err));

        //Listar historial de vacunas de la mascota
        var pet = event.target.dataset.pet;
        axios.get('https://api-vet-2utn.onrender.com/api/v1/plan/'+pet)
        .then(res => setHistory(Array.from(res.data)))
        .catch(err => console.log(err));

        //Listar símtomas
        axios.get('https://api-vet-2utn.onrender.com/api/v1/symptoms')
        .then(res => setSymptoms(Array.from(res.data)))
        .catch(err => console.log(err));

        //Listar símtomas
        axios.get('https://api-vet-2utn.onrender.com/api/v1/diagnosis')
        .then(res => setDiagnosis(Array.from(res.data)))
        .catch(err => console.log(err));

    }


    const loadData = () => {
        let date = moment().format("YYYY-MM-DD")
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+date+'&'+date)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    //CONSULTAS MÉDICAS
    const handleSubmitMedic = (e) => {
        e.preventDefault();
        console.log(medical)
        axios.post('https://api-vet-2utn.onrender.com/api/v1/medical',medical)
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
        axios.post('https://api-vet-2utn.onrender.com/api/v1/plan',values)
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
        axios.post('https://api-vet-2utn.onrender.com/api/v1/grooming',grooming)
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
        <div className="table-header">
            <label htmlFor="" className="label">Inicio:</label><input type="date" id="startDate" className="input input-text filter"/>
            <label htmlFor="" className="label">Fin:</label><input type="date" id="endDate" className="input input-text filter"/>
            <button onClick={handleChange} className="button button-edit">Filtrar</button>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Fecha y Hora</th>
                    <th>Cliente</th>
                    <th>Mascota</th>
                    <th>Especie</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {data.map((care,index) => {
                return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{care.dateappointment} {care.timeappointment}</td>
                        <td>{care.nameclient} {care.surnameclient}</td>
                        <td>{care.namepet}</td>
                        <td>{care.namespeciepet}</td>
                        <td>{care.namevetservices}</td>
                        <td className="text-wait"> {care.statusappointment}</td>
                        <td> 
                            <a className="button button-edit" data-appo={care.idappointment} data-pet={care.idpet} onClick={handleOpen} href={selectForm(care.idvetservices)}>Atender</a>
                        </td>
                    </tr>
                })}  
            </tbody>
        </table>
        <div id="popup1" className="overlay">
                <div className="popup-care">
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
            <div className="popup-care">
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
                                    closeMenuOnSelect={false}
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
            <div className="popup-care">
                <div className="popup-header">
                    <label className="title">Datos Vacunación</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmitVaccine}>
                        <label for="idvaccine" className="label">Seleccione vacuna y número de dosis:</label>
                        <div className="options-vaccine">
                            <select id="idvaccine" name="vaccine" className="input">
                                <option selected>Seleccionar</option>
                                {vaccine.map((vaccine,index) => {
                                    return <option value={vaccine.iddrug}>{vaccine.namedrug} - {vaccine.presentationdrug} {vaccine.quantityperpresentation}</option>
                                })}     
                            </select>
                            <select name="numero-dosis" className="input" id="id-dosage">
                                <option selected>Seleccionar</option>
                                <option value="1">Primera dosis</option>
                                <option value="2">Segunda dosis</option>
                                <option value="3">Tercera dosis </option>
                                <option value="4">Cuarta dosis</option>
                                <option value="5">Quinta dosis</option>
                            </select>
                            <div><a onClick={handleAddRow} className="button button-edit">Agregar</a></div>
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
                        
                        
                        <div>
                            <div>
                                <label for="temperature" className="label">Temperatura (c°) <input type="number" id="temperature" className="input input-text" min="0" step="0.1" onChange={e => setValues({...values,temperature: e.target.value})}/></label>
                                
                            </div>
                            <div>
                                <label for="weight" className="label">Peso (kg) <input type="number" id="weight" className="input input-text" min="0" step="0.1" onChange={e => setValues({...values,weight: e.target.value})}/></label>
                                
                            </div>
                        </div>
                        
                        <label for="anamnesis" className="label">Observaciones</label>
                        <textarea className="textarea" rows="3" id="comments" onChange={e => setValues({...values,comments: e.target.value})}></textarea>
            
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