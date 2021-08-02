import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`;

const StlyedToast = styled.div`
  z-index: 9999;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.15);
  background-color: #84e60b;
  border-radius: 6px;
  padding: 16px;
  width: auto;
`;

function Toast({ children }) {
  return (
    <Container>
      <StlyedToast>{children}</StlyedToast>
    </Container>
  );
}

export default Toast;
