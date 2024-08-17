import React, { useEffect, useState } from 'react';
import '../styles/global.scss';
import axios from 'axios';
import Swal from 'sweetalert2'
import MyDataTable from '../components/Datatable';

const Client = () => {

    const url = 'https://api-vet-2utn.onrender.com/api/v1/clients/';
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

    const [values, setValues] = useState({
        dni: '',
        name: '',
        surname: '',
        address: '',
        email: '',
        phone: ''
    })

    const [isReadOnly, setIsReadOnly] = useState(false);
    const [errors, setErrors] = useState({});

    const handleList = (id) => {
        setIsReadOnly(true)
        axios.get(url+id)
        .then(res => {
            console.log(res.data);
      
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
                axios.delete(url+id)
                .then(res => {
                    console.log(res);
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El registro fue eliminado.",
                        icon: "success",
                        showConfirmButton: false
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
    
                handleClear();
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

    const handleClear = () => {
        setValues({...values,
            dni:'',
            name:'',
            surname:'',
            address:'',
            email:'',
            phone:''
        })
    }

    const handleLoad = () => {
        axios.get(url)
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }

    useEffect(()=>{
        handleLoad();
    }, [])

    const validateForm = () => {
        const newErrors = {};

        if (!values.dni) {
            newErrors.dni = 'El DNI es requerido';
        }

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
    
    return (
        <>
        <label for="" class="title">Clientes</label>
        <div class="table-header">
            <input class="input-inset" type="text" placeholder="Buscar"/> 
            <a class="button button-new" onClick={() => setIsReadOnly(false)}href="#popup1">Nuevo Cliente</a>
        </div>
        
        <MyDataTable columns={columns} data={data} />
        <div id="popup1" className="overlay">
            <div className="popup">
                <div className="popup-header">
                    <label className="title">Datos cliente</label>
                    <a className="close" href="#" onClick={handleClear}>&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmit}>
        
                        <label for="dni" className="label">DNI</label>
                        <input type="text" id="dni" name="dni" className="input input-text" maxLength="12" onChange={validateNumberAndSet} value={values.dni} readOnly={isReadOnly} />
                        {errors.dni && <label style={{ color: 'red' }}>{errors.dni}</label>}

                        <label for="name" className="label">Nombres </label>
                        <input type="text" id="name" name="name" className="input input-text" maxLength="100" onChange={validateTextAndSet} value={values.name} />
                        {errors.name && <label style={{ color: 'red' }}>{errors.name}</label>}

                        <label for="surname" className="label">Apellidos</label>
                        <input type="text" id="surname" name="surname" className="input input-text" maxLength="100" onChange={validateTextAndSet} value={values.surname} />
        
                        <label for="address" className="label">Dirección</label>
                        <textarea id="address" cols="20" rows="3" name="address" className="textarea" maxLength="250" onChange={e => setValues({...values,address: e.target.value})} value={values.address} ></textarea>
        
                        <label for="email" className="label">Email</label>
                        <input type="text" id="email" placeholder="" name="email" className="input input-email" maxLength="250" onChange={e => setValues({...values,email: e.target.value})} value={values.email} />
                        {errors.email && <label style={{ color: 'red' }}>{errors.email}</label>}

                        <label for="phone" className="label">N° de celular</label>
                        <input type="text" id="phone" placeholder="" name="phone" className="input input-text" maxLength="20" onChange={validateNumberAndSet} value={values.phone} />
                        {errors.phone && <label style={{ color: 'red' }}>{errors.phone}</label>}

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