const customStyles = {
    headCells: {
      style: {
        fontSize: '14px', // Tamaño de fuente
        fontWeight: 'bold', // Negrita
      },
    },
    rows: {
      style: {
        '&:nth-of-type(odd)': {
          backgroundColor: '#f2f2f2', // Color para filas impares
        },
        '&:nth-of-type(even)': {
          backgroundColor: '#ffffff', // Color para filas pares
        },
      },
    },
  };

export default customStyles;