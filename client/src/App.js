import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Dashboard from './components/pages/Dashboard';

import ArticlesState from './components/context/articles/ArticlesState';

const App = () => {
  return (
    <ArticlesState>
      <Router>
        <Fragment>
          <Navbar />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/about' component={About} />
              <Route exact path='/dashboard' component={Dashboard} />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </ArticlesState>
  );
};

export default App;
