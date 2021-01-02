import styled from 'styled-components';
import iconWhite from '../assets/white.png';
import iconBlue from '../assets/blue.png';

export const RateIcon = styled.i`
  display: block;
  width: 16px;
  height: 24px;
  background-image: url(${iconWhite});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

export const RateIconBlue = styled(RateIcon)`
  background-image: url(${iconBlue});
`;