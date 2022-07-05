import { useQuery } from 'react-query';

import GridFolge from '@/components/Grid/GridFolge';
import { FolgenContainer } from '@/components/Grid/StyledGrid';
import { getAltFolgen } from '@/services/client';

import { Loader } from '../shared/Loader';

function AltFolgen({ refFolgeId }: { refFolgeId: string }) {
  const { isLoading, error, data } = useQuery([refFolgeId, 'alt'], () =>
    getAltFolgen(refFolgeId),
  );

  if (isLoading || !data) return <Loader />;

  if (error) return null;

  return (
    <>
      <FolgenContainer>
        {data.map((folge) => {
          const isCurrent = refFolgeId === folge._id;
          return (
            <GridFolge
              key={folge._id}
              folge={folge}
              coverOnly={true}
              style={{
                opacity: isCurrent ? 0.35 : 1,
                pointerEvents: isCurrent ? 'none' : 'all',
              }}
            />
          );
        })}
      </FolgenContainer>
    </>
  );
}

export default AltFolgen;
