import dbConnect from '../../db';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import FolgeComponent from '../../components/Folge/';
import { parseMongo } from '../../utils';
import FolgeModel from '../../models/folge';
import Rating from '../../models/rating';

import { getFolgeById } from '../../services/';

import { GlobalContext } from '../../context/GlobalContext';
import {
  GridContainer,
  FolgenContainer,
} from '../../components/Grid/StyledGrid';
import GridFolge from '../../components/Grid/GridFolge';

function Folge(props) {
  const { folgen } = useContext(GlobalContext);

  const { rel, next, prev } = getRelatedFolgen(props.folge, folgen);
  console.log(props.folge);
  return (
    <GridContainer>
      <FolgeComponent folge={props.folge} prevFolge={prev} nextFolge={next} />

      <FolgenContainer>
        {rel.map((folge) => (
          <GridFolge key={folge._id} folge={folge} />
        ))}
      </FolgenContainer>
    </GridContainer>
  );
}

export async function getServerSideProps(context) {
  await dbConnect();

  const data = await FolgeModel.findById(context.params.id).populate('ratings');

  const folge = parseMongo(data);
  
  return {
    props: {
      folge,
    },
  };
}

// helpers

const getRelatedFolgen = (folge, folgen) => {
  const index = folgen.findIndex((f) => f._id === folge._id);

  const previosEntrys = index < 5 ? index : 5;
  const followingEntrys = folgen.length - 5 < index ? index : 5

  const rel = folgen.slice(index - previosEntrys, index + followingEntrys);

  const prev = folgen[index - 1] || null;
  const next = folgen[index + 1] || null;

  return { rel, prev, next };
};

export default Folge;
