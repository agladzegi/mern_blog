import React, { useContext, useEffect } from 'react';

import ArticlesContext from '../context/articles/ArticlesContext';

const Single = (props) => {
  const articlesContext = useContext(ArticlesContext);

  const { single, loading, getSingleArticle, error } = articlesContext;

  useEffect(() => {
    getSingleArticle(props.match.params.slug);
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (error) {
    return <h3>{error.msg}</h3>;
  }

  const { title, image, body, author, created_at } = single[0];

  return (
    <article className='article'>
      <h3>{title}</h3>
      <img src={`http://localhost:5000/static${image}`} alt={title} />
      <div className='article-meta'>
        <p>
          <strong>Published:</strong>{' '}
          {new Date(created_at).toLocaleDateString()}
        </p>
      </div>
      <div className='article-body'>
        <p>{body}</p>
      </div>
      <div className='author-div'>
        <img
          src={`http://localhost:5000/static${single[1].userImg}`}
          alt={author}
          style={{
            width: '150px',
            height: '150px',
            display: 'inline-block',
            objectFit: 'contain',
          }}
        />
        <h3>{author}</h3>
      </div>
    </article>
  );
};

export default Single;
