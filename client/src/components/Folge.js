import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';

import { FullpageLoader } from '../components/Loader';
import { calcFolgenRating } from '../utils';

import Rate from '../components/Rate';
import AltFolgen from '../components/AltFolgen';
import AddToList from './AddToLitst';

const FolgePage = () => {
  const { id } = useParams();

  const [folge, setFolge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchFolge = async () => {

      try {
        setLoading(true);
        const response = await Axios(`/api/folge/${id}`);
        setFolge(response.data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFolge();
  }, [id]);

  return (
    <div className="page">
      {loading && <FullpageLoader />}
      {folge && <Folge data={folge}/>}
      {error && <div className="wrapper">{error.message}</div>}
    </div>
  );
}

const Folge = ({ data }) => {
  const rating = calcFolgenRating(data.ratings);
  const formatedRating = rating.toFixed(1);

  const style = {
    position: 'fixed',
    // top: '100px',
    // left: '0',
    // width: '100%',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }

  return (
    <div style={style}>
      <div className="folge wrapper">
        <div className="container">
          <div className="cover">
            <img src={data.images[0].url} />
          </div>
          <div>
            <h2>Die drei ???</h2>
            <h1>{data.name}</h1>
            <div>Veröffentlicht am {dayjs(data.release_date).format('DD.MM.YYYY')}</div>
            <div>{formatedRating} / 10 {data.ratings.length} Bewertungen</div>
            <Rate folge_id={data._id} currentRating={rating}/>
            {/* <div>
              <a className="button" target="_blank" href={`spotify:album:${data.spotify_id}`}>Anhören</a>
              <AddToList folge={data}/>
            </div> */}
          </div>
        </div>
        {/* <AltFolgen folgen_id={data._id} />       */}
      </div>
    </div>

  );
}

export default FolgePage;