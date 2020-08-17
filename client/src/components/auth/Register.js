import React, { useState, useContext, useEffect } from 'react';

import AlertContext from '../context/alert/AlertContext';
import AuthContext from '../context/auth/AuthContext';

const Register = (props) => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { register, error, clearErrors, isAuthenticated } = authContext;

  const { setAlert } = alertContext;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/dashboard');
    }

    if (error === 'User already exists') {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    avatar: null,
  });

  const { name, email, password, password2 } = user;

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setUser({ ...user, avatar: e.target.files[0] });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
      setAlert('Please fill all fields', 'danger');
    } else if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      let formData = new FormData();
      if (user.avatar === null) {
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        register(formData);
      } else {
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('avatar', user.avatar);
        register(formData);
      }
    }
  };

  return (
    <div className='form-container'>
      <h1>
        User <span className='text-primary'>Register</span>
      </h1>
      <form encType='multipart/form-data' onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input type='text' name='name' value={name} onChange={onChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' value={email} onChange={onChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password2'>Confirm Password</label>
          <input
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='avatar'>Avatar</label>
          <input
            type='file'
            name='avatar'
            style={{ display: 'block' }}
            onChange={onFileChange}
          />
          <p>Please use png file with 1mb max file size</p>
        </div>
        <input
          type='submit'
          value='Register'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  );
};

export default Register;
