import styled from 'styled-components';

export const Background = styled.div<{ bigCover: boolean }>`
  z-index: -1;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: ${(props) => (props.bigCover ? '120% 140%' : '150% 150%')};
  background-position: ${(props) =>
    props.bigCover ? 'right bottom' : 'center 93%'};
  background-repeat: no-repeat;
  transform: scale(1.15);
  filter: blur(80px) brightness(65%);

  @media screen and (min-width: 720px) {
    filter: blur(80px) brightness(35%);
  }

  /* Disables blurred background on firefox due to bad filter performance */
  /* jk its just my firefox */
  @-moz-document url-prefix() {
    /* filter: none; */
    display: none;
  }
`;
