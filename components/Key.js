import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const KeyBox = styled.div`
  border: 1px solid #ddd;
  border-color: ${(props) => props.color};
  border-radius: 8px;
  padding: 14px;
  display: inline-flex;
  margin: 0 10px;
  cursor: pointer;

  :hover {
    opacity: .5;
  }
`;

export const KeyContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export function Key({ icon, color = '#ddd', size = 22, onPress }) {
  const Icon = icon;

  return (
    <KeyBox color={color} onClick={onPress}>
      <Icon color={color} size={size}/>
    </KeyBox>
  );
}
