import { useEffect, useState } from 'react';
import '../styles/inventory.scss';
import Swal from 'sweetalert2'
import MyDataTable from '../components/Datatable';
import api from '../services/api';
import { useMediaQuery } from 'react-responsive';

const Inventory = () => {

    const isMobile = useMediaQuery({ maxWidth: 600 });
    const [data, setData] = useState([])
    const [errors, setErrors] = useState({});

    const initialValuesDrug = {
        iddrug: null,
        name: '',
        description: '',
        presentation: '',
        quantity: '',
        category: '',
        brand: ''
    }

    const [values, setValues] = useState(initialValuesDrug)

    const initialValuesBatches = {
        iddrug: '',
        number: '',
        quantity: '',
        startdate: '',
        duedate: '',
    }

    const [income, setIncome] = useState(initialValuesBatches)

    // Definimos las columnas para el DataTable
    const columns = [
        { name: "N°", cell: (row, index) => index + 1},
        { name: 'Nombre', selector: row => row.namedrug, sortable: true },
        { name: 'Marca', selector: row => row.branddrug, sortable: true },
        { name: 'Descripción', selector: row => row.descriptiondrug, sortable: true },
        { name: 'Presentación', selector: row => row.presentationdrug + " " + row.quantityperpresentation, sortable: true },
        { name: 'Stock', selector: row => row.total_batches - row.total_history, sortable: true },
        { name: 'Acciones', cell: row => <><a class="button button-add" href="#popup2" data-drug={row.iddrug} onClick={e => setIncome({...income,iddrug: e.target.dataset.drug})}>Agregar</a><a class="button button-edit" href="#popup" onClick={() => handleList(row.iddrug)}>Editar</a></>}
    ];

    const columnsMobile = [
        {
            name: 'Datos',
            cell: row => (
            <div className="mobile-row">
                <div><strong>Nombre:</strong> {row.namedrug}</div>
                <div><strong>Marca:</strong> {row.branddrug}</div>
                <div><strong>Descripción:</strong> {row.descriptiondrug}</div>
                <div><strong>Presentación:</strong> {row.presentationdrug + " " + row.quantityperpresentation}</div>
                <div><strong>Stock:</strong> {row.total_batches - row.total_history}</div>
                <div className="actions">
                    <><a class="button button-add" href="#popup2" data-drug={row.iddrug} onClick={e => setIncome({...income,iddrug: e.target.dataset.drug})}>Agregar</a><a class="button button-edit" href="#popup" onClick={() => handleList(row.iddrug)}>Editar</a></>
                </div>
            </div>
            )
        }
    ];

    const validateDrugs = () => {
        const newErrors = {};

        if (!values.name) {
          newErrors.name = '*Campo requerido';
        }

        if (!values.presentation) {
            newErrors.presentation = '*Campo requerido';
        }

        if (!values.quantity) {
            newErrors.quantity = '*Campo requerido';
        }

        if (!values.category) {
            newErrors.category = '*Campo requerido';
        }

        if (!values.brand) {
            newErrors.brand = '*Campo requerido';
        }

        return newErrors;
    };

    const handleClear = () => {
        setValues(initialValuesDrug)
    }

    const handleClearBatch = () => {
        setIncome(initialValuesBatches)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateDrugs();
        if (Object.keys(validationErrors).length === 0) {
            //console.log(values);
            const close = document.querySelector(".close");

            if (values.iddrug) {
                api.patch('/drugs/'+values.iddrug,values)
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
                    handleLoad();
                    handleClear();
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
                });
              } else {
                api.post('/drugs/',values)
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
                    handleLoad();
                    handleClear();
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
                });
            }
            

        } else {
          setErrors(validationErrors);
        }  
    }

    //STOCK

    const validateStock = () => {
        const newErrors = {};

        if (!income.number) {
          newErrors.number = '*Campo requerido';
        }

        if (!income.quantity) {
            newErrors.quantitys = '*Campo requerido';
        }

        if (!income.startdate) {
            newErrors.startdate = '*Campo requerido';
        }

        if (!income.duedate) {
            newErrors.duedate = '*Campo requerido';
        }

        return newErrors;
    };


    const handleSubmitStock = (e) => {
        e.preventDefault();

        const validationErrors = validateStock();
        if (Object.keys(validationErrors).length === 0) {
            //console.log(income);
            const close = document.querySelector(".close");
            api.post('/batch/',income)
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
                handleLoad();
                handleClearBatch();
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
        api.get('/drugs/'+id)
        .then(res => {   
            console.log(res.data)   
            setValues({...values,
                iddrug: id,
                name:res.data[0].namedrug,
                description:res.data[0].descriptiondrug,
                brand:res.data[0].branddrug,
                presentation:res.data[0].presentationdrug,
                quantity:res.data[0].quantityperpresentation,
                category:res.data[0].categorydrug,});
        }).catch(err => console.log(err))
    }

    const handleLoad = () => {
        api.get('/drugs')
        .then(res => setData(Array.from(res.data)))
        .catch(err => console.log(err));
    }
    
    useEffect(()=>{
        handleLoad()
    }, [])


return (
    <>
        <div class="popup-header-tables">
            <label for="" class="title">Medicamentos e Insumos</label>
            <a class="button button-new" href="#popup">Nuevo ingreso</a>
        </div>
        <MyDataTable 
            columns={isMobile ? columnsMobile : columns}
            data={data}
            responsive
        />
        <div id="popup" className="popup-overlay">
            <div className="popup-inventory">
                <div className="popup-header">
                    <label className="title">Datos Medicamentos</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmit} >

                        <label for="name" className="label">Nombre Medicina</label>
                        <input type="text" id="name" placeholder=""  value={values.name} onChange={e => setValues({...values,name: e.target.value})} className="input input-text"/>
                        {errors.name && <label className="errorMsg">{errors.name}</label>}

                        <label for="description" className="label">Descripcion Medicina</label>
                        <input type="text" id="description" placeholder=""  value={values.description} onChange={e => setValues({...values,description: e.target.value})} className="input input-text"/>
                        
                        <label for="category" className="label">Categoría</label>
                        <select id="specie" name="category" className="input" value={values.category} onChange={e => setValues({...values,category: e.target.value})}>
                            <option  selected>Seleccionar</option>
                            <option value="Anestesicos y Tranquilizantes">Anestesicos y Tranquilizantes</option>
                            <option value="Antibióticos y Antiinflamatorios">Antibióticos y Antiinflamatorios</option>
                            <option value="Antiparasitario">Antiparasitario</option>
                            <option value="Espectorantes">Espectorantes</option>
                            <option value="Insumo">Insumo</option>
                            <option value="Vacuna">Vacuna</option>
                            <option value="Vitaminas, aminoácidos y minerales">Vitaminas, aminoácidos y minerales</option>
                        </select>
                        {errors.category && <label className="errorMsg">{errors.category}</label>}

                        <label for="brand" className="label">Marca Medicina </label>
                        <input type="text" id="brand" placeholder="" value={values.brand} onChange={e => setValues({...values,brand: e.target.value})} className="input input-text"/>
                        {errors.brand && <label className="errorMsg">{errors.brand}</label>}

                        <label for="presentation" className="label">Presentación</label>
                        <select id="presentation" name="specie" className="input" value={values.presentation} onChange={e => setValues({...values,presentation: e.target.value})}>
                            <option  selected>Seleccionar</option>
                            <option value="Gel Ml">Gel Ml</option>
                            <option value="Gel Mg">Gel Mg</option>
                            <option value="Frasco Ml">Frasco Ml</option>
                            <option value="Frasco Mg">Frasco Mg</option>
                            <option value="Unidad Ml">Unidad Ml</option>
                            <option value="Unidad Mg">Unidad Mg</option>
                            <option value="Tableta Ml">Tableta Ml</option>
                            <option value="Tableta Mg<">Tableta Mg</option>
                        </select>
                        {errors.presentation && <label className="errorMsg">{errors.presentation}</label>}

                        <label for="quantity" className="label">Cantidad por presentación</label>
                        <input type="text" id="quantity" placeholder=""  value={values.quantity} onChange={e => setValues({...values,quantity: e.target.value})} className="input input-text"/>
                        {errors.quantity && <label className="errorMsg">{errors.quantity}</label>}

                        <div className="button-section">
                            <input type="submit" value="Guardar" className="button primary-button"/> 
                        </div>
                            
                    </form>
                </div>
            </div>
        </div>
        <div id="popup2" className="popup-overlay">
            <div className="popup-batches">
                <div className="popup-header">
                    <label className="title">Registro de entradas</label>
                    <a className="close" href="#">&times;</a>
                </div>
                <div className="content">
                    <form action="/" className="form" onSubmit={handleSubmitStock} >

                        <label for="batch" className="label">Número de Lote</label>
                        <input type="text" id="batch" placeholder=""  onChange={e => setIncome({...income,number: e.target.value})} className="input input-text"/>
                        {errors.number && <label className="errorMsg">{errors.number}</label>}

                        <label for="startdate" className="label">Fecha de Fabricación</label>
                        <input type="date" id="startdate" placeholder=""  onChange={e => setIncome({...income,startdate: e.target.value})} className="input input-text"/>
                        {errors.startdate && <label className="errorMsg">{errors.startdate}</label>}

                        <label for="duedate" className="label">Fecha de Vencimiento</label>
                        <input type="date" id="duedate" placeholder=""  onChange={e => setIncome({...income,duedate: e.target.value})} className="input input-text"/>
                        {errors.duedate && <label className="errorMsg">{errors.duedate}</label>}

                        <label for="quantity" className="label">Cantidad</label>
                        <input type="number" id="quantity" placeholder=""   onChange={e => setIncome({...income,quantity: e.target.value})} className="input input-text"/>
                        {errors.quantitys && <label className="errorMsg">{errors.quantitys}</label>}

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

export default Inventory;