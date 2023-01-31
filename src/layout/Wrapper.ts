import styled from 'styled-components';

const Wrapper = styled.div<{ maxWidth?: string; center?: boolean }>`
  --maxWidth: ${(props) => props.maxWidth};

  flex: 1;
  padding-left: 18px;
  padding-right: 18px;
  width: ${({ maxWidth }) =>
    maxWidth ? 'min(var(--maxWidth), 100%)' : '100%'};
  margin: 0 auto;
  align-self: ${({ center }) => (center ? 'center' : null)};
  flex-grow: 1;

  @media (min-width: 375px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 744px) {
    padding-left: 40px;
    padding-right: 40px;
  }

  @media (min-width: 1128px) {
    padding-left: 80px;
    padding-right: 80px;
  }
`;

export default Wrapper;
