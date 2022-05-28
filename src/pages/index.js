import Axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Grid from '@/components/Grid';
import Header from '@/components/Header';

import dbConnect from '../db';
import { getFolgen } from '../services';
import { parseMongo } from '../utils';

function Home(props) {
  const { data: session, status } = useSession();

  const [folgen, setFolgen] = useState(props.folgen);

  useEffect(() => {
    const fetchUserRatings = async () => {
      const { data } = await Axios(`/api/user/ratings`);

      const folgenWithUserRating = folgen.map((folge) => {
        const rating = data.find((rating) => rating.folge === folge._id);

        if (!rating) {
          folge.user_rating = null;
          return folge;
        }

        folge.user_rating = rating.value;
        return folge;
      });

      setFolgen(folgenWithUserRating);
    };

    if (status === 'authenticated') {
      fetchUserRatings();
    }
  }, [status]);

  return (
    <>
      <Header />
      <div className="wrapper stretch">
        <Grid
          folgen={folgen}
          sortOptions={['dateDesc', 'dateAsc', 'rating', 'popularity']}
        />
      </div>

      {!session && (
        <HomeFooter className="wrapper">
          <Link href={'/signin'}>
            <a className="button red">Jetzt Bewerten!</a>
          </Link>
        </HomeFooter>
      )}
    </>
  );
}

const HomeFooter = styled.footer`
  text-align: center;
  margin-top: 124px;
`;

export async function getStaticProps() {
  await dbConnect();

  const folgen = parseMongo(
    await getFolgen({
      fields: [
        'name',
        'number',
        'type',
        'images',
        'release_date',
        'rating',
        'popularity',
      ],
    })
  );

  const size = Buffer.byteLength(JSON.stringify(folgen));
  console.log('Size', parseInt(size / 1024), 'kB');

  return {
    props: { folgen },
    revalidate: 60,
  };
}

export default Home;
