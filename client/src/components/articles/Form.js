import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticlesContext from '../context/articles/ArticlesContext';

import AuthContext from '../context/auth/AuthContext';

const Form = (props) => {
  const articlesContaxt = useContext(ArticlesContext);
  const authContext = useContext(AuthContext);

  const { addArticle, current, clearCurrent, updateArticle } = articlesContaxt;

  useEffect(() => {
    authContext.loadUser();

    if (current !== null) {
      setArticle({
        title: current.title,
        slug: current.slug,
        image: null,
        body: current.body,
      });
    } else {
      setArticle({
        title: '',
        slug: '',
        image: null,
        body: '',
      });
    }
    // eslint-disable-next-line
  }, [articlesContaxt, current]);

  const [article, setArticle] = useState({
    title: '',
    slug: '',
    image: null,
    body: '',
  });

  const { title, slug, body, image } = article;

  const onChange = (e) =>
    setArticle({ ...article, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    setArticle({ ...article, image: e.target.files[0] });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('body', body);
    formData.append('image', image);
    if (current === null) {
      addArticle(formData);
      props.history.push('/dashboard');
    } else {
      formData.append('id', current._id);
      updateArticle(formData);
      clearCurrent();
      props.history.push('/dashboard');
    }
  };

  return (
    <form encType='multipart/form-data' onSubmit={onSubmit}>
      <Link
        to='/dashboard'
        onClick={() => clearCurrent()}
        className='btn btn-light'
      >
        Go Back
      </Link>
      <h2 className='text-primary'>
        {current ? 'Edit Article' : 'Add Article'}
      </h2>
      <input
        type='text'
        placeholder='Title'
        name='title'
        value={title}
        onChange={onChange}
      />
      <input
        type='text'
        placeholder='Slug'
        name='slug'
        value={slug}
        onChange={onChange}
      />
      <input type='file' name='image' onChange={onFileChange} />
      <textarea
        name='body'
        style={{ height: '300px' }}
        value={body}
        onChange={onChange}
      />
      <div>
        <input
          type='submit'
          value={current ? 'Update Article' : 'Add Article'}
          className='btn btn-primary btn-block'
        />
      </div>
    </form>
  );
};

export default Form;
