import styled, { css } from 'styled-components';

import { colors } from '@/constants/theme';

const shared = css`
  font-family: inherit;
  font-size: 16px;
  width: 100%;
  display: inline-block;
  border: 1px solid ${colors.white};
  padding: 0.7em 1.4em;
  border-radius: 8px;
  font-weight: 400;
  letter-spacing: 0.02rem;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
`;

export const Input = styled.input`
  ${shared};

  &:disabled {
    filter: brightness(50%);
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  ${shared};
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 50%;
  padding-right: calc(1.4em + 10px);
`;

export const Textarea = styled.textarea`
  ${shared};

  resize: vertical;
  min-height: 80px;
  max-height: 640px;
`;

export const Form = styled.form`
  > * {
    margin-top: 1em;
  }

  label {
    display: block;
  }
`;
