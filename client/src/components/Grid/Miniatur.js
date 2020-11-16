import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { calcFolgenRating } from '../../utils';

const Container = styled.div`
  width: 100%;
`;

const Cover = styled.img`
  width: 100%;
  height: auto;
  min-height: 230px;
  transition: transform 150ms ease;
  /* filter: blur(3px); */

  :hover {
    transform: scale(1.05); 
  }
`;

const Miniatur = ({ folge }) => {
  const rating = calcFolgenRating(folge.ratings);

  return (
    <Container>
      <Link to={`/folge/${folge._id}`}>
        <Cover src={folge.images[2].url}/>
      </Link>
      <div>{rating.toFixed(1)}/10</div>
      <div>{dayjs(folge.release_date).format('DD.MM.YYYY')}</div>
    </Container>
  );
}

export default Miniatur;