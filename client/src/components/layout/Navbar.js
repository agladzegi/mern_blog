import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/auth/AuthContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, logout } = authContext;

  const authLinks = (
    <Fragment>
      <li>
        <Link to='/'>Home</Link>
      </li>
      <li>
        <Link to='/dashboard'>Dashboard</Link>
      </li>
      <li>
        <Link to='/about'>About</Link>
      </li>
      <li>
        <a
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          href='#!'
        >
          Logout
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to='/'>Home</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
      <li>
        <Link to='/about'>About</Link>
      </li>
    </Fragment>
  );

  return (
    <div className='navbar bg-primary'>
      <h1>Mern Blog</h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

export default Navbar;
