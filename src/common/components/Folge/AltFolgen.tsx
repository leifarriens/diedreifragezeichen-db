import { useRouter } from 'next/router';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { useAltFolgen } from '@/hooks';

import { Grid } from '../Grid';
import { Key, KeyContainer } from '../Key';
import { Loader } from '../shared/Loader';

type AltFolgenProps = {
  refFolgeId: string;
  enabled: boolean;
};

function AltFolgen({ refFolgeId, enabled }: AltFolgenProps) {
  const { isLoading, error, data } = useAltFolgen(refFolgeId, {
    enabled,
  });
  const router = useRouter();

  if (isLoading || !data) return <Loader />;

  if (error) return null;

  const currentIndex = data.findIndex((folge) => folge._id === refFolgeId);
  const prevId = currentIndex !== 0 ? data[currentIndex - 1]._id : null;
  const nextId =
    currentIndex !== data.length - 1 ? data[currentIndex + 1]._id : null;

  return (
    <>
      <KeyContainer>
        <Key
          keyCode="ArrowLeft"
          icon={FiArrowLeft}
          disabled={!prevId}
          label="Zur vorherigen Folge"
          onPress={() => router.push(`/folge/${prevId}`)}
        />
        <Key
          keyCode="ArrowRight"
          icon={FiArrowRight}
          disabled={!nextId}
          label="Zur nächsten Folge"
          onPress={() => router.push(`/folge/${nextId}`)}
        />
      </KeyContainer>

      <Grid folgen={data} />
    </>
  );
}

export default AltFolgen;
