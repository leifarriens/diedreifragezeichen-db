import React from 'react';
import App from '../App';

import { AuthProvider } from '../context/AuthContext';

const AppContainer = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppContainer;