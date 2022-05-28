import { Types } from 'mongoose';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';

import FolgeComponent from '@/components/Folge';
import Header from '@/components/Header';
import { parseMongo } from '../../utils';
import dbConnect from '../../db';
import { getAllFolgenIds } from '../../services';
import { getFolgeById } from '../../services';
import AltFolgen from '@/components/Folge/AltFolgen';
import { FolgeType } from 'src/types';

type FolgePageProps = {
  folge: FolgeType;
};

function Folge({ folge }: FolgePageProps) {
  const number = !isNaN(parseInt(folge.number)) ? parseInt(folge.number) : '';

  return (
    <>
      <NextSeo title={`${number} ${folge.name}`} />
      <Header transparent={true} />
      <FolgeComponent folge={folge} />

      <div className="wrapper stretch">
        <AltFolgen refFolgeId={folge._id.toString()} />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  await dbConnect();

  const data = await getAllFolgenIds();

  const folgen = parseMongo(data);

  const paths = folgen.map((folge: FolgeType) => ({
    params: { id: folge._id },
  }));

  return { paths, fallback: 'blocking' };
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await dbConnect();

  const { id } = params as Params;

  if (Types.ObjectId.isValid(id)) {
    const folge = parseMongo(await getFolgeById(id));

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
};

export default Folge;
