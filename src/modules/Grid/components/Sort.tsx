import styled from 'styled-components';

import { SortOptionsEnum } from '../types';

interface SortProps {
  currentSort: string;
  onSortChange: (value: string) => void;
}

export function Sort({ currentSort, onSortChange }: SortProps) {
  const sortVariants = [
    { name: 'Neuste', value: SortOptionsEnum.dateDesc },
    { name: 'Älteste', value: SortOptionsEnum.dateAsc },
    { name: 'Beste', value: SortOptionsEnum.rating },
    { name: 'Beliebteste', value: SortOptionsEnum.popularity },
  ];

  return (
    <div className="flex divide-x-0">
      {sortVariants.map(({ name, value }) => (
        <Label key={value} className="block w-full cursor-pointer">
          <input
            className="w-0 opacity-0"
            type="radio"
            name="sort"
            value={value}
            checked={value === currentSort ? true : false}
            onChange={(e) => onSortChange(e.target.value)}
          />
          <span className="inline-block w-full border border-white py-2 px-4 text-center font-semibold">
            {name}
          </span>
        </Label>
      ))}
    </div>
  );
}

const Label = styled.label`
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
