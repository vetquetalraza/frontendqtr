import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import moment from 'moment'; 
import Swal from 'sweetalert2'

const Care = () => {
    
    const close = document.querySelector(".close");
    const [dateCare, setDateCare] = useState("")
    const [data, setData] = useState([])
    const [vaccine , setVaccine] = useState([])
    const [vaccineSel, setVaccineSel] = useState([])

    const [medical, setMedical] = useState({
        idappo: '',
        anamnesis: '123',
        weight: '',
        temperature: '',
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

    const [ file, setFile] = useState({
        before: '',
        after: '',
    })

    const handlePreview = (event) => {
        //setFile({...file,before: event.target.files[0]})
        setGrooming({...grooming,before: event.target.value})
        setFilePreview(URL.createObjectURL(event.target.files[0]))
    }

    const handlePreviewA = (event) => {
        //setFile({...file,after: event.target.files[0]})
        setGrooming({...grooming,after: event.target.value})
        setFilePreviewA(URL.createObjectURL(event.target.files[0]))
    }

    const handleUpload = () => {

        let photo1 = file.before
        const formdata = new FormData()
        formdata.append('file', photo1)
        axios.post('http://localhost:3001/public/upload',formdata)
        .then(function (res) {
            setGrooming({...grooming,before: res.data})
        })
        .catch(err => console.log(err))

    }

    const handleChange = (event) => {
        setDateCare(event.target.value);
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+event.target.value)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    };

    const handleOpen = (event) => {

        setMedical({...medical,idappo: event.target.dataset.appo})
        setValues({...values,idappo: event.target.dataset.appo})
        setGrooming({...grooming,idappo: event.target.dataset.appo})

        axios.get('https://api-vet-2utn.onrender.com/api/v1/vaccines')
        .then(res => setVaccine(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        let date = moment().format("YYYY-MM-DD")
        setDateCare(date);  
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+date)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    const handleSubmitMedic = (e) => {
        e.preventDefault();
        console.log(medical)
        axios.post('https://api-vet-2utn.onrender.com/api/v1/medical',medical)
        .then(res => {
            console.log(res);
            close.click();
            Swal.fire({
                position: "top-end",
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
                position: "top-end",
                icon: "error",
                title: "Ha ocurrido un error.",
                showConfirmButton: false,
                timer: 1500
              });
        })
    }

    const handleSubmitVaccine = (e) => {
        e.preventDefault();
        setValues({...values,idvaccine: vaccineSel});
        console.log(values)
        axios.post('https://api-vet-2utn.onrender.com/api/v1/plan',values)
        .then(res => {
            console.log(res);
            close.click();
            Swal.fire({
                position: "top-end",
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
                position: "top-end",
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

        setVaccineSel([...vaccineSel, {id : val, name : text}])
        
        setTimeout(() => {
            var table = document.querySelectorAll(".test");

            var list = [];
            table.forEach((input) => {
                list.push(parseInt(input.value));
              });

            setValues({...values,idvaccine: list});
            console.log(list)

        }, 500);

    }

    const handleSubmitGrooming = (e) => {
        e.preventDefault();
        //handleUpload()
        console.log(grooming)
        axios.post('https://api-vet-2utn.onrender.com/api/v1/grooming',grooming)
        .then(res => {
            console.log(res);
            close.click();
            Swal.fire({
                position: "top-end",
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
                position: "top-end",
                icon: "error",
                title: "Ha ocurrido un error.",
                showConfirmButton: false,
                timer: 1500
              });
        })
    }

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

return (
    <>
        <label for="" className="title">Atenciones</label>
        <div className="table-header">
            <input className="input-inset" type="text" placeholder="Buscar"/> 
            <input type="date" value={dateCare} onChange={handleChange} className="input input-text filter"/>
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
                            <a className="button button-edit" data-appo={care.idappointment} onClick={handleOpen} href={selectForm(care.idvetservices)}>Atender</a>
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
                                    <div className="preview-pet"><img src={filePreview} alt="" accept=".jpg, .jpeg, .png"></img></div>
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
                        <label for="anamnesis" className="label label-care">Anamnesis</label>
                        <div className="group-checkbox">
                            <label className="label-check"><input type="checkbox" id="anamnesis" /> ¿Ha tenido algún problema de salud que necesitara tratamiento?<span className="checkmark"></span></label>
                            <label className="label-check"><input type="checkbox" id="anamnesis" /> ¿Está al día con las vacunas? <span className="checkmark"></span></label>
                            <label className="label-check"><input type="checkbox" id="anamnesis" /> ¿Cuándo se realizó la última desparasitación? <span className="checkmark"></span></label>
                            <label className="label-check"><input type="checkbox" id="anamnesis" /> ¿Tomo actualmente alguna medicación? <span className="checkmark"></span></label>
                            <label className="label-check"><input type="checkbox" id="anamnesis" /> ¿Cómo es la alimentación de tu mascota? <span className="checkmark"></span></label>
                            <label className="label-check"><input type="checkbox" id="anamnesis" /> ¿Qué hábitos tiene tu mascota? <span className="checkmark"></span></label>
                        </div>
                        <div className="group-data-pet"> 
                            <label for="temperature" className="label">Temperatura (c°)</label>
                            <input type="number" id="temperature" className="input input-text" onChange={e => setMedical({...values,temperature: e.target.value})}/>
                            <label for="weight" className="label">Peso (kg)</label>
                            <input type="number" id="weight" className="input input-text" onChange={e => setMedical({...values,weight: e.target.value})}/>
                        </div>
                        <label for="sintomas" className="label label-care">Síntomas</label>
                        <div className="group-data-care"> 
                            <label className="label-check"><input value="1" type="checkbox" id="sintomas" /> Vómitos<span className="checkmark"></span></label>
                            <label className="label-check"><input value="2" type="checkbox" id="sintomas" /> Cansancio<span className="checkmark"></span></label>
                            <label className="label-check"><input value="3" type="checkbox" id="sintomas" /> Piel y pelaje<span className="checkmark"></span></label>
                            <label className="label-check"><input value="4" type="checkbox" id="sintomas" /> Aumento de peso<span className="checkmark"></span></label>
                            <label className="label-check"><input value="5" type="checkbox" id="sintomas" /> Respiración agitada<span className="checkmark"></span></label>
                            <label className="label-check"><input value="6" type="checkbox" id="sintomas" /> Diarrea<span className="checkmark"></span></label>
                        </div>
                        <label for="diagnostico" className="label label-care">Diagnóstico</label>
                        <div className="group-data-care"> 
                            <label className="label-check"><input value="1" type="checkbox" id="diagnostico" /> Otitis<span className="checkmark"></span></label>
                            <label className="label-check"><input value="2" type="checkbox" id="diagnostico" /> Conjuntivitis<span className="checkmark"></span></label>
                            <label className="label-check"><input value="3" type="checkbox" id="diagnostico" /> Rabia<span className="checkmark"></span></label>
                            <label className="label-check"><input value="4" type="checkbox" id="diagnostico" /> Leucemia felina<span className="checkmark"></span></label>
                            <label className="label-check"><input value="5" type="checkbox" id="diagnostico" /> Panleucopenia felina<span className="checkmark"></span></label>
                            <label className="label-check"><input value="6" type="checkbox" id="diagnostico" /> Inmunodeficiencia felina<span className="checkmark"></span></label>
                        </div>

                        <label for="treatment" className="label label-care">Tratamiento</label>
                        <textarea className="textarea" rows="3" id="treatment" onChange={e => setMedical({...values,treatment: e.target.value})}></textarea>
                
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
                        <label for="idvaccine" className="label">Plan de vacunación</label>
                        <select id="idvaccine" name="vaccine" className="input">
                            <option selected>Seleccionar</option>
                            {vaccine.map((vaccine,index) => {
                                return <option value={vaccine.idvaccine}>{vaccine.namevaccine}</option>
                            })}     
                        </select>
                        <a onClick={handleAddRow}>Agregar</a>
                        <table className="table-inventory" id="vaccine-table">
                            <tr>
                                <th>N°</th>
                                <th>Vacuna</th>
                            </tr>
                            {vaccineSel.map((vaccine,index) => {
                            return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td><input type="number" value={vaccine.id} className="test" hidden/>{vaccine.name}</td>
                                </tr>
                            })}  
                        </table>

                        <label for="temperature" className="label">Temperatura (c°)</label>
                        <input type="number" id="temperature" className="input input-text" onChange={e => setValues({...values,temperature: e.target.value})}/>

                        <label for="weight" className="label">Peso (kg)</label>
                        <input type="number" id="weight" className="input input-text" onChange={e => setValues({...values,weight: e.target.value})}/>

                        <label for="name" className="label">Histórico</label>

                        <table className="table-inventory">
                            <tr>
                                <td>N°</td>
                                <td>Fecha - Hora</td>
                                <td>Vacuna</td>
                            </tr>
                            <tr>
                                <td>Primera dosis</td>
                                <td>23/11/2023</td>
                                <td>ID2345HJ</td>
                            </tr>
                            <tr>
                                <td>Segunda dosis</td>
                                <td>23/12/2023</td>
                                <td>5834FG5</td>
                            </tr>
                            <tr>
                                <td>Tercera dosis</td>
                                <td>23/01/2024</td>
                                <td><input type="text" className="input input-table"/></td>
                            </tr>
                        </table>
                            
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