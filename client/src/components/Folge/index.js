import React from 'react';
import dayjs from 'dayjs';
import { Container, Cover, Content, Buttons, Background } from './StyledFolge';
import Rating from '../Rating';
// import AddToList from '../AddToLitst';
// import Rate from '../Rate';
import { calcFolgenRating } from '../../utils';

const Folge = ({ folge }) => {
  const { images, name, release_date, _id, ratings, number, spotify_id } = folge;
  const rating = calcFolgenRating(ratings);
  const isBigCover = Number(number) >= 125 ? true : false;

  return (
    <Container className="wrapper">
      <Cover>
        <img src={images[0].url} />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1>{name}</h1>
        <div>Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}</div>
        <div><span style={{ fontSize: '30px' }}>{rating.toFixed(1)}/10</span></div>
        <Rating folge_id={_id} defaultRating={rating}/>
        
        {/* <Rate folge_id={_id} currentRating={calcFolgenRating(ratings)}/> */}
        <Buttons>
          <a className="button" target="_blank" rel="noreferrer" href={`spotify:album:${spotify_id}`}>Anhören</a>
          {/* <AddToList folge={folge}/> */}
        </Buttons>
      </Content>
      <Background url={images[0].url} bigCover={isBigCover}/>
    </Container>
  );
}

export default Folge;