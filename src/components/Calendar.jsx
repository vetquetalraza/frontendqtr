import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid' 
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from "react";
import EventItem from '../hooks/useGetEvent';
import uuid from 'react-uuid';
import axios from 'axios';

export default function Calendar() {

const [events, setEvents] = useState([]);

const [values , setValues] = useState({
  idpet:'',
  idservice: '',
  dateappo: '',
  timeappo: '',
  comment: '',
  status: '1'
})

const handleSelect = (info) => {
    const { start, end } = info;

    const popup = document.getElementById("btnPopup");
    popup.click()

    const dateApp = document.getElementById("dateappo")
    var day = start.getDate(),
        month = start.getMonth(),
        year = start.getFullYear()

    var dayT = day < 10 ? 0 + day : day,
        monthT = month < 10 ? 0 + month.toString() : month,
        dateT = year + "-" + monthT + "-" + dayT
    dateApp.value = dateT

    const timeApp = document.getElementById("timeappo")
    var hour = start.getHours(),
        minutes = start.getMinutes(),
        hourT = hour < 10 ? 0 + hour.toString() : hour,
        minutesT = minutes < 10 ? 0 + minutes.toString() : minutes,
        timeT = hourT + ":" + minutesT
        
    timeApp.value = timeT

    var nameAppo = document.getElementById("idservice"),
        selected = nameAppo.options[nameAppo.selectedIndex].text;
    setEvents([
        ...events,
        {
          start,
          end,
          title: selected,
          id: uuid(),
          date: dateT,
          time: timeT

        },
    ]);

    setValues({...values,dateappo: dateT})

    setValues({...values,timeappo: timeT})
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://api-vet-2utn.onrender.com/api/v1/appointments/',values)
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

  return (
    <>
    <FullCalendar
      plugins={[ timeGridPlugin,  interactionPlugin]}
      initialView="timeGridWeek"
      locale="es"
      headerToolbar={{
        left: 'timeGridWeek',
        center: 'title',
        right: 'prev,next' // user can switch between the two
      }} 
      businessHours={{
        daysOfWeek: [ 1, 2, 3, 4, 5, 6 ], 
        startTime: '09:00',
        endTime: '20:00'
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
    eventColor="#9ACD32"
    allDayText="Todo el día"
    moreLinkText="más"
    noEventsText="No hay eventos para mostrar"
    selectable="true"
    editable="true"
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
                  <input type="text" id="dni" placeholder="" className="input input-text"/>
            
                  <label for="name" className="label">Cliente</label>
                  <input type="text" id="name" placeholder="María Paz" className="input input-text" readonly/>

                  <label for="idpet" className="label">Nombre mascota</label>
                  <select id="idpet" name="idpet" className="input" onChange={e => setValues({...values,idpet: e.target.value})}>
                      <option selected>Seleccionar</option>
                      <option value="1">Gato: Arenita</option>
                      <option value="2">Gato: Zeus</option>
                      <option value="3">Perro: Wookie</option>
                  </select>
                  
                  <label for="idservice" className="label label-pet">Servicio</label>
                  <select id="idservice" name="idservice" className="input" onChange={e => setValues({...values,idservice: e.target.value})}>
                      <option selected>Seleccionar</option>
                      <option value="1">Consulta Médica</option>
                      <option value="2">Grooming</option>
                      <option value="3">Plan de vacunación</option>
                  </select>

                  <label for="dateappo" className="label">Fecha cita</label>
                  <input type="date" id="dateappo" className="input input-text" onChange={e => setValues({...values,dateappo: e.target.value})}/>
                  
                  <label for="timeappo" className="label">Hora cita</label>
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

