import React, { useContext } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Axios from 'axios';

import { AuthContext } from '../context/AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';

const AddToList = ({ folge }) => {
  const { user } = useContext(AuthContext);

  const [isOnList, setIsOnList] = useState(false);

  const addToUserList = () => {
    Axios.post(`/api/user/${user._id}/list`, {
      folge_id: folge._id
    })
    .then(() => {
      console.log('done');
      setIsOnList(isOn);
    })
    .catch(error => {
      console.log(error);
    });
  }

  useEffect(() => {
    const isOnUserList = async () => {
      const { data } = await Axios(`/api/user/${user._id}`);
      const isOn = data.list.find(x => x.folge_id === folge._id) && true || false;
      setIsOnList(isOn);
    }
    isOnUserList();
  }, []);

  if (isOnList) {
    return <button className="button icon"><AiFillHeart /></button>;
  }

  return <button className="button icon" onClick={addToUserList}><AiOutlineHeart /></button>;
}

export default AddToList;