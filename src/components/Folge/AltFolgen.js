import Axios from 'axios';
import { useRouter } from 'next/router';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { useQuery } from 'react-query';

import GridFolge from '@/components/Grid/GridFolge';
import { FolgenContainer } from '@/components/Grid/StyledGrid';
import { Key, KeyContainer } from '@/components/Key';

import Loader from '../Loader';

function AltFolgen({ refFolgeId }) {
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
      {/* {data && <Navigation folgen={data} current_id={refFolgeId} />} */}
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

const Navigation = ({ folgen, current_id }) => {
  console.log(folgen);
  const router = useRouter();
  const current = folgen.findIndex((folge) => folge._id === current_id);

  const prevId = current !== 0 ? folgen[current - 1]._id : null;
  const nextId = current !== folgen.length ? folgen[current + 1]._id : null;

  return (
    <KeyContainer>
      <Key
        icon={BiLeftArrowAlt}
        keyCode="ArrowLeft"
        disabled={!prevId}
        onPress={() => router.push(`/folge/${prevId}`)}
      />
      <Key
        icon={BiRightArrowAlt}
        keyCode="ArrowRight"
        disabled={!nextId}
        onPress={() => router.push(`/folge/${nextId}`)}
      />
    </KeyContainer>
  );
};

export default AltFolgen;
