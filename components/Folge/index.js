import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Cover, Content, Buttons, Background } from './StyledFolge';
import { calcFolgenRating, sortFolgenByDateAsc } from '../../utils';
import Rating from '../Rating';
import dayjs from 'dayjs';
import { Key, KeyContainer } from '../Key';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

const Folge = ({ folge, prevFolge, nextFolge }) => {
  const {
    images,
    name,
    release_date,
    _id,
    ratings,
    number,
    spotify_id,
  } = folge;

  const rating = calcFolgenRating(ratings);
  console.log(rating);
  const isBigCover = Number(number) >= 125 ? true : false;
  const router = useRouter();

  const _toPrevFolge = () => router.push('/folge/' + prevFolge._id);

  const _toNextFolge = () => router.push('/folge/' + nextFolge._id);
  console.log(folge);
  return (
    <Container className="wrapper">
      <Cover>
        <img src={images[0].url} />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1>{name}</h1>
        <div>Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}</div>
        <div>
          <span style={{ fontSize: '30px' }}>{rating ? rating : '???'}/10</span>
        </div>
        <Rating folge_id={_id} defaultRating={0} />
        <Buttons>
          <a
            className="button"
            target="_blank"
            rel="noreferrer"
            href={`spotify:album:${spotify_id}`}
          >
            Anhören
          </a>
          {/* <AddToList folge={folge}/> */}
        </Buttons>
      </Content>

      <KeyContainer style={{ marginTop: '56px', gridColumn: '1 / 3' }}>
        {prevFolge && <Key icon={BiLeftArrowAlt} onPress={_toPrevFolge} />}
        {nextFolge && <Key icon={BiRightArrowAlt} onPress={_toNextFolge} />}
      </KeyContainer>

      <Background url={images[0].url} bigCover={isBigCover} />
    </Container>
  );
};

export default Folge;
