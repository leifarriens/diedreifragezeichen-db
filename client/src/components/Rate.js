import React from 'react';
import Axios from 'axios';

import '../style/rate.css';

const Rate = ({ folge_id }) => {

  const rateFolge = (e) => {
    const rating = Number(e.target.value);
    const url = `/api/folge/${folge_id}/rating`;
    
    Axios.post(url, {
      rating
    })
    .then(response => {
      console.log(response.data);
      window.location.reload();
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <div>
      <form className="rating" action="/folge/<%= folge._id %>/rate">
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="1" />
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="2" />
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="3" />
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>   
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="4" />
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="5" />
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="6" />
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="7" />
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
          <span className="icon">?</span>
        </label>
        <label>
          <input onChange={rateFolge} type="radio" name="rating" value="8" />
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
          <input onChange={rateFolge} type="radio" name="rating" value="9" />
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
          <input onChange={rateFolge} type="radio" name="rating" value="10" />
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