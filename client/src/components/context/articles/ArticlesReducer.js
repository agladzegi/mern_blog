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

export default (state, action) => {
  switch (action.type) {
    case GET_ARTICLES:
      return {
        ...state,
        articles: action.payload,
        loading: false,
      };
    case GET_USER_ARTICLES:
      return {
        ...state,
        userArticles: action.payload,
        loading: false,
      };
    case GET_SINGLE_ARTICLE:
      return {
        ...state,
        single: action.payload,
        loading: false,
      };
    case ADD_ARTICLE:
      return {
        ...state,
        articles: [action.payload, ...state.articles],
        userArticles: [action.payload, ...state.userArticles],
        loading: false,
      };
    case DELETE_ARTICLE:
      return {
        ...state,
        userArticles: state.userArticles.filter(
          (article) => article.slug !== action.payload
        ),
        loading: false,
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload,
        loading: false,
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null,
        loading: false,
      };
    case UPDATE_ARTICLE:
      return {
        ...state,
        userArticles: state.userArticles.map((article) =>
          article._id === action.payload._id ? action.payload : article
        ),
      };
    case ARTICLE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
