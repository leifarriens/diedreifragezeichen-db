import Link from 'next/link';
import { getSession, signIn, useSession } from 'next-auth/react';
import { FolgeType } from 'src/types';
import styled from 'styled-components';

import Wrapper from '@/components/Wrapper';

import Header from '../../components/Header';
import dbConnect from '../../db';
import Folge from '../../models/folge';
import Rating from '../../models/rating';
import { colors } from '../../theme';
import { parseMongo } from '../../utils';

type ProfilePageProps = {
  ratings: RatingWithFolge[];
  numberOfFolgen: number;
};

function Profile({ ratings, numberOfFolgen }: ProfilePageProps) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) return null;

  if (!session) return signIn();

  const { name } = session.user;

  const ratetPercent =
    ((ratings.length / numberOfFolgen) * 100).toFixed(0) + '%';
  console.log(ratings);

  return (
    <Styles>
      <Header />
      <Wrapper minWidth="860px">
        <h2>Hallo, {name}</h2>

        {ratings.length >= 2 && (
          <p>
            Danke, dass du bereits {ratings.length.toString()} folgen Bewertet
            hast!
          </p>
        )}

        <PorgressContainer>
          <progress value={ratings.length} max={numberOfFolgen}>
            70 %
          </progress>
          <span>{ratings.length.toString()}</span>
          <span>{ratetPercent.toString()}</span>
          <span>{numberOfFolgen}</span>
        </PorgressContainer>

        <h3>Deine Bewertungen</h3>

        <List>
          {ratings
            .sort((a, b) => {
              return (
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
              );
            })
            .map(({ _id, value, folge }) => {
              const href = `/folge/${folge._id}`;

              return (
                <ListElement key={_id}>
                  <Link href={href}>
                    <a>
                      <img src={folge.images[1].url} />
                    </a>
                  </Link>
                  <Link href={href}>
                    <a>{folge.name}</a>
                  </Link>
                  <div className="rating">{value}</div>
                </ListElement>
              );
            })}
        </List>
      </Wrapper>
    </Styles>
  );
}

interface RatingWithFolge {
  _id: string;
  createdAt: Date;
  user: string;
  value: number;
  updatedAt: Date;
  folge: FolgeType;
}

const ListElement = styled.div`
  display: grid;
  grid-column-gap: 18px;
  grid-template-columns: 124px 1fr 220px;
  align-items: center;
  background-color: #001e33;
  padding: 12px 24px;
  border-radius: 12px;

  .rating {
    padding: 8px;
    border-radius: 6px;
    text-align: right;
    justify-self: end;
    background-color: ${colors.lightblue};
  }
`;

const List = styled.div`
  > ${ListElement} {
    margin-bottom: 12px;
  }
`;

const Styles = styled.div`
  h3 {
    margin: 36px 0;
  }
`;

const PorgressContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  /* grid-template-areas: 'bar bar bar'; */

  progress {
    width: 100%;
    grid-column: 1/4;
    /* grid-area: bar; */
  }

  span:nth-of-type(2) {
    text-align: center;
  }
`;

export const getServerSideProps = async ({ req, res }: any) => {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, {
      Location: '/api/auth/signin',
    });

    return res.end();
  }

  await dbConnect();

  const data = await Rating.find({ id: session.user.id }).populate('folge');
  const ratings: RatingWithFolge[] = parseMongo(data);

  const numberOfFolgen = await Folge.count({});
  console.log(numberOfFolgen);

  // await dbConnect();
  // const data = await Rating.find({ id: session.user.id }).populate('folge');
  // console.log(data);
  // const folgenWithRating = data.map(rating => {
  //   return {...rating.folge, userRating = }
  // })
  // const ratedFolgen = data.map((r) => r.folge);
  // console.log(ratedFolgen);
  // const ratedFolgen = data.map((r) => r.folge);

  // const folgen = await Folge.fin
  // const rawFolgen = await Folge.find({
  //   _id: {
  //     $in: ratedFolgen,
  //   },
  // });
  // // .populate('ratings');

  // const ratings = parseMongo(data);
  // console.log(ratings);
  // const folgen = parseMongo(rawFolgen);

  // let folgenWithRating = folgen.map((f) => {
  //   f.userRating = ratings.find((r) => r.folge === f._id).value;
  //   return f;
  // });

  // folgenWithRating = folgenWithRating.map(applyFolgenRating);

  return {
    props: {
      ratings,
      numberOfFolgen,
    },
  };
};

export default Profile;
