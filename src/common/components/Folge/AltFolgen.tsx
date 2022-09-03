import { useRouter } from 'next/router';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { useAltFolgen } from '@/hooks';

import { Grid } from '../Grid';
import { Key, KeyContainer } from '../Key';
import { Loader } from '../shared/Loader';

function AltFolgen({ refFolgeId }: { refFolgeId: string }) {
  const { isLoading, error, data } = useAltFolgen(refFolgeId);
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
          onPress={() => router.push(`/folge/${prevId}`)}
        />
        <Key
          keyCode="ArrowRight"
          icon={FiArrowRight}
          disabled={!nextId}
          onPress={() => router.push(`/folge/${nextId}`)}
        />
      </KeyContainer>

      {/* TODO: cannot use with cover cause ratings are not supplied in endpoint */}
      <Grid folgen={data} coverOnly />
    </>
  );
}

export default AltFolgen;
