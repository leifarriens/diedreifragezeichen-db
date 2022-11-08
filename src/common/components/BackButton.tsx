import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';
import styled from 'styled-components';

import { colors } from '@/constants/theme';
import Wrapper from '@/layout/Wrapper';

function BackButton() {
  const router = useRouter();
  return (
    <ButtonContainer>
      <button
        type="button"
        aria-label="Zurück"
        onClick={() => router.push(`/?ref=${router.query.id}`)}
      >
        <IoMdArrowBack size={28} color={colors.white} />
      </button>
    </ButtonContainer>
  );
}

const ButtonContainer = styled(Wrapper)`
  margin-top: 2em;
`;

export default BackButton;
