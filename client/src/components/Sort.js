import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SortContainer = styled.div`
  display: flex;
  margin-bottom: 24px;

  @media (min-width:744px) {
    max-width: 420px;
  }
`;

const Label = styled.label`
  cursor: pointer;
  width: 100%;

  input {
    display: none;
  }

  span {
    width: 100%;
    display: inline-block;
    padding: 8px;
    border: 1px solid #fff;
    text-align: center;
  }

  input:hover ~ span {
    background-color: #fff;
    color: #2196F3;
  }

  input:checked ~ span {
    background-color: #fff;
    color: #2196F3;
  }

  :first-child span {
    border-radius: 24px 0 0 24px;
    border-right: none;
  }

  :last-child span {
    border-radius: 0 24px 24px 0;
    border-left: none;
  }
`;

const Sort = ({ onSortChange }) => {
  const [currentSort, setCurrentSort] = useState('dateDesc');
  const sortVariants = [
    {
      name: 'Neuste zuerst',
      value: 'dateDesc'
    },
    {
      name: 'Älteste zuerst',
      value: 'dateAsc'
    },
    {
      name: 'Beste zuerst',
      value: 'rating'
    }
  ];

  useEffect(() => {
    onSortChange(currentSort);
  }, [currentSort])

  return (
    <SortContainer>
      {sortVariants.map(({ name, value }) => (
        <Label key={value}>
          <input
            type="radio"
            name="sort"
            value={value}
            checked={value === currentSort ? true : false}
            onChange={e => setCurrentSort(e.target.value)}
          />
          <span>{name}</span>
        </Label>
      ))}
    </SortContainer>
  );
}

export default Sort;