import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid' 
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState } from 'react';
import EventItem from '../hooks/useGetEvent';
import uuid from 'react-uuid';
import axios from 'axios';
import Swal from 'sweetalert2'
import moment from 'moment'; 

export default function Calendar() {

const close = document.querySelector(".close");

const [events, setEvents] = useState([]);

const [values , setValues] = useState({
  idpet:'',
  idservice: '',
  dateappo: '',
  timeappo: '',
  duration: '',
  comment: '',
  status: 'Agendado'
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
  axios.get('https://api-vet-2utn.onrender.com/api/v1/appointments')
  .then(res => {
    
    var data = Array.from(res.data);
    var lista = [];
    data.map((element, index) => {
      let varStart = element.dateappointment + " " + element.timeappointment
      let varEnd = moment(varStart).add(element.durationappointment, 'm').format("yyyy-MM-DD HH:mm");
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
        axios.get('https://api-vet-2utn.onrender.com/api/v1/clients/' + e.target.value)
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

  axios.get('https://api-vet-2utn.onrender.com/api/v1/pets/client/' + id)
  .then( res => setNamePets(Array.from(res.data)))
  .catch(err => console.log(err));

}


//End nombre mascotas

const handleSelect = (info) => {
    const { start, end } = info;
    
    setValues({...values,timeappo: moment(start).format("HH:mm"),dateappo: moment(start).format("yyyy-MM-DD")})
   
    const popup = document.getElementById("btnPopup");
    popup.click()

    const dateApp = document.getElementById("dateappo")
    dateApp.value = moment(start).format("yyyy-MM-DD")

    const timeApp = document.getElementById("timeappo")
    timeApp.value = moment(start).format("HH:mm")

    let nameAppo = document.getElementById("idservice"),
        selected = nameAppo.options[nameAppo.selectedIndex].text;

    let color = getColor();
    
    setEvents([
        ...events,
        {
          title: selected,
          id: uuid(),
          start: start,
          end: end,
          rendering: 'background',
          color:color
        },
    ]);

    console.log(events)
  };

  const handleSubmit = (e) => {
    //console.log(events);

      e.preventDefault();
      axios.post('https://api-vet-2utn.onrender.com/api/v1/appointments/',values)
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
        //Actualizar vista
        load()
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

    console.log(values);
}

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
    select={handleSelect}
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
              <a className="close" href="#">&times;</a>
          </div>
          <div className="content">

              <form action="/" className="form" onSubmit={handleSubmit}>
                  
                  <label for="name" className="label">DNI Cliente</label>
                  <input type="text" id="dni" placeholder="" className="input input-text" onChange={getName}/>
            
                  <label for="name" className="label">Cliente</label>
                  <input type="text" id="name" disabled placeholder="Nombre del usuario" className="input input-text" value={nameClient.nameclient+ ' ' + nameClient.surnameclient}/>

                  <label for="idpet" className="label">Nombre mascota</label>
                  <select id="idpet" name="idpet" className="input" onChange={e => setValues({...values,idpet: e.target.value})}>
                      <option selected>Seleccionar</option>
                      {namePets.map((pet,index) => {
                        return <option value={pet.idpet}>{pet.namepet}</option>
                      })}
                  </select>
                  
                  <label for="idservice" className="label label-pet">Servicio</label>
                  <select id="idservice" name="idservice" className="input" onChange={e => setValues({...values,idservice: e.target.value,duration: e.target.value === "1" ? 59: 29})}>
                      <option selected>Seleccionar</option>
                      <option value="2">Consulta Médica</option>
                      <option value="1">Grooming</option>
                      <option value="3">Plan de vacunación</option>
                  </select>

                  <label for="dateappo" className="label">Fecha cita</label>
                  <input type="date" id="dateappo" className="input input-text" onChange={e => setValues({...values,dateappo: e.target.value})}/>
                  
                  <label for="timeappo" className="label">Hora Inicio</label>
                  <input type="time" id="timeappo" className="input input-text" onChange={e => setValues({...values,timeappo: e.target.value})}/>

                  <label for="comment" className="label">Comentarios (Opcional)</label>
                  <input type="text" id="comment" className="input input-text" onChange={e => setValues({...values,comment: e.target.value})}/>
                   
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

