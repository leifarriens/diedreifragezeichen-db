import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';

import Loader from '../components/Loader';
import Rate from '../components/Rate';
import AltFolgen from '../components/AltFolgen';

const FolgePage = () => {
  const { id } = useParams();

  const [folge, setFolge] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolge();
  }, [id]);

  const fetchFolge = () => {
    Axios(`/api/folge/${id}`)
    .then(response => {
      console.log(response.data);
      setFolge(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <div className="">
      {loading ? <Loader /> : <Folge data={folge}/>}
    </div>
  );
}

const Folge = ({ data }) => {
  const rating = data.ratings.reduce((a,b) => Number(a) + Number(b), 0) / data.ratings.length;
  const formatedRating = rating.toFixed(1);

  const style = {
    position: 'fixed',
    top: '250px',
    left: '0',
    zIndex: 999,
    width: '100%',
    backgroundColor: '#fff'
  }

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
            <Rate folge_id={data._id}/>
            <a target="_blank" href={`spotify:album:${data.spotify_id}`}>Anhören</a>
          </div>
        </div>
        <AltFolgen folgen_id={data._id} />        
      </div>
    </div>

  );
}

export default FolgePage;