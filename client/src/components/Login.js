import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Input = styled.input`
  font-family: inherit;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  width: 100%;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  // const { setUser } = useContext(AuthContext);
  const { setAuthData } = useContext(AuthContext);

  const handleSubmit = () => {
    Axios.post('/api/auth/login', {
      email, password
    })
    .then(response => {
      const user = response.data.user;
      delete user['list'];
      user.token = response.data.token;
      // setUser(user);
      setAuthData(user);
      history.push('/')
    })
    .catch(error => console.log(error));
  }

  return (
    <div className="wrapper">
      <Input
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <Input
      type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button className="button" onClick={handleSubmit}>Login</button>
    </div>
  );
}

export default Login;