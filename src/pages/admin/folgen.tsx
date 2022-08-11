import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import Button from '@/components/shared/Button';
import { useGlobalState } from '@/context/GlobalContext';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import dayjs from '@/lib/dayjs';
import { getFolgen } from '@/services/index';
import { FolgeType } from '@/types';
import { applyFilter } from '@/utils/filter';
import { parseMongo } from '@/utils/index';

const ADMIN_IDS = process.env.ADMIN_IDS;
const DATE_FORMAT = 'DD.MM.YYYY';

export default function AdminFolgen({ folgen }: { folgen: FolgeType[] }) {
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
            <div>
              Release Date: {dayjs(folge.release_date).format(DATE_FORMAT)}
            </div>
            <div>Updated At: {dayjs(folge.updatedAt).format(DATE_FORMAT)}</div>
            <div>{folge.type}</div>
            <div className="stats">
              <span>Rating: {folge.rating}</span>
              <span>Number of Ratings: {folge.number_of_ratings}</span>
              <span>Popularity: {folge.popularity}</span>
            </div>
            <Link href={`/folge/${folge._id}`}>
              <a target="_blank">Open</a>
            </Link>
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

  * + * {
    margin-top: 0.8em;
  }
`;

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });

  if (!session || !ADMIN_IDS.split(',').includes(session.user.id)) {
    res.writeHead(302, {
      Location: '/',
    });

    return res.end();
  }
  await dbConnect();

  const folgen: FolgeType[] = parseMongo(await getFolgen());

  return {
    props: { folgen },
  };
};
