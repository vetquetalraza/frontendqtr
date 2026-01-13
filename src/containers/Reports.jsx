import '../styles/reports.scss';
import api from '../services/api';
import Swal from 'sweetalert2';

const Reports = () => {

const descargarExcel = async () => {
  try {
    const response = await api.get(
      "/report4/reporte-inventario",
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "inventario.xlsx"; 
    link.click();

    window.URL.revokeObjectURL(url);

    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Reporte descargado correctamente",
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Ha ocurrido un error",
        showConfirmButton: false,
        timer: 1500
      });
  }
};

return (
    <>  
    <div class="popup-header-tables">
      <label for="" className="title">Reportes</label>
    </div>
        

        {/* <div className="table-header-history">
            <div>
                <label htmlFor="" className="label">Inicio</label>
                <input type="date" id="startDate" className="input input-text"/>
            </div>
            <div>
                <label htmlFor="" className="label">Fin</label>
                <input type="date" id="endDate" className="input input-text"/>
            </div>
            <button className="button primary-button">Filtrar</button>
        </div> */}

        {/* <button className="button button-report print-1">Descargar clientes</button>
        <button className="button button-report print-2">Descargar mascotas</button>
        <button className="button button-report print-3">Descargar citas</button> */}
        <button onClick={descargarExcel} className="button button-report print-4">Descargar inventario</button>
    </>
);

}

export default Reports;