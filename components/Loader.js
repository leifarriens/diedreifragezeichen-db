import styled from 'styled-components';

const FullpageContainer = styled.div`
  z-index: 999px;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  display: flex;
  align-items: center;
`;

export const FullpageLoader = () => (
  <FullpageContainer>
    <Loader />
  </FullpageContainer>
);

export const Loader = () => (
  <div className="loader">
    <div className="rect rect1"></div>
    <div className="rect rect2"></div>
    <div className="rect rect3"></div>
  </div>
);

export default Loader;
