import Axios from 'axios';
import { useQuery } from 'react-query';

import GridFolge from '@/components/Grid/GridFolge';
import { FolgenContainer } from '@/components/Grid/StyledGrid';

import Loader from '../Loader';

function AltFolgen({ refFolgeId }: { refFolgeId: string }) {
  const { isLoading, error, data } = useQuery(`alt-${refFolgeId}`, async () => {
    const { data } = await Axios(`/api/folgen/${refFolgeId}/alts`, {
      params: {
        fields: 'images',
      },
    });
    return data;
  });

  if (isLoading) return <Loader />;

  if (error) return null;

  return (
    <>
      <FolgenContainer>
        {data.map((folge: any) => {
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
