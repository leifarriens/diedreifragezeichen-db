import styled from 'styled-components';

import { breakpoints } from '@/constants/layout';

const Card = styled.div`
  font-size: 1.1em;
  color: #eee;
  border-radius: 8px;
  margin-bottom: 4em;

  @media screen and (min-width: ${breakpoints.mobileHeader}) {
    padding: 2em;
    background-color: rgba(0, 0, 0, 0.3);
  }

  h3 {
    margin-bottom: 1em;
    font-size: 1.25em;
    font-weight: 500;
  }

  p {
    line-height: 150%;
    text-align: justify;
    white-space: pre-wrap;
  }
`;

export default Card;
