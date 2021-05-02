import dbConnect from '../../db';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import FolgeComponent from '../../components/Folge/';
import { parseMongo } from '../../utils';
import FolgeModel from '../../models/folge';
import Rating from '../../models/rating';
import { Key, KeyContainer } from '../../components/Key';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

import { getFolgeById } from '../../services/';

import { GlobalContext } from '../../context/GlobalContext';
import {
  GridContainer,
  FolgenContainer,
} from '../../components/Grid/StyledGrid';
import GridFolge from '../../components/Grid/GridFolge';
import { useRouter } from 'next/router';

function Folge(props) {
  const { folgen } = useContext(GlobalContext);

  const { rel, next, prev } = getRelatedFolgen(props.folge, folgen);

  const router = useRouter();

  const _toPrevFolge = () => router.push('/folge/' + prev._id);

  const _toNextFolge = () => router.push('/folge/' + next._id);

  return (
    <GridContainer>
      <FolgeComponent folge={props.folge} />

      <KeyContainer style={{ margin: '48px 0', gridColumn: '1 / 3' }}>
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

      <FolgenContainer>
        {rel.map((folge) => {
          const isCurrent = props.folge._id === folge._id;
          return (
            <GridFolge
              key={folge._id}
              folge={folge}
              coverOnly={true}
              style={{
                // filter: !isCurrent && 'grayscale(1)',
                opacity: isCurrent ? 0.15 : 1,
              }}
            />
          );
        })}
      </FolgenContainer>
    </GridContainer>
  );
}

export async function getStaticPaths() {
  await dbConnect();

  const data = await FolgeModel.find({});

  const folgen = parseMongo(data);

  const paths = folgen.map((folge) => ({
    params: { id: folge._id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  await dbConnect();

  const data = await FolgeModel.findById(params.id).populate('ratings');
  // const folgen = await FolgeModel.find({}).populate('ratings');

  const folge = parseMongo(data);

  return {
    props: { folge },
    revalidate: 1,
  };
}

// export async function getServerSideProps(context) {
//   await dbConnect();

//   const data = await FolgeModel.findById(context.params.id).populate('ratings');

//   const folge = parseMongo(data);

//   return {
//     props: {
//       folge,
//     },
//   };
// }

// helpers

const getRelatedFolgen = (folge, folgen) => {
  const NEAR_FOLGEN = 5;
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
