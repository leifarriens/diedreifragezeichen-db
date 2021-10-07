import React from 'react';
import styled from 'styled-components';

const SortContainer = styled.span`
  display: inline-flex;
  margin-bottom: 24px;
  margin-right: 12px;
`;

const Label = styled.label`
  cursor: pointer;
  width: 100%;

  @media (min-width: 744px) {
    width: auto;
  }

  input {
    display: none;
  }

  span {
    width: 100%;
    display: inline-block;
    padding: 6px 18px;
    border: 1px solid #fff;
    text-align: center;
    border-right: none;

    @media (min-width: 480px) {
      padding: 8px 22px;
    }
  }

  input:hover ~ span {
    background-color: #fff;
    color: #2196f3;
  }

  input:checked ~ span {
    background-color: #fff;
    color: #2196f3;
  }

  :first-child span {
    border-radius: 8px 0 0 8px;
  }

  :last-child span {
    border-radius: 0 8px 8px 0;
    border-right: 1px solid #fff;
  }
`;

const Sort = ({ currentSort, onSortChange }) => {
  const sortVariants = [
    { name: 'Neuste', value: 'dateDesc' },
    { name: 'Älteste', value: 'dateAsc' },
    { name: 'Beste', value: 'rating' },
    { name: 'Beliebteste', value: 'popularity' },
  ];

  return (
    <SortContainer>
      {sortVariants.map(({ name, value }) => (
        <Label key={value}>
          <input
            type="radio"
            name="sort"
            value={value}
            checked={value === currentSort ? true : false}
            onChange={(e) => onSortChange(e.target.value)}
          />
          <span>{name}</span>
        </Label>
      ))}
    </SortContainer>
  );
};

export default Sort;
