import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid' 
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from "react";
import EventItem from '../hooks/useGetEvent';
import uuid from 'react-uuid';

export default function Calendar() {

const [events, setEvents] = useState([]);

const handleSelect = (info) => {
    const { start, end } = info;
    const eventNamePrompt = prompt("Seleccione:");
    if (eventNamePrompt) {
      setEvents([
        ...events,
        {
          start,
          end,
          title: eventNamePrompt,
          id: uuid(),
        },
      ]);
    }
  };

  return (
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
        hour12: true
      }}
    />
  )
}

