import React, { useContext, useEffect } from 'react';
import ArticlesContext from '../context/articles/ArticlesContext';

import ArticleListItem from './ArticleListItem';

const ArticleList = () => {
  const articleContext = useContext(ArticlesContext);

  const { articles, loading, getArticles, error } = articleContext;

  useEffect(() => {
    getArticles();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <h3>Loding...</h3>;
  }

  if (error) {
    return <h3>{error}</h3>;
  }

  return articles.length > 0 ? (
    articles.map((article) => (
      <ArticleListItem article={article} key={article._id} />
    ))
  ) : (
    <h3>There are no articles, please add one</h3>
  );
};

export default ArticleList;
