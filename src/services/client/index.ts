import Axios from 'axios';

export const API = Axios.create({
  baseURL: '/api',
});

export * from './folgen';
export * from './user';
