import React, { useContext } from 'react';
import Axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const AddToList = ({ folge }) => {
  const { user } = useContext(AuthContext);

  const addToUserList = () => {
    const url = `/api/user/${user._id}/list`;
    console.log(url);
    Axios.post(`/api/user/${user._id}/list`, {
      folge_id: folge._id
    })
    .then(() => {
      console.log('done');
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <button class="button" onClick={addToUserList}>Auf die Merkliste</button>
  );
}

export default AddToList;