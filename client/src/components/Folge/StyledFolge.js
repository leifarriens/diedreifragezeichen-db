import styled from 'styled-components';

export const Container = styled.div`
  padding-top: 144px;
  margin-bottom: 196px;

  @media screen and (min-width:720px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 96px;
  }
`;

export const Cover = styled.div`
  height: auto;
  width: 100%;
  font-size: 0;
  line-height: 0;

  img {
    height: auto;
    width: 100%;
    object-fit: cover;
    box-shadow:  0 8px 24px rgba(0, 0, 0, .2);
  }
`;

export const Content = styled.div`
  padding: 6px;
`;

export const Background = styled.div`
  z-index: -1;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: url(${props => props.url});
  background-position: center;
  background-size: 150%;
  background-repeat: no-repeat;
  transform: scale(1.03);
  filter: blur(50px) brightness(25%);
`;