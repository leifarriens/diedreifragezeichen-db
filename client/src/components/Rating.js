import React, { useContext } from 'react';
import styled from 'styled-components';
import ReactStars from 'react-rating-stars-component';
import Axios from 'axios';
import { roundRatingToPointFive } from '../utils';
import whiteIcon from '../assets/white.png';
import blueIcon from '../assets/blue.png';
import halfIcon from '../assets/half.png';

import { AuthContext } from '../context/AuthContext';

const RateIcon = styled.i`
  display: block;
  width: 22px;
  height: 42px;
  background-image: url(${props => props.icon});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const Rating = ({ folge_id, defaultRating }) => {
  const { auth } = useContext(AuthContext);
  
  const roundedRating = roundRatingToPointFive(defaultRating);
  
  const rateFolge = (value) => {
    if (!auth.data) {
      location.href = '/login';
    } else {
      const rating = Number(value);
      const url = `/api/folgen/${folge_id}/rating`;
      
      Axios.post(url, {
        rating
      }, {
        headers: {
          'Authorization': 'Bearer ' + auth.data.token
        }
      })
      .then(response => {
        console.log(response.data);
        // window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  const settings = {
    count: 10,
    value: roundedRating,
    isHalf: true,
    emptyIcon: <RateIcon icon={whiteIcon} />,
    halfIcon: <RateIcon icon={halfIcon} />,
    filledIcon: <RateIcon icon={blueIcon} />,
    onChange: newValue => rateFolge(newValue)
  }

  return <ReactStars style={{ display: 'inline-flex' }} {...settings}/>;
}

export default Rating;