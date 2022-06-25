import styled from 'styled-components';

const Wrapper = styled.div<{ minWidth: string }>`
  --minWidth: ${(props) => props.minWidth};

  padding: 0 36px;
  width: min(var(--minWidth), 100%);
  margin: 0 auto;

  &.stretch {
    width: 100%;
    padding: 0 24px;

    @media (min-width: 375px) {
      padding: 0 24px;
    }

    @media (min-width: 744px) {
      padding: 0 40px;
    }

    @media (min-width: 1128px) {
      padding: 0 80px;
    }
  }
`;

export default Wrapper;
