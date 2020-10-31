import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [profileData, setProfileData] = useState('');

  // const handleLogout = () => {
  //   setUser(null);
  // }

  useEffect(() => {
    Axios(`/api/user/${user._id}`)
    .then(response => {
      console.log(response.data);
      setProfileData(response.data)
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  return (
    <div className="wrapper">
      {profileData && (
        <div>
          <h2>{profileData.email}</h2>
          <List items={profileData.list}/>
          {/* <button onClick={handleLogout}>Logout</button> */}
        </div>
      )}
    </div>
  );
}

const List = ({ items }) => {
  return (
    <ul>
      {items.map(entry => <li key={entry.folge_id}>{entry.folge_id}</li>)}
    </ul>
  );
}

export default Profile;