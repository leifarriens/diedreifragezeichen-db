import { useRouter } from 'next/router';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

import { Key, KeyContainer } from '@/components/Key';
import { Loader } from '@/components/shared/Loader';
import { Grid } from '@/modules/Grid';

import { useRelatedFolgen } from './useRelatedFolgen';

type RelatedFolgenProps = {
  folgeId: string;
};

export default function RelatedFolgen({ folgeId }: RelatedFolgenProps) {
  const router = useRouter();
  const { ref, inView } = useInView({ triggerOnce: true });
  const { related, prevId, nextId } = useRelatedFolgen(folgeId, {
    enabled: inView,
  });

  return (
    <div ref={ref}>
      {/* FIXME: Key press cause unwanted behavior with accessible RatingInput -> */}
      {/* Page Navigations to corr folge, when input is controlled with keys */}
      <KeyContainer>
        <Key
          // keyCode="ArrowLeft"
          icon={FiArrowLeft}
          disabled={!prevId}
          label="Zur vorherigen Folge"
          onPress={() => router.push(`/folge/${prevId}`)}
        />
        <Key
          // keyCode="ArrowRight"
          icon={FiArrowRight}
          disabled={!nextId}
          label="Zur nächsten Folge"
          onPress={() => router.push(`/folge/${nextId}`)}
        />
      </KeyContainer>

      {!related ? <Loader /> : <Grid folgen={related} />}
    </div>
  );
}
