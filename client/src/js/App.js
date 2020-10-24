import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AOS from 'aos';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Grid from '../components/Grid';

import FolgePage from '../pages/Folge';
import Folge from '../components/Folge';

const App = () => {

  // useEffect(() => {
    
  // });

  return (
    <div>
      <Router>
      <Header />
        {/* <Grid /> */}
        <Switch>
          <Route exact path="/" component={Grid} />
          <Route exact path="/folge/:id" component={Folge}/>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;