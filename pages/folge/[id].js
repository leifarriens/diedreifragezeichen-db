import dbConnect from '../../db';
import FolgeComponent from '../../components/Folge/';
import { parseMongo } from '../../utils';
import { Key, KeyContainer } from '../../components/Key';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { NextSeo } from 'next-seo';
import {
  GridContainer,
  FolgenContainer,
} from '../../components/Grid/StyledGrid';
import GridFolge from '../../components/Grid/GridFolge';
import { useRouter } from 'next/router';
import {
  getAllFolgenIndexes,
  getAllFolgenSortedWithRating,
} from '../../services/';

function Folge(props) {
  const { rel, next, prev } = getRelatedFolgen(props.folge, props.folgen);

  const router = useRouter();

  const _toPrevFolge = () => router.push('/folge/' + prev._id);

  const _toNextFolge = () => router.push('/folge/' + next._id);

  return (
    <>
      <NextSeo title={`${props.folge.number} ${props.folge.name}`} />
      <FolgeComponent folge={props.folge} />

      <KeyContainer style={{ marginBottom: '48px', gridColumn: '1 / 3' }}>
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
      <GridContainer>
        <FolgenContainer>
          {rel.map((folge) => {
            const isCurrent = props.folge._id === folge._id;
            return (
              <GridFolge
                key={folge._id}
                folge={folge}
                coverOnly={true}
                style={{ opacity: isCurrent ? 0.15 : 1 }}
              />
            );
          })}
        </FolgenContainer>
      </GridContainer>
    </>
  );
}

export async function getStaticPaths() {
  await dbConnect();

  const data = await getAllFolgenIndexes();

  const folgen = parseMongo(data);

  const paths = folgen.map((folge) => ({
    params: { id: folge._id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  await dbConnect();

  const data = await getAllFolgenSortedWithRating();

  const folgen = parseMongo(data);

  const folge = folgen.find((f) => f._id === params.id);

  return {
    props: { folge, folgen },
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
