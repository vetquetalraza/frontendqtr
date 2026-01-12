import styled from 'styled-components';
import '../styles/Datatable.scss';

const ClearButton = styled.button`
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 5px;
	height: 34px;
	width: 32px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color:#525353;
	color: #ffff;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
	<>	
	<div className="custom-subheader">
	<input class="input-inset" type="text" placeholder="Buscar" value={filterText} onChange={onFilter}/> 
	
		{/* <ClearButton type="button" onClick={onClear}>
			X
		</ClearButton> */}
	</div>
	
		
	</>
);

export default FilterComponent;