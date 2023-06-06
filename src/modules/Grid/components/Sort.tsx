import styled from 'styled-components';

import { SortOptionsEnum } from '../types';

type SortKey = keyof typeof SortOptionsEnum;

interface SortProps {
  currentSort: SortKey;
  onSortChange: (value: SortKey) => void;
}

export function Sort({ currentSort, onSortChange }: SortProps) {
  const sortVariants: { name: string; value: SortOptionsEnum }[] = [
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
            onChange={(e) => onSortChange(e.target.value as SortKey)}
          />
          <span className="inline-block w-full border border-white px-4 py-2 text-center font-semibold">
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
