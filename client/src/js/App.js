import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Axios from 'axios';


import ProtectedRoute from '../components/PotectedRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Grid from '../components/Grid';
import Login from '../components/Login';
import Profile from '../components/Profile';

import Folge from '../components/Folge';
import { AuthContext, AuthProvider } from '../context/AuthContext';

const App = () => {
  // const [folgen, setFolgen] = useState([]);

  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    // getAllFolgen();
    const storedUser = JSON.parse(window.localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  // const getAllFolgen = () => {
  //   Axios('/api/folge')
  //   .then(response => {
  //     setFolgen(response.data);
  //     setLoading(false);
  //   })
  //   .catch(error => {
  //     console.log(error);
  //     setError(error);
  //   });
  // }

  // const sortByRating = () => {
  //   const newFolgen = folgen.sort((a, b) => {
  //     console.log(a);
  //   })
  // }

  return (
    <div>
      <Router>
        <Header />
        {/* <Grid /> */}
        <Switch>
          <Route exact path="/" component={() => <Grid />} />
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