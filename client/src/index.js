import React from 'react';
import ReactDOM from 'react-dom';

import './styles/App.scss';
import AppContainer from './components/AppContainer';

import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

ReactDOM.render(<AppContainer />, document.getElementById('root'));