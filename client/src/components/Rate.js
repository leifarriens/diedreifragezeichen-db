import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';

import { AuthContext } from '../context/AuthContext';

import '../style/rate.css';

const Rate = ({ folge_id, currentRating }) => {
  const { user } = useContext(AuthContext);

  const rateFolge = (e) => {
    if (!user) {
      location.href = '/login';
    } else {
      const rating = Number(e.target.value);
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

  const isChecked = (value) => {
    return value == currentRating.toFixed(0) && true;
  }

  return (
    <div>
      <form className="rating" action="/folge/<%= folge._id %>/rate">
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="1" checked={isChecked(1)}/>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="2" checked={isChecked(2)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="3" checked={isChecked(3)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>   
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="4" checked={isChecked(4)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="5" checked={isChecked(5)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="6" checked={isChecked(6)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="7" checked={isChecked(7)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="8" checked={isChecked(8)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="9" checked={isChecked(9)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="10" checked={isChecked(10)}/>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
      </form>
    </div>
  );
}

export default Rate;