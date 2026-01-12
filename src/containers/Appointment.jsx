import '../styles/appointment.scss';
import Calendar from '../components/Calendar';

const Appointment = () => {


return (
    <>
        <label for="" className="title">Citas</label>
        <div class="table-header"><a className="button button-new" href="#popup1" id="btnPopup" hidden>Nueva cita</a></div>
        <div className="container-calendar">
            <Calendar />
        </div>
        
    </>
);

}

export default Appointment;