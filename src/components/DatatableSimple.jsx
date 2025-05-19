// src/DataTable.js
import React from 'react';
import DataTable from 'react-data-table-component';
import '../styles/global.scss';
import customStyles from './customStyles';

const MyDataTable = ({ columns, data }) => {

  // Configuración de traducciones al español
  const localization = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    noDataText: 'No hay datos disponibles',
    selectAllRowsItem: 'Seleccionar todo',
    selectAllRowsItemText: 'Seleccionar todo'
    };
  const noDataMessage = 'No hay registros para mostrar';

  return (
    <DataTable
        columns={columns}
        data={data}
        pagination
        subHeader
        persistTableHead
        paginationComponentOptions={localization}
        noDataComponent={<label className="label">{noDataMessage}</label>}
        customStyles={customStyles}
    />
  );
};

export default MyDataTable;