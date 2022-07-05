import styled from 'styled-components';

const Wrapper = styled.div<{ maxWidth?: string }>`
  --maxWidth: ${(props) => props.maxWidth};

  flex: 1;
  padding-left: 36px;
  padding-right: 36px;
  width: ${({ maxWidth }) =>
    maxWidth ? 'min(var(--maxWidth), 100%)' : '100%'};
  margin: 0 auto;

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
