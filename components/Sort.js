import React from 'react'
import styled from 'styled-components'

const SortContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
`

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
    width: auto;
    height: 100%;
    display: inline-block;
    display: block;
    padding: 8px;
    padding: 8px 18px;
    border: 1px solid #fff;
    text-align: center;
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
    border-radius: 24px 0 0 24px;
    border-right: none;
  }

  :last-child span {
    border-radius: 0 24px 24px 0;
    border-left: none;
  }
`

const Sort = ({ currentSort, onSortChange }) => {
  const sortVariants = [
    {
      name: 'Neuste zuerst',
      value: 'dateDesc',
    },
    {
      name: 'Älteste zuerst',
      value: 'dateAsc',
    },
    {
      name: 'Beste zuerst',
      value: 'rating',
    },
  ]

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
  )
}

export default Sort
