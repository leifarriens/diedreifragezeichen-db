import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  // const { user, setUser } = useContext(AuthContext);
  const { auth, setAuthData } = useContext(AuthContext);

  const [profileData, setProfileData] = useState('');
  // const [userFolgen, setUserFolgen] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await Axios(`/api/user/${auth.data._id}`);
        console.log(response.data);
        setProfileData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, []);

  // useEffect(() => {
  //   const fetchUserList = async () => {
  //     try {
  //       const response = await Axios(`/api/user/${auth.data._id}/list`);
  //       // console.log(response.data);
  //       setUserFolgen(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchUserList()
  // }, []);

  const handleLogout = () => {
    setAuthData(null);
  }

  return (
    <div className="wrapper">
      {profileData && (
        <div>
          <h2>{profileData.email}</h2>
          {/* {JSON.stringify(userFolgen)} */}
          {/* <List user_id={user._id} items={profileData.list}/> */}
          <button className="button" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

// const List = ({ user_id, items }) => {

//   console.log(items);

//   const [userFolgen, setUserFolgen] = useState([]);
  
//   useEffect(() => {
//     const fetchLikedFolgen = async () => {
//       try {
//         const response = await Axios(`/api/user/${user_id}/list`);
//         console.log(response.data);
//         setUserFolgen(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchLikedFolgen();
//   }, []);
//   return (
//     <Grid folgen={userFolgen}/>
//   );
// }

export default Profile;