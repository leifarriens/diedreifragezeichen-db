import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Axios from 'axios';

import {
  Header,
  Footer,
  Grid,
  Login,
  Profile,
  Folge,
  ProtectedRoute
} from './components/';

import { FullpageLoader } from './components/Loader';

import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';

const App = () => {
  const [folgen, setFolgen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllFolgen = async () => {
      setLoading(true);
      try {
        const response = await Axios('/api/folgen');
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
    <GlobalProvider>
      <AuthProvider>
        <Router>
          <Header />
          {loading && <FullpageLoader />}
          {error && error}
          <Switch>
            <Route exact path="/" component={() => <Grid folgen={folgen}/>}/>
            <Route exact path="/folge/:id" component={Folge}/>
            <Route exact path="/login" component={Login} />
            <Route exact path="/nix" />
            <ProtectedRoute exact path="/profile" component={Profile}/>
          </Switch>
          <Footer />
        </Router>
      </AuthProvider>
    </GlobalProvider>
  );
}

export default App;