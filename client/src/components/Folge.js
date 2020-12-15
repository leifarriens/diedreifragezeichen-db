import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import dayjs from 'dayjs';
import ColorThief from 'colorthief'

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
      setLoading(true);
      try {
        const response = await Axios(`/api/folgen/${id}`);
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
    <div>
      {loading && <FullpageLoader />}
      {folge && <Folge data={folge}/>}
      {error && <div className="wrapper">{error.message}</div>}
    </div>
  );
}

const Folge = ({ data }) => {
  const [colors, setColors] = useState([]);
  const colorThief = new ColorThief();
  const [mainColor, setMainColor] = useState([]);
  const domColor = colors[0] || [];

  const getColors = (e) => {
    const img = e.target;
    img.setAttribute('crossOrigin', '');
    setColors(colorThief.getPalette(img));
    setMainColor(colorThief.getColor(img));
  }

  return (
    // <div style={{ backgroundColor: `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]})` }}>
    <div>
    <div className="folge wrapper">
      <div className="folge__cover">
        <img src={data.images[0].url} onLoad={getColors}/>
      </div>
      <div className="folge__content">
        <h2>Die drei ???</h2>
        <h1>{data.name}</h1>
        <div>Veröffentlicht am {dayjs(data.release_date).format('DD.MM.YYYY')}</div>
        <Rate folge_id={data._id} currentRating={calcFolgenRating(data.ratings)}/>
        <div>
          <a className="button" target="_blank" href={`spotify:album:${data.spotify_id}`}>Anhören</a>
          {/* <AddToList folge={data}/> */}
        </div>
      </div>
      
    </div>
    <Palette colors={colors}/>
    {/* <AltFolgen folgen_id={data._id} /> */}
    </div>
  );
}

const Palette = ({ colors }) => {
  return (
    <div style={{ display: 'flex', flexGrow: '2'}}>
      {colors.map(entry => (
        <div style={{width: '100%', height: '50px', backgroundColor: `rgb(${entry[0]}, ${entry[1]}, ${entry[2]})`}}></div>
      ))}
    </div>
  )
}

export default FolgePage;