import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Axios from 'axios';

import ProtectedRoute from '../components/PotectedRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import Grid from '../components/Grid';
import Grid from '../components/Grid';
import Login from '../components/Login';
import Profile from '../components/Profile';

import Folge from '../components/Folge';
import { AuthContext } from '../context/AuthContext';

const App = () => {
  const { setUser } = useContext(AuthContext);

  const [folgen, setFolgen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(window.localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchAllFolgen = () => {
      Axios('/api/folge')
      .then(response => {
        setFolgen(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setError(error);
      });
    }
    fetchAllFolgen();
  }, []);

  return (
    <div>
      <Router >
        <Header />
        {/* <Grid /> */}
        {loading && <FullpageLoader />}
        <Switch>
          <Route exact path="/" component={() => <Grid folgen={folgen}/>}/>
          <Route exact path="/folge/:id" component={Folge}/>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/profile" component={Profile}/>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;