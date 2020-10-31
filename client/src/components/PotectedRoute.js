import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  console.log(user);

  return (
    <Route {...rest} render={(props) => (
      user ? 
        <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />   
    )} />
  );
}

export default ProtectedRoute;