import React, { useReducer } from 'react';
import axios from 'axios';
import ArticlesContext from './ArticlesContext';
import ArticlesReducer from './ArticlesReducer';
import { GET_ARTICLES } from '../types';

const ArticlesState = (props) => {
  const initialState = {
    articles: null,
    loading: true,
    errors: null,
  };

  const [state, dispatch] = useReducer(ArticlesReducer, initialState);

  // Get all articles
  const getArticles = async () => {
    const res = await axios.get('http://localhost:5000/api/articles');

    dispatch({
      type: GET_ARTICLES,
      payload: res.data,
    });
  };

  return (
    <ArticlesContext.Provider
      value={{
        articles: state.articles,
        loading: state.loading,
        errors: state.errors,
        getArticles,
      }}
    >
      {props.children}
    </ArticlesContext.Provider>
  );
};

export default ArticlesState;
