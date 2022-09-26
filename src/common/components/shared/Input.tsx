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
`;

export const Select = styled.select`
  ${shared};
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
