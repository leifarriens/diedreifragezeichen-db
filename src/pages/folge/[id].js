/* eslint-disable simple-import-sort/imports */
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

import FolgeComponent from '../../components/Folge';
import GridFolge from '../../components/Grid/GridFolge';
import { FolgenContainer } from '../../components/Grid/StyledGrid';
import Header from '../../components/Header';
import { Key, KeyContainer } from '../../components/Key';
import dbConnect from '../../db';
import { getAllFolgenIds, getAllFolgenWithRating } from '../../services';
import { applyFilter, applyFolgenRating, parseMongo } from '../../utils';
import { useGlobalState } from '../../context/GlobalContext';
import { getNextFolgen } from '../../services/db';

function Folge(props) {
  const { showSpecials, sortBy } = useGlobalState();

  const filteredFolgen = applyFilter(props.folgen, {
    showSpecials,
    searchQuery: '',
    sortBy,
  });

  const { rel, next, prev } = getRelatedFolgen(props.folge, filteredFolgen);

  const router = useRouter();

  const _toPrevFolge = () => router.push('/folge/' + prev._id);

  const _toNextFolge = () => router.push('/folge/' + next._id);

  return (
    <>
      <NextSeo title={`${props.folge.number} ${props.folge.name}`} />
      <Header transparent={true} />
      <FolgeComponent folge={props.folge} />

      <KeyContainer>
        {prev && (
          <Key
            icon={BiLeftArrowAlt}
            onPress={_toPrevFolge}
            keyCode="ArrowLeft"
          />
        )}
        {next && (
          <Key
            icon={BiRightArrowAlt}
            onPress={_toNextFolge}
            keyCode="ArrowRight"
          />
        )}
      </KeyContainer>

      <div className="wrapper stretch">
        <FolgenContainer>
          {rel.map((folge) => {
            const isCurrent = props.folge._id === folge._id;
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
      </div>
    </>
  );
}

export async function getStaticPaths() {
  await dbConnect();

  const data = await getAllFolgenIds();

  const folgen = parseMongo(data);

  const paths = folgen.map((folge) => ({
    params: { id: folge._id },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  await dbConnect();

  const data = await getAllFolgenWithRating();

  const folgen = parseMongo(data);

  folgen.map(applyFolgenRating);

  const folge = folgen.find((f) => f._id === params.id);

  // const nextFolgen = await getNextFolgen(folge, 'release_date');

  if (!folge) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      folge,
      folgen,
    },
    revalidate: 1,
  };
}

// helpers

const getRelatedFolgen = (folge, folgen) => {
  const NEAR_FOLGEN = 8;
  const index = folgen.findIndex((f) => f._id === folge._id);

  const previosEntrys = index < NEAR_FOLGEN ? index : NEAR_FOLGEN;
  const followingEntrys =
    folgen.length - NEAR_FOLGEN < index ? index : NEAR_FOLGEN;

  const rel = folgen.slice(index - previosEntrys, index + followingEntrys);

  const prev = folgen[index - 1] || null;
  const next = folgen[index + 1] || null;

  return { rel, prev, next };
};

export default Folge;
