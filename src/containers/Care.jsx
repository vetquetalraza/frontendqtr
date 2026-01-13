import { useEffect, useState } from 'react';
import '../styles/care.scss';
import moment from 'moment'; 
import Swal from 'sweetalert2'
import Select from 'react-select'
import MyDataTable from '../components/Datatable';
import api from '../services/api';
import { useMediaQuery } from 'react-responsive';

const Care = () => {
    
    const isMobile = useMediaQuery({ maxWidth: 600 });
    const close = document.querySelector(".close");
    const [data, setData] = useState([])
    const [vaccine , setVaccine] = useState([])
    const [history , setHistory] = useState([])
    const [symptoms , setSymptoms] = useState([])
    const [diagnosis , setDiagnosis] = useState([])
    const [medicines , setMedicines] = useState([])
    const [errors, setErrors] = useState({});

    // Definimos las columnas para el DataTable
    const columns = [
        { name: "N°", cell: (row, index) => index + 1},
        { name: 'Fecha y Hora', selector: row => row.dateappointment + " " + row.timeappointment, sortable: true },
        { name: 'Cliente', selector: row => row.nameclient + " " + row.surnameclient, sortable: true },
        { name: 'Mascota', selector: row => row.namepet, sortable: true },
        { name: 'Especie', selector: row => row.namespeciepet, sortable: true },
        { name: 'Servicio', selector: row => row.namevetservices, sortable: true },
        { name: 'Estado', selector: row => <><label className="text-wait">{row.statusappointment === '1' ? 'Agendado' : ''}</label></>, sortable: true },
        { name: 'Acciones', cell: row => <><a className="button button-edit" data-appo={row.idappointment} data-pet={row.idpet} onClick={handleOpen} href={selectForm(row.idvetservices)}>Atender</a></>}
    ];
    

    const columnsMobile = [
        {
            name: 'Datos',
            cell: row => (
            <div className="mobile-row">
                <div><strong>Fecha y Hora:</strong> {row.dateappointment + " " + row.timeappointment}</div>
                <div><strong>Cliente:</strong> {row.nameclient + " " + row.surnameclient}</div>
                <div><strong>Mascota:</strong> {row.namespeciepet + " - " + row.namepet}</div>
                <div><strong>Servicio:</strong> {row.namevetservices}</div>
                <div><strong>Estado:</strong><label className="text-wait">{row.statusappointment === '1' ? ' Agendado' : ''}</label></div>
                <div className="actions">
                    <a className="button button-edit" data-appo={row.idappointment} data-pet={row.idpet} onClick={handleOpen} href={selectForm(row.idvetservices)}>Atender</a>
                </div>
            </div>
            )
        }
    ];
    
    const initialValuesMedical =  {
        idappo: '',
        anamnesis: '',
        weight: '',
        temperature: '',
        symptoms: [],
        diagnosis: [],
        materials: [],
        treatment: ''
    }

    const [medical, setMedical] = useState(initialValuesMedical)

    const initialValuesGroo =  {
        idappo: '',
        before: '',
        after: '',
        comment: ''
    }
    const [grooming, setGrooming] = useState(initialValuesGroo)

    const initialValuesVaccine =  {
        idappo: '',
        idvaccine: [],
        weight: '',
        temperature: '',
        comments: ''
    }
    const [values, setValues] = useState(initialValuesVaccine)

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
        .then(res => {
            setVaccine(Array.from(res.data));
            //console.log(res.data);
        })
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
    const [materials, setMaterials] = useState([]);
    const [newIdMaterial, setNewIdMaterial] = useState('');
    const [newMaterial, setNewMaterial] = useState('');
    const [newDosage, setNewDosage] = useState('');

    // Función para manejar la eliminación de una fila
    const handleDelete = (id) => {
        setMaterials(materials.filter(row => row.id !== id));
    };

    // Función para manejar el agregado de una nueva fila
    const handleAdd = () => {
        if (newIdMaterial && newMaterial && newDosage) {
        const newRow = {
            id: newIdMaterial,
            material: newMaterial,
            dosis: newDosage
        };
        setMedical({
        ...medical,
        materials: [...medical.materials, [parseInt(newRow.id), newRow.dosis]]
        });
        setMaterials([...materials, newRow]);
        
        // Limpiar los campos después de agregar
        setNewIdMaterial('');
        setNewMaterial('');
        setNewDosage('');
        
        }
        //console.log(medical)
    };

    const validateMedical= () => {

        const newErrorsMed = {};

        if (!medical.anamnesis) {
          newErrorsMed.anamnesis = 'Anamnesis es un dato requerido';
        }

        if (!medical.weight) {
          newErrorsMed.weightm = 'El peso es requerido';
        }

        if (!medical.temperature) {
          newErrorsMed.temperaturem = 'La temperatura es requerida';
        }

        if (medical.symptoms.length === 0) {
          newErrorsMed.symptoms = 'Síntomas es un dato requerido';
        }
        
        if (medical.diagnosis.length === 0) {
          newErrorsMed.diagnosis = 'Diagnóstico es un dato requerido';
        }

        if (!medical.treatment) {
          newErrorsMed.treatment = 'Tratamiento es un dato requerido';
        }

        return newErrorsMed;
    };

    const handleSubmitMedic = (e) => {
        e.preventDefault();

        //console.log(medical)
        const validationErrors = validateMedical();
        if (Object.keys(validationErrors).length === 0) {

            //console.log(medical)
            api.post('/medical/',medical)
            .then(res => {
                //console.log(res);
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
                //console.log(err);
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

    //PLAN DE VACUNACIÓN

    const validatePlan= () => {

        const newErrorsPlan = {};

        if (values.idvaccine.length === 0) {
          newErrorsPlan.idvaccine = 'La vacuna es requerida';
        }

        if (!values.weight) {
          newErrorsPlan.weight = 'El peso es requerido';
        }

        if (!values.temperature) {
          newErrorsPlan.temperature = 'La temperatura es requerida';
        }

        return newErrorsPlan;
    };

    const handleSubmitVaccine = (e) => {
        e.preventDefault();
        //console.log(values)
        const validationErrors = validatePlan();
        if (Object.keys(validationErrors).length === 0) {

            //console.log(values)
            api.post('/plan/',values)
            .then(res => {
                //console.log(res);
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
                //console.log(err);
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
    
    const [vaccines, setVaccines] = useState([]);
    const [newIdVaccine, setNewIdVaccine] = useState('');
    const [newVaccine, setNewVaccine] = useState('');
    const [newNumber, setNewNumber] = useState('');

    // Función para manejar la eliminación de una fila
    const handleDeleteVaccine = (id) => {
        setVaccines(vaccines.filter(row => row.id !== id));
    };

    const handleAddVaccine = () => {

        if (newIdVaccine && newVaccine && newNumber) {
        const newRow = {
            id: newIdVaccine,
            name: newVaccine,
            dosis: newNumber
        };
        setValues({
        ...values,
        idvaccine: [...values.idvaccine, [parseInt(newRow.id), newRow.dosis]]
        });
        setVaccines([...vaccines, newRow]);
        
        // Limpiar los campos después de agregar
        setNewIdVaccine('');
        setNewVaccine('');
        setNewNumber('');
        
        }
    }

    //GROOMING
    const validateGrooming= () => {

        const newErrorsGro = {};

        if (!file) {
          newErrorsGro.before = 'La foto de antes es requerida';
        }

        if (!file2) {
          newErrorsGro.after = 'La foto del después es requerida';
        }

        return newErrorsGro;
    };

    const handleSubmitGrooming = (e) => {
        e.preventDefault();
        //console.log(grooming)

        const validationErrors = validateGrooming();
        if (Object.keys(validationErrors).length === 0) {

            const formData = new FormData();

            Object.entries(grooming).forEach(([k,v]) => {
            if (k !== "before" && k !== "after") {
                formData.append(k,v);
            }
            });

            if (file) {
            formData.append("beforePhoto", file);
            }

            if (file2) {
            formData.append("afterPhoto", file2);
            }

            //console.log(formData)

            api.post('/grooming/',formData)
            .then(res => {
                //console.log(res);
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

        } else {
          setErrors(validationErrors);
        }      
    }

    //GROOMING PHOTO
    const [file, setFile] = useState(null);
    const [file2, setFile2] = useState(null);
    const [filePath, setFilePath] = useState('');
    const [filePath2, setFilePath2] = useState('');

    const onFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        setFilePath(URL.createObjectURL(file))
    };

    const onFileChange2 = (event) => {
        const file2 = event.target.files[0];
        setFile2(file2);
        setFilePath2(URL.createObjectURL(file2));
    };

return (
    <>
        <label for="" className="title">Atenciones</label>
        <div className="table-header-history">
            <div>
                <label htmlFor="" className="label">Inicio</label>
                <input type="date" id="startDate" className="input"/>
            </div>
            <div>
                <label htmlFor="" className="label">Fin</label>
                <input type="date" id="endDate" className="input"/>
            </div>
            <div className="button-section">
                <button onClick={handleChange} className="button primary-button">Filtrar</button>
            </div>
        </div>
        <MyDataTable 
            columns={isMobile ? columnsMobile : columns}
            data={data}
            responsive
        />
        <div id="popup1" className="popup-overlay">
            <div className="popup-grooming">
                <div className="popup-header">
                    <label className="title">Datos grooming</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmitGrooming}>
                        <div className="contentPhotos">
                            <div className="columnPhoto">
                                <label for="before" className="file-upload"><span>Sube una foto del antes!</span>
                                <input id="before" type="file" onChange={onFileChange}/></label>
                                <div className="preview-pet"><img src={filePath} alt="" accept=".jpg, .jpeg, .png" ></img></div>
                                {errors.before && <label className="errorMsg">{errors.before}</label>}
                            </div>
                            <div className="columnPhoto">
                                <label for="after" className="file-upload"><span>Sube una foto de ahora!</span>
                                <input id="after" type="file" placeholder="" onChange={onFileChange2}/></label>
                                <div className="preview-pet"><img src={filePath2} alt="" accept=".jpg, .jpeg, .png"></img></div>
                                {errors.after && <label className="errorMsg">{errors.after}</label>}
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
        <div id="popup2" className="popup-overlay">
            <div className="popup-medical">
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
                                {errors.anamnesis && <label className="errorMsg">{errors.anamnesis}</label>}

                                <label for="temperature" className="label">Temperatura (c°)</label>
                                <input type="number" id="temperature" min="0" step="0.1" className="input input-text" onChange={e => setMedical({...medical,temperature: e.target.value})}/>
                                {errors.temperaturem && <label className="errorMsg">{errors.temperaturem}</label>}

                                <label for="weight" className="label">Peso (kg)</label>
                                <input type="number" id="weight" min="0" step="0.1" className="input input-text" onChange={e => setMedical({...medical,weight: e.target.value})}/>
                                {errors.weightm && <label className="errorMsg">{errors.weightm}</label>}

                            </div>
                            <div className="column2">
                                <label for="sintomas" className="label label-care">Síntomas</label>{errors.symptoms && <label className="errorMsg">{errors.symptoms}</label>}
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
                        
                                <label for="diagnostico" className="label label-care">Diagnóstico</label>{errors.diagnosis && <label className="errorMsg">{errors.diagnosis}</label>}
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
                               
                                <label for="materials" className="label label-care">Medicamentos</label>
                                <Select
                                closeMenuOnSelect={true}
                                id="materials"
                                className="label"
                                placeholder="Seleccionar"
                                options={medicines}
                                value={medicines.find(opt => opt.value === newIdMaterial) || null}
                                onChange={(option) => {
                                    setNewIdMaterial(option.value);      // ID
                                    setNewMaterial(option.label);        // Texto
                                }}
                                />
                                <label for="dosage" className="label label-care">Cantidad</label>
                                <div className="fields-add">
                                    <div>
                                        <input type="number" value={newDosage} id="dosage" min="0" step="0.01" className="input" onChange={(e) => setNewDosage(e.target.value)}/>
                                    </div>
                                    <div className="div-add"><a onClick={handleAdd} className="button button-edit">Agregar</a></div>
                                </div>


                                <table className="table-inventory">
                                    <thead>
                                    <tr>
                                        <th>N°</th>
                                        <th>Medicamento</th>
                                        <th>Cantidad</th>
                                        <th>Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {materials.map( (row,index) => (
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
                                {errors.medicines && <label className="errorMsg">{errors.medicines}</label>}
                            </div> 
                        </div>  
                        <label for="treatment" className="label label-care">Tratamiento</label>
                        <textarea className="textarea" rows="3" id="treatment" onChange={e => setMedical({...medical,treatment: e.target.value})}></textarea>
                        {errors.treatment && <label className="errorMsg">{errors.treatment}</label>}
                        
                        <div className="button-section">
                                <input type="submit" value="Guardar" className="button primary-button"/> 
                        </div>     
                    </form>
                </div>
             </div>
        </div>
        <div id="popup3" className="popup-overlay">
            <div className="popup-vaccine">
                <div className="popup-header">
                    <label className="title">Datos Vacunación</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmitVaccine}>
                        <div className="div-select">
                            <label for="idvaccine" className="label">Seleccione vacuna</label>
                            <Select
                            closeMenuOnSelect={true}
                            id="idvaccine"
                            className="label"
                            placeholder="Seleccionar"
                            options={vaccine}
                            value={vaccine.find(opt => opt.value === newIdVaccine) || null}
                            onChange={(option) => {
                                setNewIdVaccine(option.value);      
                                setNewVaccine(option.label);        
                            }}
                            />
                        </div>
                        <label for="idvaccine" className="label">Número dosis</label>
                        <div className="fields-add">
                            <div>
                                <input name="numero" type="number" value={newNumber} id="dosage" min="0" step="1" className="input input-text" onChange={(e) => setNewNumber(e.target.value)}/>
                            </div>
                            <div className="div-add"><a onClick={handleAddVaccine} className="button button-edit">Agregar</a></div>
                        </div>
                        <div className="tables-data-vaccine">
                            <div>
                                <table className="table-inventory" id="table-vaccine">
                                    <caption>Plan de vacunación</caption>
                                    <thead>
                                        <tr>
                                            <th>N°</th> 
                                            <th>Nombre vacuna</th>
                                            <th>Número de dosis</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {vaccines.map((vaccine,index) => {
                                    return <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{vaccine.name}</td>
                                            <td>{vaccine.dosis}</td>
                                            <td>
                                                <button className="button button-delete" onClick={() => handleDeleteVaccine(vaccine.id)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    })} 
                                    </tbody> 
                                </table>
                                {errors.idvaccine && <label className="errorMsg">{errors.idvaccine}</label>}
                            </div>
                            <div>
                                <table className="table-inventory">
                                    <caption>Historial de Vacunación</caption>
                                    <thead>
                                        <tr>
                                            <th>N°</th> 
                                            <th>Nombre vacuna</th>
                                            <th>Número de dosis</th>
                                            <th>Fecha aplicación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {history.map((history,index) => {
                                    return <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{history.namedrug}</td>
                                            <td>{history.numbervaccine}</td>
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
                                    {errors.temperature && <label className="errorMsg">{errors.temperature}</label>}
                                </div>
                                <div>
                                    <label for="weight" className="label">Peso (kg) </label>
                                    <input type="number" id="weight" className="input input-text" min="0" step="0.1" onChange={e => setValues({...values,weight: e.target.value})}/>
                                    {errors.weight && <label className="errorMsg">{errors.weight}</label>}
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