import styled from 'styled-components';

export const Container = styled.div`
  padding-top: 30px;
  margin-bottom: 96px;

  @media screen and (min-width: 720px) {
    padding-top: 144px;
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
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

export const Content = styled.div`
  padding: 6px;

  > div {
    margin-bottom: 8px;
  }
`;

export const Buttons = styled.div`
  margin-top: 24px;

  > * {
    margin-right: 1em;
  }
`;

export const Background = styled.div<{ url: string; bigCover: boolean }>`
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
  /* background-attachment: fixed; */
  transform: scale(1.15);
  filter: blur(80px) brightness(35%);
`;

export const RatingContainer = styled.div`
  font-size: 2.4em;
  font-family: 'Cochin';
  margin-top: 16px;
  margin-bottom: 12px;
`;

export const ReleaseContainer = styled.div`
  font-size: 1.2em;
  margin-top: 6px;
  color: #ddd;
`;
