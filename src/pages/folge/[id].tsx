import { Types } from 'mongoose';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import BackButton from '@/components/BackButton';
import FolgeComponent from '@/components/Folge';
import { Seo } from '@/components/Seo/Seo';
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
  const number = folge.number ? `Folge ${parseInt(folge.number)}` : '';
  const title = `${number} ${folge.name}`;

  const ogImage = folge.images[1];

  return (
    <>
      <Seo
        title={title}
        description={folge.inhalt && `${title}: ${folge.inhalt}`}
        canonicalpath={`/folgen/${folge._id}`}
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

      <Wrapper maxWidth="1280px">
        <FolgeComponent folge={folge} />
      </Wrapper>

      <Wrapper>
        <RelatedFolgen folgeId={folge._id} />
      </Wrapper>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  await dbConnect();

  const data = await getAllFolgenIds();

  const folgen = parseMongo(data);

  const paths = folgen.map((folge) => ({
    params: { id: folge._id },
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
