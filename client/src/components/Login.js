import React, { useContext, useState } from 'react';
import Axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useContext(AuthContext);

  const handleSubmit = () => {
    Axios.post('/api/auth/login', {
      email, password
    })
    .then(response => {
      const user = response.data.user;
      user.token = response.data.token;
      
      setUser(user);
    })
    .catch(error => console.log(error));
  }

  return (
    <div>
      <input
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}

export default Login;