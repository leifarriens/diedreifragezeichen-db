import styled from 'styled-components';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.png';

export const Container = styled.header`
  z-index: 10;
  color: #fff;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36px;
  background: linear-gradient(0deg, rgba(0,23,39,0) 0%, rgba(0,23,39,.85) 100%);
  pointer-events: none;

  * {
    pointer-events: all;
  }
`;

export const HomeLink = styled(Link)`
  height: 36px;
  width: 62px;
  background-image: url(${logo});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;