import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...restProps }) => {
  const { user } = useContext(AuthContext);

  console.log(user);

  return (
    <Route {...restProps} render={(props) => (
      !user ? 
      <Redirect to={{ pathname: '/login', state: { from: props.location }}} /> : <Component {...props} />
    )}/>
  );
}

export default ProtectedRoute;