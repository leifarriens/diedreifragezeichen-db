import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

// import Swiper core and required components
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const AltFolgen = ({ folgen_id }) => {
  const [altFolgen, setAltFolgen] = useState([]);

  useEffect(() => {
    if (folgen_id) getAltFolgen();
  }, [folgen_id])

  const getAltFolgen = () => {
    console.log(`/api/folge/${folgen_id}/alt`);
    Axios(`/api/folge/${folgen_id}/alt`)
    .then(response => {
      console.log(response.data);
      setAltFolgen(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  }

  const style = {
    margin: '40px 0',
    height: '250px'
  }

  return (
    <Swiper
      style={style}
      spaceBetween={30}
      slidesPerView={5}
      initialSlide={3}
      navigation
      pagination={{ clickable: true }}
      className="folgen-slider"
    >
      {altFolgen.map(folge => {

        const coverClass = folge._id === folgen_id ? 'folgen-slider__cover active' : 'folgen-slider__cover';

        return (
          <SwiperSlide key={folge._id}>
            <Link to={`/folge/${folge._id}`}>
              <div className={coverClass}>
                <img src={folge.images[1].url}/>
              </div>
            </Link>
          </SwiperSlide>        
        );
      })}
      {/* {altFolgen.map(folge => (
        <SwiperSlide key={folge._id}>
          <Link to={`/folge/${folge._id}`}>
            <div
              className="folgen-slider__cover"
            >
              <img src={folge.images[1].url}/>
            </div>
          </Link>
        </SwiperSlide>
      ))} */}
    </Swiper>
  );
}

export default AltFolgen;