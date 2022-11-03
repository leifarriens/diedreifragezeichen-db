import styled from 'styled-components';

export const Container = styled.label`
  display: inline-flex;
`;

export const IconContainer = styled.div<{ height: string }>`
  display: flex;
  position: relative;
  height: ${(props) => props.height};

  input[type='range'] {
    cursor: pointer;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0;
  }
`;

export const FragezeichenContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  column-gap: 4px;
`;

export const FragezeichenIcon = styled.img`
  height: auto;
  width: auto;
  object-fit: cover;
`;

export const HoverValue = styled.div`
  min-width: 35px;
  text-align: right;
  font-size: 24px;
  margin-top: -12px;
`;
