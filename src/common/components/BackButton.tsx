import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';
import styled from 'styled-components';

import { breakpoints } from '@/constants/layout';
import { colors } from '@/constants/theme';
import Wrapper from '@/layout/Wrapper';

function BackButton() {
  const router = useRouter();
  return (
    <ButtonContainer>
      <button onClick={() => router.push(`/?ref=${router.query.id}`)}>
        <IoMdArrowBack size={28} color={colors.white} />
      </button>
    </ButtonContainer>
  );
}

const ButtonContainer = styled(Wrapper)`
  @media (max-width: ${breakpoints.mobileHeader}) {
    position: sticky;
    z-index: 10;
    top: 24px;
  }
`;

export default BackButton;
