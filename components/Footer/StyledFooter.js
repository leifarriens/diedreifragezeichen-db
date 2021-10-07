import styled from 'styled-components';

export const PageFooter = styled.div`
  text-align: center;
  margin-top: 94px;
  margin-bottom: 18px;
  font-size: 0.85rem;
  color: #c7c7c7;
  line-height: 200%;

  svg {
    position: relative;
    top: 2px;
    left: 2px;
  }
`;

export const Signatur = styled.div`
  margin: 0 18px 18px 0;
  position: fixed;
  font-size: 0.65rem;
  color: #9a9a9a;
  color: #c7c7c7;

  bottom: 0;
  right: 0;
  z-index: 20;

  @media screen and (min-width: 1080px) {
    font-size: 0.85rem;
  }
`;
