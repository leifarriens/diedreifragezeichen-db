import React, { useReducer } from 'react';
import AuthReducer from './AuthReducer';

const initialState = {
  user: null,
  token: ''
}

export const AuthContext = React.createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Actions
  function loadUserFromStorage() {
    console.log(user);
    const user = JSON.parse(window.localStorage.getItem('user')) || null;
    dispatch({
      type: 'LOAD_USER',
      payload: user
    });
  }

  function setUser(user) {
    console.log(user);
    window.localStorage.setItem('user', JSON.stringify(user));
    dispatch({
      type: 'SET_USER',
      payload: user
    });
  }

  function setJwt(token) {
    console.log(token);
    window.localStorage.setItem('token', token);
    dispatch({
      type: 'SET_JWT',
      payload: token
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        loadUserFromStorage,
        setUser,
        setJwt
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}