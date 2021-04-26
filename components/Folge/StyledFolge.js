import styled from 'styled-components'

export const Container = styled.div`
  padding-top: 0px;
  margin-bottom: 196px;

  @media screen and (min-width: 720px) {
    padding-top: 144px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 96px;
  }
`

export const Cover = styled.div`
  height: auto;
  width: 100%;
  font-size: 0;
  line-height: 0;

  img {
    height: auto;
    width: 100%;
    object-fit: cover;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`

export const Content = styled.div`
  padding: 6px;

  > div {
    margin-bottom: 8px;
  }
`

export const Buttons = styled.div`
  > * {
    margin-right: 10px;
  }
`

export const Background = styled.div`
  z-index: -1;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: url(${(props) => props.url});
  background-size: ${(props) => (props.bigCover ? '120% 140%' : '150% 150%')};
  background-position: ${(props) =>
    props.bigCover ? 'right bottom' : 'center 93%'};
  background-repeat: no-repeat;
  transform: scale(1.15);
  filter: blur(80px) brightness(35%);
`
