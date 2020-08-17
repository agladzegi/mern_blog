import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ArticleListItem = ({ article }) => {
  return (
    <article className='article'>
      <Link className='article-link' to={`articles/${article.slug}`}>
        {article.title}
      </Link>
      <img
        src={`http://localhost:5000/static${article.image}`}
        alt={article.title}
      />
      <div className='article-meta'>
        <p>
          <strong>Published:</strong>{' '}
          {new Date(article.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Author:</strong> {article.author}
        </p>
      </div>
    </article>
  );
};

ArticleListItem.propTypes = {
  article: PropTypes.object.isRequired,
};

export default ArticleListItem;
