import React, { useContext } from 'react';
import Axios from 'axios';
import RateInput from './RateInput';

import { AuthContext } from '../context/AuthContext';

import '../styles/rate.css';

const Rate = ({ folge_id, currentRating }) => {
  const { user } = useContext(AuthContext);

  const rateFolge = (value) => {
    if (!user) {
      location.href = '/login';
    } else {
      const rating = Number(value);
      const url = `/api/folge/${folge_id}/rating`;
    
      Axios.post(url, {
        rating
      }, {
        headers: {
          'Authorization': 'Bearer ' + user.token
        }
      })
      .then(response => {
        console.log(response.data);
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  return (
    <div>
      <RateInput
        name="rating"
        max={10}
        value={currentRating}
        onChange={(value) => {
          console.log(value);
          rateFolge(value);
        }}
      />
    </div>
  );
}

export default Rate;