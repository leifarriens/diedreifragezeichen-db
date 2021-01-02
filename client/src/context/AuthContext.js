import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: true,
  data: null
}

export const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialState);

  const setAuthData = data => {
    setAuth({ data });
  }

  useEffect(() => {
    setAuth({ loading: false, data: JSON.parse(window.localStorage.getItem('authData'))});
  }, []);

  useEffect(() => {
    window.localStorage.setItem('authData', JSON.stringify(auth.data));
  }, [auth.data]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuthData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node
};