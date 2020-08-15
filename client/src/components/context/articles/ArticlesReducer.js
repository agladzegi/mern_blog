import { GET_ARTICLES } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_ARTICLES:
      return {
        ...state,
        articles: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
