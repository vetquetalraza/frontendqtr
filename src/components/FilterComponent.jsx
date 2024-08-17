import React from 'react';
import styled from 'styled-components';
import '../styles/global.scss';

const ClearButton = styled.button`
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	height: 34px;
	width: 32px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
	<>
		<input class="input-inset" type="text" placeholder="Buscar" value={filterText} onChange={onFilter}/> 
		<ClearButton type="button" onClick={onClear}>
			X
		</ClearButton>
		
	</>
);

export default FilterComponent;