import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid' 
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState } from 'react';
import EventItem from '../hooks/useGetEvent';
import Swal from 'sweetalert2'
import moment from 'moment'; 
import api from '../services/api';

export default function Calendar() {

const close = document.querySelector(".close");

const [events, setEvents] = useState([]);
const [isReadOnly, setIsReadOnly] = useState(false);
const [isDisabled, setIsDisabled] = useState(false);
const [errors, setErrors] = useState({});
const [dataClient, setDataClient] = useState('');
const [doctor, setDoctor] = useState('');
const [values , setValues] = useState({
  idappo: '',
  idpet:'',
  idservice: '',
  dateappo: '',
  timeappo: '',
  timeendappo: '',
  comment: '',
  status: ''
})

const getColor = (e) => {
  var color = '';
  switch (e) {
    case 1:
      color = '#F08080';
      break;
    case 2:
      color = '#AA77C3';
      break;
    case 3:
      color = '#5D58D7';
      break;  
  }
  return color
}

const load = () => {
  api.get('/appointments')
  .then(res => {
    
    var data = Array.from(res.data);
    var lista = [];
    data.map((element, index) => {
      let varStart = element.dateappointment + " " + element.timeappointment
      let varEnd = element.dateappointment + " " + element.timeaendppointment
      let color = getColor(element.idvetservices);

      lista.push(
        {
          title: element.namevetservices,
          id: element.idappointment,
          start: varStart,
          end: varEnd,
          rendering: 'background',
          color:color
        }
      )
    })

    setEvents(lista);
  })
  .catch(err => console.log(err));

  console.log(events);
}

useEffect(()=>{

  load();
  setNameClient({nameclient: "Nombre del",surnameclient: "Usuario"});

}, [])

//Listar nombres de cliente
const [nameClient, setNameClient] = useState([])

const getName = (e) =>{
    if (e.target.value.length >= 8) {
        setValues({...values,client: e.target.value})
        api.get('/clients/' + e.target.value)
        .then( res => {
            if(res.data[0]){
                setNameClient(res.data[0]);
                getPets(e.target.value);
            }
            else{
                setNameClient({nameclient: "Usuario",surnameclient: "Desconocido"});
    }})
        //.then(res => console.log((res.data[0])))
        .catch(err => console.log(err));
    }
   else {
      setNameClient({nameclient: "Nombre del",surnameclient: "Usuario"});
   }
}

//Listar nombres de mascotas
const [namePets, setNamePets] = useState([])

const getPets = (id) =>{

  api.get('/pets/client/' + id)
  .then( res => setNamePets(Array.from(res.data)))
  .catch(err => console.log(err));

}


//End nombre mascotas

const handleSelect = (info) => {
    const start = info.dateStr
    setIsReadOnly(true)
    setIsDisabled(true)
    setValues({...values,timeappo: moment(start).format("HH:mm"),dateappo: moment(start).format("yyyy-MM-DD"),status:1,idappo:0})

    const popup = document.getElementById("btnPopup");
    popup.click()

    document.getElementById("dataclient").style.display = "block"
    document.getElementById("resume").style.display = "none"

  };

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(values)
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        api.post('/appointments/',values)
        .then(res => {
          //console.log(res.data[0].agendar_cita);
          const result = res.data[0].agendar_cita;
          if (result == 66 ) {
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
            handleClear();
            //Actualizar vista
            load()
          } else if (result == 99 ) {
              Swal.fire("No se puede agendar en fechas anteriores");
          } else if (result == 88 ) {
              Swal.fire("El paciente ya tiene una cita en ese horario");
          }

        }).catch(err => {
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

const handleEventClick = (info) => {

  document.getElementById("dataclient").style.display = "none"
  document.getElementById("resume").style.display = "block"
  setIsReadOnly(false)
  setIsDisabled(false)

  const popup = document.getElementById("btnPopup");
  popup.click()

  api.get("/appointments/"+info.event.id)
  .then(res => {
      console.log(res.data)
      setDataClient("Cliente: " + res.data[0].nameclient + " " + res.data[0].surnameclient + " // Mascota: " +res.data[0].namepet)
      setValues({...values,
          idappo: res.data[0].idappointment,
          idpet: res.data[0].idpet,
          idservice: res.data[0].idvetservices,
          dateappo: res.data[0].dateappointment,
          timeappo: res.data[0].timeappointment,
          timeendappo: res.data[0].timeaendppointment,
          comment: res.data[0].commentappointment,
          status: res.data[0].statusappointment});
  }).catch(err => console.log(err))

};

const handleClear = () => {
  setNameClient({nameclient: "Nombre del",surnameclient: "Usuario"});
  setValues({...values,
    idappo: '',
    idpet:'',
    idservice: '',
    dateappo: '',
    timeappo: '',
    timeendappo: '',
    comment: '',
    status: ''
  })
}

const convertirAHoras = (hora) => {
  const [h, m] = hora.split(':');
  return parseInt(h) * 60 + parseInt(m);
};

const changeService = (value) => {
  setValues({...values,idservice: value })
  console.log(value)
  if (value == 1) {
    setDoctor("Valeria Campos Ramos")
  } else {
    setDoctor("Juan Huamaní Gómez")
  }
}

const validateForm = () => {
  const newErrors = {};
  
  if (!values.idpet) {
    newErrors.idpet = 'El nombre de mascota es requerido';
  }
  
  if (!values.idservice) {
    newErrors.idservice = 'El servicio requerido';
  }

  if (!values.dateappo) {
    newErrors.dateappo = 'La fecha es requerida';
  }

  if (!values.timeappo) {
    newErrors.timeappo = 'La hora inicio es requerida';
  }

  if (!values.timeendappo) {
    newErrors.timeendappo = 'La hora fin es requerida';
  }

  if (!values.status) {
    newErrors.status = 'El estado es requerido';
  }

  if (values.timeendappo && values.timeappo) {
    const inicio = convertirAHoras(values.timeappo);
    const fin = convertirAHoras(values.timeendappo);

    if (fin < inicio) {
      newErrors.timeendappo = 'La hora de fin no puede ser menor que la hora de inicio';
    }

  }


  return newErrors;
};
  return (
    <>
    <FullCalendar
      plugins={[ timeGridPlugin,  interactionPlugin]}
      initialView="timeGridWeek"
      locale="es"
      timeZone="local"
      headerToolbar={{
        left: 'timeGridWeek',
        center: 'title',
        right: 'prev,next' // user can switch between the two
      }} 
      businessHours={{
        daysOfWeek: [ 1, 2, 3, 4, 5, 6 ], 
        startTime: '09:00',
        endTime: '21:00'
      }}
      buttonText={{
        prev: "Anterior",
        next: "Siguiente",
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
        list: "Agenda"
    }}
    allDayText="Todo el día"
    moreLinkText="más"
    noEventsText="No hay eventos para mostrar"
    selectable="true"
    editable="false"
    events={events}
    dateClick={handleSelect}
    eventClick={handleEventClick}
    eventContent={(info) => <EventItem info={info} />}
    dayMaxEventRows="true"
    nowIndicator="true"
    firstDay="1"
    slotLabelFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }}
    slotMinTime="08:00"
    slotMaxTime="22:00"
    />
    <div id="popup1" className="overlay">
      <div className="popup-pet">
          <div className="popup-header">
              <label className="title">Datos cita</label>
              <a className="close" href="#" onClick={handleClear}>&times;</a>
          </div>
          <div className="content">

              <form action="/" className="form" onSubmit={handleSubmit}>

                  <input type="text" id="idappo"  className="input input-text" onChange={e => setValues({...values,idappo: e.target.value})}  value={values.idappo} hidden />
                  <input type="text" id="idpet"  className="input input-text" onChange={e => setValues({...values,idpet: e.target.value})}  value={values.idpet} hidden />

                  <div id="dataclient">
                    <label for="dni" className="label">DNI Cliente</label>
                    <input type="text" id="dni" placeholder="" className="input input-text" onChange={getName} />
                    {errors.dni && <label className="errorMsg">{errors.dni}</label>}
              
                    <label for="name" className="label">Cliente</label>
                    <input type="text" id="name" disabled placeholder="Nombre del usuario" className="input input-text" value={nameClient.nameclient+ ' ' + nameClient.surnameclient}/>
                    {errors.name && <label className="errorMsg">{errors.name}</label>}

                    <label for="idpet" className="label">Nombre mascota</label>
                    <select id="idpet" name="idpet" className="input" onChange={e => setValues({...values,idpet: e.target.value})}>
                        <option selected>Seleccionar</option>
                        {namePets.map((pet,index) => {
                          return <option value={pet.idpet}>{pet.namepet}</option>
                        })}
                    </select>
                    {errors.idpet && <label className="errorMsg">{errors.idpet}</label>}
                  </div>

                  <span id="resume" className="label resume">{dataClient}</span>

                  <label for="idservice" className="label label-pet">Servicio</label>
                  <select id="idservice" name="idservice" className="input" onChange={(e) => changeService(e.target.value)} value={values.idservice}>
                      <option selected>Seleccionar</option>
                      <option value="2">Consulta Médica</option>
                      <option value="1">Grooming</option>
                      <option value="3">Plan de vacunación</option>
                  </select>
                  {errors.idservice && <label className="errorMsg">{errors.idservice}</label>}
                  
                  <label for="doctor" className="label">Personal Médico</label>
                  <input type="text" id="doctor" placeholder="" className="input input-text" value={doctor} disabled/>

                  <label for="dateappo" className="label">Fecha cita</label>
                  <input type="date" id="dateappo" className="input input-text" onChange={e => setValues({...values,dateappo: e.target.value})} value={values.dateappo} readOnly={isReadOnly}/>
                  {errors.dateappo && <label className="errorMsg">{errors.dateappo}</label>}

                  <label for="timeappo" className="label">Hora Inicio</label>
                  <input type="time" id="timeappo" className="input input-text" onChange={e => setValues({...values,timeappo: e.target.value})} value={values.timeappo} readOnly={isReadOnly}/>
                  {errors.timeappo && <label className="errorMsg">{errors.timeappo}</label>}

                  <label for="timeendappo" className="label">Hora Fin</label>
                  <input type="time" id="timeendappo" className="input input-text" onChange={e => setValues({...values,timeendappo: e.target.value})} value={values.timeendappo}/>
                  {errors.timeendappo && <label className="errorMsg">{errors.timeendappo}</label>}

                  <label for="status" className="label label-pet">Acción</label>
                  <select id="status" name="status" className="input" onChange={e => setValues({...values,status: e.target.value})} value={values.status} disabled={isDisabled}>
                      <option selected>Seleccionar</option>
                      <option value="1">Agendado</option>
                      <option value="2">Atendido</option>
                      <option value="3">Cancelado</option>
                  </select>
                  {errors.status && <label className="errorMsg">{errors.status}</label>}

                  <label for="comment" className="label">Comentarios (Opcional)</label>
                  <input type="text" id="comment" className="input input-text" onChange={e => setValues({...values,comment: e.target.value})} value={values.comment} />
                   
                  <div className="button-section">
                      <input type="submit" value="Guardar" className="button primary-button"/> 
                  </div>
                  
              </form>
          </div>
      </div>
  </div>
  </>
  )
}

