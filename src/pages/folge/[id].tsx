import { Types } from 'mongoose';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { Seo } from '@/components/Seo';
import { dbConnect } from '@/db/connect';
import { Wrapper } from '@/layout';
import { Folge, RelatedFolgen } from '@/modules/Folge';
import { getAllFolgenIds, getPublicFolge } from '@/services/folge.service';
import { parseMongo } from '@/utils/index';
import type { PublicFolge } from '@/utils/maskFolgeForPublic';

interface FolgePageProps {
  folge: PublicFolge;
}

const FolgePage: NextPage<FolgePageProps> = ({ folge }) => {
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

      <Wrapper maxWidth="1280px">
        <Folge folge={folge} />
      </Wrapper>

      <Wrapper>
        <RelatedFolgen folgeId={folge._id} />
      </Wrapper>
    </>
  );
};

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

  const folge = await getPublicFolge(id);

  if (!folge || folge.isHidden) return { notFound: true };

  return {
    props: {
      folge: parseMongo(folge),
    },
    revalidate: 10,
  };
};

export default FolgePage;
