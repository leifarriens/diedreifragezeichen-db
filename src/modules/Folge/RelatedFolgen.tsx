import { useRouter } from 'next/router';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

import { Key } from '@/components/Key';
import { Loader } from '@/components/shared';
import { Grid } from '@/modules/Grid';
import { trpc } from '@/utils/trpc';

interface RelatedFolgenProps {
  folgeId: string;
}

export function RelatedFolgen({ folgeId }: RelatedFolgenProps) {
  const router = useRouter();
  const { ref, inView } = useInView({ triggerOnce: true });
  const { related, prevId, nextId } = useRelatedFolgen(folgeId, {
    enabled: inView,
  });

  return (
    <div ref={ref}>
      {/* FIXME: Key press cause unwanted behavior with accessible RatingInput -> */}
      {/* Page Navigations to corr folge, when input is controlled with keys */}
      <div className="mb-12 flex justify-center">
        <Key
          // keyCode="ArrowLeft"
          icon={FiArrowLeft}
          disabled={!prevId}
          label="Zur vorherigen Folge"
          onPress={() => prevId && router.push(`/folge/${prevId}`)}
        />
        <Key
          // keyCode="ArrowRight"
          icon={FiArrowRight}
          disabled={!nextId}
          label="Zur nächsten Folge"
          onPress={() => nextId && router.push(`/folge/${nextId}`)}
        />
      </div>

      {!related ? <Loader /> : <Grid folgen={related} />}
    </div>
  );
}

function useRelatedFolgen(folgeId: string, options: { enabled: boolean }) {
  const { data, isLoading } = trpc.folge.related.useQuery({ folgeId }, options);

  if (!data) {
    return {
      related: undefined,
      prevId: undefined,
      nextId: undefined,
    };
  }

  const currentIndex = data.findIndex((folge) => folge._id === folgeId);

  return {
    isLoading,
    related: data,
    prevId: currentIndex !== 0 ? data[currentIndex - 1]._id : null,
    nextId:
      currentIndex !== data.length - 1 ? data[currentIndex + 1]._id : null,
  };
}
