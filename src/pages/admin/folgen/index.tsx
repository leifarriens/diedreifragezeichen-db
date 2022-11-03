import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useMemo } from 'react';
import styled from 'styled-components';

import Button from '@/components/shared/Button';
import { DATE_FORMAT } from '@/constants/formats';
import { useGlobalState } from '@/context/GlobalContext';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import dayjs from '@/lib/dayjs';
import type { Folge } from '@/models/folge';
import { getFolgen } from '@/services/index';
import { applyFilter } from '@/utils/filter';
import { parseMongo } from '@/utils/index';

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
          <Background
            style={{ backgroundImage: `url(${folge.images[1].url})` }}
          />
          <div className="cover">
            <img src={folge.images[1].url} alt={folge.name} />
          </div>
          <div className="info">
            <h3>{folge.name}</h3>
            <h4>{folge.number}</h4>
            <div>
              Release Date: {dayjs(folge.release_date).format(DATE_FORMAT)}
            </div>
            <div>Updated At: {dayjs(folge.updated_at).format(DATE_FORMAT)}</div>
            <div>{folge.type}</div>
            <div className="stats">
              <span>Rating: {folge.rating}</span>
              <span>Number of Ratings: {folge.number_of_ratings}</span>
              <span>Popularity: {folge.popularity}</span>
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

          <div className="inhalt">
            <p>{folge.inhalt}</p>
          </div>
        </Item>
      ))}
    </Wrapper>
  );
}

const Background = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(36px) brightness(50%);
`;

const Item = styled.article`
  margin-bottom: 1em;
  display: grid;
  grid-template-columns: 220px 1fr auto;
  column-gap: 1em;
  background-color: rgba(25, 25, 25, 0.5);
  padding: 1.45em;
  position: relative;
  overflow: hidden;
  border-radius: 12px;

  .cover {
    align-self: flex-start;
  }

  .info {
    * + * {
      margin-top: 0.8em;
    }

    .stats {
      span {
        margin-right: 2em;
      }
    }
  }

  .buttons {
    ${Button} + ${Button} {
      margin-left: 1em;
    }
  }

  .inhalt {
    max-width: 72ch;
    max-height: 32ch;
    overflow: auto;
  }
`;

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'Admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  await dbConnect();

  const folgen = parseMongo(await getFolgen());

  return {
    props: { folgen },
  };
};
