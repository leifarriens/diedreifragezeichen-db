import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useMemo } from 'react';
import styled from 'styled-components';

import Button from '@/components/shared/Button';
import { useGlobalState } from '@/context/GlobalContext';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import dayjs from '@/lib/dayjs';
import type { Folge } from '@/models/folge';
import { getFolgen } from '@/services/index';
import { applyFilter } from '@/utils/filter';
import { parseMongo } from '@/utils/index';

const DATE_FORMAT = 'DD.MM.YYYY';

export default function AdminFolgen({ folgen }: { folgen: Folge[] }) {
  const { searchQuery } = useGlobalState();

  const filteredFolgen = useMemo(
    () => applyFilter(folgen, { searchQuery }),
    [folgen, searchQuery],
  );

  return (
    <Wrapper>
      {filteredFolgen.map((folge) => (
        <Item key={folge._id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={folge.images[1].url} alt={folge.name} />
          <div>
            <h3>{folge.name}</h3>
            <h4>{folge.number}</h4>
            <div>
              Release Date: {dayjs(folge.release_date).format(DATE_FORMAT)}
            </div>
            <div>Updated At: {dayjs(folge.updated_at).format(DATE_FORMAT)}</div>
            <div>{folge.type}</div>
            <div className="stats">
              <span>Rating: {folge.community_rating}</span>
              <span>
                Number of Ratings: {folge.number_of_community_ratings}
              </span>
              <span>Popularity: {folge.community_popularity}</span>
            </div>
            <div className="buttons">
              <Link href={`/admin/folgen/${folge._id}`}>
                <Button as="a" size="small">
                  Bearbeiten
                </Button>
              </Link>
              <Button
                as="a"
                href={`/folge/${folge._id}`}
                target="_blank"
                size="small"
              >
                Öffnen
              </Button>
            </div>
          </div>
        </Item>
      ))}
    </Wrapper>
  );
}

const Item = styled.article`
  margin-bottom: 1em;
  display: grid;
  grid-template-columns: 220px 1fr;
  column-gap: 1em;

  .stats {
    span {
      margin-right: 2em;
    }
  }

  .buttons {
    ${Button} + ${Button} {
      margin-left: 1em;
    }
  }

  * + * {
    margin-top: 0.8em;
  }
`;

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'Admin') {
    res.writeHead(302, {
      Location: '/',
    });

    return res.end();
  }

  await dbConnect();

  const folgen = parseMongo(await getFolgen());

  return {
    props: { folgen },
  };
};