import { Types } from 'mongoose';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';

import FolgeComponent from '@/components/Folge';
import AltFolgen from '@/components/Folge/AltFolgen';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { getAllFolgenIds, getFolgeById } from '@/services/index';
import { FolgeType } from '@/types';
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
      <Wrapper maxWidth="1280px">
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
