import React, { useReducer } from 'react';
import axios from 'axios';
import ArticlesContext from './ArticlesContext';
import ArticlesReducer from './ArticlesReducer';
import {
  GET_ARTICLES,
  ADD_ARTICLE,
  ARTICLE_ERROR,
  GET_USER_ARTICLES,
  DELETE_ARTICLE,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_ARTICLE,
  GET_SINGLE_ARTICLE,
} from '../types';

const ArticlesState = (props) => {
  const initialState = {
    articles: [],
    userArticles: [],
    single: [],
    current: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(ArticlesReducer, initialState);

  // Get all articles
  const getArticles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/articles');

      dispatch({
        type: GET_ARTICLES,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: ARTICLE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Get all user articles
  const getUserArticles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/articles/user');

      dispatch({
        type: GET_USER_ARTICLES,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: ARTICLE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  const getSingleArticle = async (slug) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/articles/article/${slug}`
      );

      dispatch({
        type: GET_SINGLE_ARTICLE,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: ARTICLE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Add Article
  const addArticle = async (article) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/articles',
        article
      );

      dispatch({
        type: ADD_ARTICLE,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: ARTICLE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Set Current
  const setCurrent = (article) => {
    dispatch({
      type: SET_CURRENT,
      payload: article,
    });
  };

  // Clear Current
  const clearCurrent = () => {
    dispatch({
      type: CLEAR_CURRENT,
    });
  };

  // Update Article
  const updateArticle = async (article) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/articles/${article.get('id')}`,
        article
      );

      dispatch({
        type: UPDATE_ARTICLE,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: ARTICLE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Delete Article
  const deleteArticle = async (slug) => {
    try {
      await axios.delete(`http://localhost:5000/api/articles/${slug}`);

      dispatch({
        type: DELETE_ARTICLE,
        payload: slug,
      });
    } catch (err) {
      dispatch({
        type: ARTICLE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  return (
    <ArticlesContext.Provider
      value={{
        articles: state.articles,
        userArticles: state.userArticles,
        single: state.single,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getArticles,
        getUserArticles,
        getSingleArticle,
        addArticle,
        setCurrent,
        clearCurrent,
        updateArticle,
        deleteArticle,
      }}
    >
      {props.children}
    </ArticlesContext.Provider>
  );
};

export default ArticlesState;
