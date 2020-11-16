import styled from 'styled-components';

import img from '../assets/zentrale.png';

const Hero = styled.div`
  /* position: sticky;
  top: 108px; */
  height: 400px;
  // background-color: #000;
  background-image: url(${img});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

export default Hero;