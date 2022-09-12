import { Types } from 'mongoose';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';

import BackButton from '@/components/BackButton';
import FolgeComponent from '@/components/Folge';
import AltFolgen from '@/components/Folge/AltFolgen';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import type { Folge as FolgeType } from '@/models/folge';
import { getAllFolgenIds, getFolge } from '@/services/index';
import { parseMongo } from '@/utils/index';

type FolgePageProps = {
  folge: FolgeType;
};

function Folge({ folge }: FolgePageProps) {
  const number = !isNaN(parseInt(folge.number))
    ? `Folge: ${parseInt(folge.number)}`
    : '';
  const title = `${number} ${folge.name}`;

  const ogImage = folge.images[2];

  return (
    <>
      <NextSeo
        title={title}
        openGraph={{
          images: [
            {
              url: ogImage.url,
              alt: folge.name,
              width: ogImage.width,
              height: ogImage.height,
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <BackButton />

      <Wrapper maxWidth="1180px">
        <FolgeComponent folge={folge} />
      </Wrapper>

      <Wrapper>
        <AltFolgen refFolgeId={folge._id.toString()} />
      </Wrapper>
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

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await dbConnect();

  const { id } = params as Params;

  if (!Types.ObjectId.isValid(id)) {
    return {
      notFound: true,
    };
  }

  const folge = await getFolge(id);

  if (!folge) return { notFound: true };

  return {
    props: {
      folge: parseMongo(folge),
    },
    revalidate: 10,
  };
};

export default Folge;
