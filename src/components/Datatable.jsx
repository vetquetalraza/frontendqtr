// src/DataTable.js
import React, { useState} from 'react';
import DataTable from 'react-data-table-component';
import FilterComponent from './FilterComponent';
import '../styles/global.scss';
import customStyles from './customStyles';

const MyDataTable = ({ columns, data }) => {

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Configuración de traducciones al español
  const localization = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    noDataText: 'No hay datos disponibles',
    selectAllRowsItem: 'Seleccionar todo',
    selectAllRowsItemText: 'Seleccionar todo'
    };
  const noDataMessage = 'No hay registros para mostrar';

  const filteredItems = (array, texto) => {
    return array.filter(objeto =>
      Object.values(objeto).some(valor =>
        String(valor).toLowerCase().includes(texto.toLowerCase())
      )
    );
  };

  const result = filteredItems(data, filterText);

  const subHeaderComponentMemo = React.useMemo(() => {
  const handleClear = () => {
      if (filterText) {
          setResetPaginationToggle(!resetPaginationToggle);
          setFilterText('');
      }
  };

return (
    <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
);
}, [filterText, resetPaginationToggle]);

  return (
    <DataTable
        columns={columns}
        data={result}
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        paginationComponentOptions={localization}
        noDataComponent={<label className="label">{noDataMessage}</label>}
        customStyles={customStyles}
    />
  );
};

export default MyDataTable;