import React from 'react';
import ReactDOM from 'react-dom';

import './styles/App.scss';
import App from './App';

import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

ReactDOM.render(<App />, document.getElementById('root'));