import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';
import styled from 'styled-components';

import { colors } from '@/constants/theme';
import { Wrapper } from '@/layout';

import { parseQueryParam } from '../utils';

function BackButton() {
  const router = useRouter();
  const folgeId = parseQueryParam(router.query.id);

  return (
    <ButtonContainer>
      <button
        type="button"
        aria-label="Zurück"
        onClick={() => router.push(`/?ref=${folgeId}`)}
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
