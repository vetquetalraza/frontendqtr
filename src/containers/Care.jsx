import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import moment from 'moment'; 

const Care = () => {

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
    const [ files, setFile] = useState([])

    const handlePreview = (event) => {
        setFile([...files,event.target.files[0]])
        setFilePreview(URL.createObjectURL(event.target.files[0]))
    }

    const handlePreviewA = (event) => {
        setFile([...files,event.target.files[0]])
        setFilePreviewA(URL.createObjectURL(event.target.files[0]))
    }

    const handleUpload = (event) => {
        const formdata = new FormData()
        formdata.append('file', files)
        axios.post('https://api-vet-2utn.onrender.com/public/upload',formdata)
        .then(function (res) {
            console.log(res.data)
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
        let date = moment().format("YYYY-MM-DD")
        setDateCare(date);  
        axios.get('https://api-vet-2utn.onrender.com/api/v1/care/'+date)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }, []);

    const handleSubmitMedic = (e) => {
        e.preventDefault();
        console.log(medical)
        axios.post('https://api-vet-2utn.onrender.com/api/v1/medical',medical)
        .then(res => {

        })
        .catch(err => console.log(err))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values,idvaccine: vaccineSel})
        console.log(values)
        axios.post('https://api-vet-2utn.onrender.com/api/v1/plan',values)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
    
    const handleSubmitGrooming = (e) => {
        e.preventDefault();
        handleUpload();
        console.log(grooming)
        axios.post('https://api-vet-2utn.onrender.com/api/v1/grooming',grooming)
        .then(res => console.log(res))
        .catch(err => console.log(err))
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
                            <a className="button button-edit" data-appo={care.idappointment} onClick={handleOpen} href="#popup3">Atender</a>
                        </td>
                    </tr>
                })}  
            </tbody>
        </table>
        <div id="popup1" className="overlay">
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
        <div id="popup2" className="overlay">
            <div className="popup-care">
                <div className="popup-header">
                    <label className="title">Datos Vacunación</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmit}>
                        <label for="idvaccine" className="label">Plan de vacunación</label>
                        <select id="idvaccine" name="vaccine" className="input" onChange={e => setVaccineSel(vaccineOld => [...vaccineOld,e.target.value])}>
                            <option selected>Seleccionar</option>
                            {vaccine.map((vaccine,index) => {
                                return <option value={vaccine.idvaccine}>{vaccine.namevaccine}</option>
                            })}     
                        </select>

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
        <div id="popup3" className="overlay">
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
    </>
);

}

export default Care;