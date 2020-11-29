import React from 'react';
import styled from 'styled-components';

const SortContainer = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  cursor: pointer;

  input {
    display: none;
  }

  span {
    display: inline-block;
    padding: 8px;
    border: 1px solid #fff;
  }

  input:hover ~ span {
    background-color: #2196F3;
  }

  input:checked ~ span {
    background-color: #2196F3;
  }
`;

const Sort = ({ onSortChange }) => {
  return (
    <SortContainer>
      <Label>
        <input type="radio" name="sort" value="dateDesc" onChange={e => onSortChange(e.target.value)}/>
        <span>Neuste zuerst</span>
      </Label>
      <Label>
        <input type="radio" name="sort" value="dateAsc" onChange={e => onSortChange(e.target.value)}/>
        <span>Älteste zuerst</span>
      </Label>
      <Label>
        <input type="radio" name="sort" value="rating" onChange={e => onSortChange(e.target.value)}/>
        <span>Beste zuerst</span>
      </Label>
    </SortContainer>
  );
}

export default Sort;