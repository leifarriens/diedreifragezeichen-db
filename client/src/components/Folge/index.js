import React from 'react';
import dayjs from 'dayjs';
import { Container, Cover, Content, Background } from './StyledFolge';
import Rating from '../Rating';
import Rate from '../Rate';
import { calcFolgenRating } from '../../utils';

const Folge = ({ folge }) => {
  const { images, name, release_date, _id, ratings} = folge;

  return (
    <Container className="wrapper">
      <Cover>
        <img src={images[0].url} />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1>{name}</h1>
        <div>Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}</div>
        <Rating folge_id={_id} defaultRating={calcFolgenRating(ratings)}/>
        {/* <Rate folge_id={_id} currentRating={calcFolgenRating(ratings)}/> */}
      </Content>
      <Background url={images[0].url}/>
    </Container>
  );
}

export default Folge;