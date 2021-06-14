import dbConnect from '../../db';
import Rating from '../../models/rating';
import Folge from '../../models/folge';
import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { parseMongo } from '../../utils';
import {
  GridContainer,
  FolgenContainer,
} from '../../components/Grid/StyledGrid';
import GridFolge from '../../components/Grid/GridFolge';
import Header from '../../components/Header';
import styled from 'styled-components';
import Link from 'next/link';

function Profile({ folgenWithRating }) {
  const [session, loading] = useSession();

  if (loading) return null;

  if (!session) return signIn();

  const { name, email } = session.user;

  return (
    <>
      <Header />
      <div className="wrapper">
        <div>{name}</div>
        <div>{email}</div>
        <button className="button red" onClick={signOut}>
          Logout
        </button>
        <h3 style={{ margin: '36px 0'}}>Deine Bewertungen</h3>
        <GridContainer>
          <ul>
            {/* <FolgenContainer> */}
            {folgenWithRating.map((folge) => (
              // <GridFolge key={folge._id} folge={folge} coverOnly={true} />
              // <li key={folge._id}>
              //   <span>
              //     <img src={folge.images[1].url} height="200" />{folge.name} {folge.yourRating}</span>
              // </li>
              <ListItem key={folge._id} folge={folge} />
            ))}
            {/* </FolgenContainer> */}
          </ul>
        </GridContainer>
      </div>
    </>
  );
}

const ListItemContainer = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  grid-column-gap: 18px;
  margin-bottom: 18px;
  background-color: #010a0f;
  padding: 18px;
  align-items: center;
  box-shadow: rgb(0 0 0 / 20%) 0px 8px 24px;
  transition: transform 150ms ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    height: auto;
    width: 100%;
  }
`;

const ListItem = ({ folge }) => {
  return (
    <Link href={`folge/${folge._id}`}>
      <a>
        <ListItemContainer bgImage={folge.images[1].url}>
          <div>
            <img src={folge.images[1].url} alt="" />
          </div>
          <span>{folge.name}</span>
          <span>{folge.yourRating}</span>
        </ListItemContainer>
      </a>
    </Link>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, {
      Location: '/api/auth/signin',
      // Location: '/',
    });
    res.end();

    return {
      props: {}
    }
  }

  await dbConnect();

  const data = await Rating.find({ user: session.user.email });

  const ratedFolgen = data.map((r) => r.folge);

  const rawFolgen = await Folge.find({
    _id: {
      $in: ratedFolgen,
    },
  });

  const ratings = parseMongo(data);
  const folgen = parseMongo(rawFolgen);

  const folgenWithRating = folgen.map((f) => {
    f.yourRating = ratings.find((r) => r.folge === f._id).value;
    return f;
  });

  return {
    props: {
      folgenWithRating,
    },
  };
}

export default Profile;
