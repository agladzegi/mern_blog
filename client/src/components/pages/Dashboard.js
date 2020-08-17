import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../context/auth/AuthContext';
import ArticlesContext from '../context/articles/ArticlesContext';

const Dashboard = (props) => {
  const authContext = useContext(AuthContext);
  const articlesContext = useContext(ArticlesContext);

  const {
    loading,
    error,
    userArticles,
    getUserArticles,
    deleteArticle,
    setCurrent,
    clearCurrent,
  } = articlesContext;

  useEffect(() => {
    authContext.loadUser();
    getUserArticles();
    // eslint-disable-next-line
  }, []);

  const onDelete = (slug) => {
    deleteArticle(slug);
    clearCurrent();
  };

  if (loading) {
    return <h1 className='text-center'>Loading...</h1>;
  }

  return (
    <div className='dashboard'>
      <h1 className='text-center text-primary'>
        Hello {authContext.user && authContext.user.name}
      </h1>

      <Link
        to='/dashboard/article'
        className='btn btn-primary text-center'
        style={{
          display: 'block',
          width: '30%',
          margin: '2rem auto',
        }}
      >
        Add Article
      </Link>
      {error && <h3>{error}</h3>}
      {userArticles.length > 0 ? (
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>Title</th>
              <th></th>
            </tr>
            {userArticles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>
                  <button
                    className='btn btn-dark btn-sm'
                    onClick={() => {
                      setCurrent(article);
                      props.history.push('/dashboard/article');
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-danger btn-sm'
                    onClick={() => onDelete(article.slug)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3>You have not written any articles yet, please add new one</h3>
      )}
    </div>
  );
};

export default Dashboard;
