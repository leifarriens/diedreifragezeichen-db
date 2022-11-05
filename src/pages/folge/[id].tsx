import { Types } from 'mongoose';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import BackButton from '@/components/BackButton';
import FolgeComponent from '@/components/Folge';
import Seo from '@/components/Seo/Seo';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import type { FolgeWithId } from '@/models/folge';
import RelatedFolgen from '@/modules/RelatedFolgen';
import { getAllFolgenIds, getFolge } from '@/services/folge.service';
import { parseMongo } from '@/utils/index';

type FolgePageProps = {
  folge: FolgeWithId;
};

export default function Folge({ folge }: FolgePageProps) {
  const number = !isNaN(parseInt(folge.number))
    ? `Folge ${parseInt(folge.number)}`
    : '';
  const title = `${number} ${folge.name}`;
  const description = `${title}: ${folge.inhalt}`;

  const ogImage = folge.images[1];

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalpath={`/folgen/${folge._id.toString()}`}
        openGraph={{
          images: [
            {
              url: ogImage.url,
              alt: `${folge.name} Cover`,
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
        <RelatedFolgen folgeId={folge._id.toString()} />
      </Wrapper>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  await dbConnect();

  const data = await getAllFolgenIds();

  const folgen = parseMongo(data);

  const paths = folgen.map((folge) => ({
    params: { id: folge._id.toString() },
  }));

  return { paths, fallback: 'blocking' };
};

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
