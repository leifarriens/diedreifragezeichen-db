import styled from 'styled-components';

import img from '../assets/zentrale.png';

const Hero = styled.div`
  height: 400px;
  margin-bottom: 30px;
  /* background-image: url(${img}); */
  background-image: url(${props => props.imgUrl ? props.imgUrl : img});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

export default Hero;