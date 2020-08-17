import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Single from './components/pages/Single';
import About from './components/pages/About';
import Dashboard from './components/pages/Dashboard';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Form from './components/articles/Form';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';

import ArticlesState from './components/context/articles/ArticlesState';
import AuthState from './components/context/auth/AuthState';
import AlertState from './components/context/alert/AlertState';

import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    <AuthState>
      <ArticlesState>
        <AlertState>
          <Router>
            <Fragment>
              <Navbar />
              <div className='container'>
                <Alerts />
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/articles/:slug' component={Single} />
                  <Route exact path='/about' component={About} />
                  <Route exact path='/register' component={Register} />
                  <Route exact path='/login' component={Login} />
                  <PrivateRoute exact path='/dashboard' component={Dashboard} />
                  <PrivateRoute
                    exact
                    path='/dashboard/article'
                    component={Form}
                  />
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertState>
      </ArticlesState>
    </AuthState>
  );
};

export default App;
