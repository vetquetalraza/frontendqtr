import { useEffect, useState } from 'react';
import '../styles/client.scss';
import Swal from 'sweetalert2'
import MyDataTable from '../components/Datatable';
import api from '../services/api';
import { useMediaQuery } from 'react-responsive';

const Client = () => {

    const isMobile = useMediaQuery({ maxWidth: 900 });
    const [data, setData] = useState([]);

    // Definimos las columnas para el DataTable
    const columns = [
        { name: "N°", cell: (row, index) => index + 1},
        { name: 'DNI', selector: row => row.dniclient, sortable: true },
        { name: 'Nombres y Apellidos', selector: row => row.nameclient + " " + row.surnameclient, sortable: true },
        { name: 'Celular', selector: row => row.phoneclient, sortable: true },
        { name: 'Correo', selector: row => row.emailclient, sortable: true },
        { name: 'Acciones', cell: row => <><a className="button button-edit" href="#popup1" onClick={() => handleList(row.dniclient)}>Editar</a><a className="button button-delete" onClick={() => handleDelete(row.dniclient)}>Eliminar</a></>}
    ];

    const columnsMobile = [
        {
            name: 'Datos',
            cell: row => (
            <div className="mobile-row">
                <div><strong>Nombre:</strong> {row.nameclient + " " + row.surnameclient}</div>
                <div><strong>DNI:</strong> {row.dniclient}</div>
                <div><strong>Teléfono:</strong> {row.phoneclient}</div>
                <div><strong>Email:</strong> {row.emailclient}</div>
                <div className="actions">
                    <a className="button button-edit" href="#popup1" onClick={() => handleList(row.dniclient)}>Editar</a>
                    <button className="button button-delete" onClick={() => handleDelete(row.dniclient)}>Eliminar</button>
                </div>
            </div>
            )
        }
    ];

    const initialValues = {
        dni: '',
        name: '',
        surname: '',
        address: '',
        email: '',
        phone: ''
    };

    const [values, setValues] = useState(initialValues)

    const [isReadOnly, setIsReadOnly] = useState(false);
    const [errors, setErrors] = useState({});

    const handleList = (id) => {
        setIsReadOnly(true)
        api.get('/clients/'+id)
        .then(res => {
            //console.log(res.data);
      
            setValues({...values,
                dni:res.data[0].dniclient,
                name:res.data[0].nameclient,
                surname:res.data[0].surnameclient,
                address:res.data[0].addressclient,
                email:res.data[0].emailclient,
                phone:res.data[0].phoneclient,});
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
                api.delete('/clients/'+id)
                .then(res => {
                    console.log(res);
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El registro fue eliminado.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                      });
                    handleClear();
                    handleLoad();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            const close = document.querySelector(".close");
            api.post('/clients',values)
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
    
                handleClear();
                handleLoad();
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


    const handleClear = () => {
    setValues(initialValues);
    };

    const handleLoad = () => {
        api.get('/clients')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    useEffect(()=>{
        handleLoad();
    }, [])

    const validateForm = () => {
        const newErrors = {};

        if (values.dni.length < 8) {
            newErrors.dni = 'Registre un mínimo de 8 dígitos';
        }

        if (!values.name) {
          newErrors.name = 'El nombre es requerido';
        }

        if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
          newErrors.email = 'El correo electrónico no es válido';
        }

        if (!values.phone) {
            newErrors.phone = 'El número de celular es requerido';
        }

        return newErrors;
    };

    const validateTextAndSet = (event) => {
        const { name, value } = event.target;
        // Permite solo letras y espacios
        const textOnlyValue = value.replace(/[^a-zA-Z\s]/g, '');
        setValues({...values,[name]: textOnlyValue,})
    };

    const validateNumberAndSet = (event) => {
        const { name, value } = event.target;
        // Permite solo números
        const numberOnlyValue = value.replace(/[^0-9]/g, '');
        setValues({...values,[name]: numberOnlyValue,})
    };

    const buscarDNI = async () => {
        if (values.dni.length < 8) {
            setErrors({...errors, dni: "Ingrese un número de identificación válido"})
            return;
        }

        try {
            const response = await api.get(`/dni/${values.dni}`);

            console.log(response)
            
            setValues({...values, surname: `${response.data.apellidoPaterno} ${response.data.apellidoMaterno}`,name: response.data.nombres});            
        
        } catch (e) {
            setErrors({...errors, dni: "No se encontró la información"})
        }
    };
    
    return (
        <>
        
        <div className="popup-header-tables">
            <label for="" class="title">Clientes</label>
            <a class="button button-new" onClick={() => setIsReadOnly(false)} href="#popup1">Nuevo Cliente</a>
        </div>
        
        <MyDataTable 
            columns={isMobile ? columnsMobile : columns}
            data={data}
            responsive
        />
        
        <div id="popup1" className="popup-overlay">
            <div className="popup-client">
                <div className="popup-header">
                    <label className="title">Datos cliente</label>
                    <a className="close" href="#" onClick={handleClear}>&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmit}>
        
                        <label for="dni" className="label">DNI</label>
                        <input type="text" id="dni" name="dni" className="input input-text" maxLength="12" onChange={validateNumberAndSet} value={values.dni} readOnly={isReadOnly} onKeyDown={(e) => e.key === "ArrowDown" && (e.preventDefault(), buscarDNI())}/>
                        {errors.dni && <label className="errorMsg">{errors.dni}</label>}

                        <label for="name" className="label">Nombres </label>
                        <input type="text" id="name" name="name" className="input input-text" maxLength="100" onChange={validateTextAndSet} value={values.name} />
                        {errors.name && <label className="errorMsg">{errors.name}</label>}

                        <label for="surname" className="label">Apellidos</label>
                        <input type="text" id="surname" name="surname" className="input input-text" maxLength="100" onChange={validateTextAndSet} value={values.surname} />
        
                        <label for="address" className="label">Dirección</label>
                        <textarea id="address" cols="20" rows="3" name="address" className="textarea" maxLength="250" onChange={e => setValues({...values,address: e.target.value})} value={values.address} ></textarea>
        
                        <label for="email" className="label">Email</label>
                        <input type="text" id="email" placeholder="" name="email" className="input input-email" maxLength="250" onChange={e => setValues({...values,email: e.target.value})} value={values.email} />
                        {errors.email && <label className="errorMsg">{errors.email}</label>}

                        <label for="phone" className="label">N° de celular</label>
                        <input type="text" id="phone" placeholder="" name="phone" className="input input-text" maxLength="20" onChange={validateNumberAndSet} value={values.phone} />
                        {errors.phone && <label className="errorMsg">{errors.phone}</label>}

                        <div className="button-section">
                            <input type="submit" value="Guardar" className="button primary-button"/> 
                        </div>
                            
                    </form>
                </div>
            </div>
        </div>
    </>      
    );
};

export default Client;