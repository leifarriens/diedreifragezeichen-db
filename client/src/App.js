import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import AOS from 'aos';

import {
  Header,
  Hero,
  Footer,
  Grid,
  Login,
  Profile,
  Folge,
  ProtectedRoute
} from './components/';

// import Grid from './components/Grid/index';
import { Loader, FullpageLoader } from './components/Loader';

import { AuthContext } from './context/AuthContext';

const App = () => {
  const { setUser } = useContext(AuthContext);

  const [folgen, setFolgen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(window.localStorage.getItem('user')) || null;
    setUser(storedUser);
    AOS.init();
  }, []);

  useEffect(() => {
    const fetchAllFolgen = async () => {
      setLoading(true);
      try {
        const response = await Axios('/api/folge');
        setFolgen(response.data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllFolgen();
  }, []);

  return (
    <Router >
      <Header />
      {loading && <FullpageLoader />}
      {/* <Hero /> */}
      <Switch>
        <Route exact path="/" component={() => <Grid folgen={folgen}/>}/>
        <Route exact path="/folge/:id" component={Folge}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/nix" />
        <ProtectedRoute exact path="/profile" component={Profile}/>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;