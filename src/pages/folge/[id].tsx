import { Types } from 'mongoose';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';

import FolgeComponent from '@/components/Folge';
import AltFolgen from '@/components/Folge/AltFolgen';
import Header from '@/components/Header';

import dbConnect from '../../db';
import { getAllFolgenIds, getFolgeById } from '../../services';
import { FolgeType } from '../../types';
import { parseMongo } from '../../utils';

type FolgePageProps = {
  folge: FolgeType;
};

function Folge({ folge }: FolgePageProps) {
  const number = !isNaN(parseInt(folge.number))
    ? `Folge: ${parseInt(folge.number)}`
    : '';
  const title = `${number} ${folge.name}`;

  return (
    <>
      <NextSeo title={title} />
      <Header solid={true} />
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
