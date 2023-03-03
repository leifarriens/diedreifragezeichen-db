import { useId } from 'react';
import styled from 'styled-components';

interface SwitchProps {
  checked: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

const Switch = ({ label, checked, onChange, ...rest }: SwitchProps) => {
  const id = useId();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target.checked);
  }

  return (
    <SwitchContainer>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div`
  --checkWidth: 50px;
  --checkHeight: 24px;

  [type='checkbox'] {
    position: fixed;
    left: var(--checkHeight);
    top: 0px;
    opacity: 0;
    width: 0;
  }

  [type='checkbox'] + label {
    position: relative;
    cursor: pointer;
    line-height: 1.45;
    height: calc(var(--checkHeight) + 2px);
    padding-left: 60px;
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  [type='checkbox'] + label:before {
    content: '';
    width: var(--checkWidth);
    height: var(--checkHeight);
    border-radius: var(--checkHeight);
    border: 1px solid rgb(133, 133, 133);
    background-color: #eee;
    margin-right: 12px;
    transition: background-color 0.5s linear;
    position: absolute;
    left: 0px;
  }

  [type='checkbox'] + label:after {
    content: '';
    width: var(--checkHeight);
    height: var(--checkHeight);
    border-radius: var(--checkHeight);
    background-color: #fff;
    transition: margin 80ms ease-out;
    box-shadow: 0px 0px 4px #aaa;
    position: absolute;
    left: 1px;
    top: 1px;
  }

  [type='checkbox']:checked + label:before {
    background-color: var(--color-ddfblue);
  }

  [type='checkbox']:checked + label:after {
    margin: 0 0 0 var(--checkHeight);
    margin-left: calc(var(--checkWidth) / 2);
  }

  [type='checkbox']:focus + label:before {
    outline: none;
    box-shadow: var(--ui-outline);
  }
`;

export default Switch;
