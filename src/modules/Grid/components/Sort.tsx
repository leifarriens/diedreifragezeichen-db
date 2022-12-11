import styled from 'styled-components';

import { SortOptionsEnum } from '../types';

type SortProps = {
  currentSort: string;
  onSortChange: (value: string) => void;
};

export default function Sort({ currentSort, onSortChange }: SortProps) {
  const sortVariants = [
    { name: 'Neuste', value: SortOptionsEnum.dateDesc },
    { name: 'Älteste', value: SortOptionsEnum.dateAsc },
    { name: 'Beste', value: SortOptionsEnum.rating },
    { name: 'Beliebteste', value: SortOptionsEnum.popularity },
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
}

const SortContainer = styled.div`
  display: flex;
`;

const Label = styled.label`
  cursor: pointer;
  width: 100%;
  display: block;

  input {
    opacity: 0;
    width: 0;
  }

  span {
    width: 100%;
    display: inline-block;
    padding: 6px 18px;
    border: 1px solid #fff;
    text-align: center;
    border-right: none;
    font-weight: 600;

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

  input:focus ~ span {
    outline: none;
    box-shadow: var(--ui-outline);
  }

  :first-child span {
    border-radius: 8px 0 0 8px;
  }

  :last-child span {
    border-radius: 0 8px 8px 0;
    border-right: 1px solid #fff;
  }
`;
