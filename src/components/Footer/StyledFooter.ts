import styled from 'styled-components';

export const PageFooter = styled.div`
  text-align: center;
  margin-top: 94px;
  margin-bottom: 18px;
  font-size: 0.85rem;
  color: #c7c7c7;
  line-height: 200%;

  a {
    transition: color 150ms ease-out;
    &:hover {
      /* text-decoration: underline; */
      opacity: 0.85;
    }
  }

  > :not(:last-child) {
    margin-right: 12px;
  }
`;

export const Signatur = styled.div`
  margin: 0 18px 18px 0;
  text-align: right;
  font-size: 0.65rem;
  color: #c7c7c7;
  opacity: 0.7;

  bottom: 0;
  right: 0;
  z-index: 20;

  @media screen and (min-width: 1080px) {
    font-size: 0.8rem;
  }

  a {
    text-decoration: underline;
    transition: color 150ms ease-out;

    &:hover {
      color: #9a9a9a;
    }
  }
`;
