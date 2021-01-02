import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...restProps }) => {
  // const { user } = useContext(AuthContext);
  const { auth } = useContext(AuthContext);
  const { loading } = auth;

  console.log(loading);

  if (loading) {
    // <Route {...restProps} render={() => {
    //   return <p>Loading...</p>;
    // }}/>
    return JSON.stringify(loading)
  }

  return (
    <Route {...restProps} render={(props) => (
      !auth.data ? 
      <Redirect to={{ pathname: '/login', state: { from: props.location }}} /> : <Component {...props} />
    )}/>
  );
}

export default ProtectedRoute;