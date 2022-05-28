/* eslint-disable simple-import-sort/imports */
// import { useRouter } from 'next/router';
import { Types } from 'mongoose';
import { NextSeo } from 'next-seo';

import FolgeComponent from '@/components/Folge';
import Header from '@/components/Header';
import { parseMongo } from '../../utils/';
import dbConnect from '../../db';
import { getAllFolgenIds } from '../../services';
import { getFolgeById } from '../../services/';
import AltFolgen from '@/components/Folge/AltFolgen';

function Folge({ folge }) {
  const number = !isNaN(parseInt(folge.number)) ? parseInt(folge.number) : '';

  return (
    <>
      <NextSeo title={`${number} ${folge.name}`} />
      <Header transparent={true} />
      <FolgeComponent folge={folge} />

      <div className="wrapper stretch">
        <AltFolgen refFolgeId={folge._id} />
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

  if (Types.ObjectId.isValid(params.id)) {
    const folge = parseMongo(await getFolgeById(params.id));

    if (folge) {
      return {
        props: {
          folge,
        },
        revalidate: 10,
      };
    }
  }

  return {
    notFound: true,
  };
}

export default Folge;
