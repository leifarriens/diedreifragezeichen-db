import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';

import { FullpageLoader } from '../components/Loader';
import { calcFolgenRating } from '../utils';

import Rate from '../components/Rate';
import AltFolgen from '../components/AltFolgen';
import AddToList from './AddToLitst';

// import useRequest from '../components/useRequest';

const FolgePage = () => {
  const { id } = useParams();

  const [folge, setFolge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   fetchFolge();
  // }, [id]);
  
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


  // const fetchFolge = () => {
  //   Axios(`/api/folge/${id}`)
  //   .then(response => {
  //     console.log(response.data);
  //     setFolge(response.data);
  //     setLoading(false);
  //   })
  //   .catch(error => {
  //     setLoading(false);
  //     setError(error.message);
  //   });
  // }

  // return loading ? <Loader /> : <Folge data={folge}/>;
  // const { data, loading, error } = useRequest(`/api/folge/${id}`);

  return (
    <div>
      {loading && <FullpageLoader />}
      {folge && <Folge data={folge}/>}
      {/* {loading ? <Loader /> : <Folge data={data}/>} */}
      {error && <div className="wrapper">{error.message}</div>}
    </div>
  );
}

const Folge = ({ data }) => {
  const rating = calcFolgenRating(data.ratings);
  const formatedRating = rating.toFixed(1);

  return (
    <div>
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