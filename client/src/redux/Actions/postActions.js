import * as postActionTypes from '../Constants/postConstants';
import { setToken } from '../../utils';

import axios from 'axios';
import cogoToast from 'cogo-toast';
import * as Routes from '../../component/routes';

const token = localStorage.getItem('authToken');
const baseUrl = process.env.REACT_APP_BASE_URL
// @create post

export const createPostFunc = (data, history) => {
  const token = localStorage.getItem('authToken');
  return async (dispatch) => {
    try {
      if (token) {
        await setToken(token);
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      cogoToast.loading('posting');
      const response = await axios.post(`${baseUrl}/api/route/post/createPost`, data, config);
      if (response) {
        await dispatch({ type: postActionTypes.CREATE_POST_SUCCESS, payload: response.data.msg });
        cogoToast.success('post created');
      }
    } catch (error) {
      if (error.response) {
        cogoToast.error(`${error.response.data.msg}`);
        await dispatch({ type: postActionTypes.CREATE_POST_FAIL, payload: error.response.data });
        if (
          error.response.data.msg === 'jwt expired' ||
          error.response.data.msg === `you're not authorised`
        ) {
          history.push('/');
          localStorage.removeItem('authToken');
          cogoToast.info('session expired');
        }
      }
    }
  };
};

//  load explore posts
export const getPosts = (history) => {
  return async (dispatch) => {
    const token = localStorage.getItem('authToken');
    try {
      if (token) {
        await setToken(token);
      }

      const response = await axios.get(`${baseUrl}/api/route/post/retrieveExplorePost`);
      if (response) {
        dispatch({ type: postActionTypes.GET_POSTS_SUCCESS, payload: response.data.posts });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        await dispatch({ type: postActionTypes.GET_POSTS_FAIL, payload: error.response.data });
        if (
          error.response.data.msg === 'jwt expired' ||
          error.response.data.msg === `you're not authorised`
        ) {
          localStorage.removeItem('authToken');
          history.push('/');
        }
        // cogoToast.error(`${error.response.data.msg}`, { position: "top-right" })
      }
    }
  };
};

//  @comment on a post with a given post id passed as a param to the url
export const commentPost = (postId, commentText, socket, history) => {
  return async (dispatch) => {
    if (token) {
      await setToken(token);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(`${baseUrl}/api/route/post/comment/${postId}`, { commentText });
      if (response) {
        dispatch({ type: postActionTypes.COMMENT_POST_SUCCESS, payload: response.data.data });
        console.log(response.data.data);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        await dispatch({
          type: postActionTypes.COMMENT_POST_FAIL,
          payload: error.response.data.msg,
        });
        if (
          error.response.data.msg === 'jwt expired' ||
          error.response.data.msg === `you're not authorised`
        ) {
          localStorage.removeItem('authToken');
          history.push('/');
        }
        // cogoToast.error(`${error.response.data.msg}`, { position: "top-right" })
      }
    }
  };
};

// @delete a commment

export const deleteComment = (postid, commentid, history) => async (dispatch) => {
  try {
    if (token) {
      await setToken(token);
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put(
      `${baseUrl}/api/route/post/deleteComment/${postid}/${commentid}`,
      config,
    );
    if (response) {
      dispatch({ type: postActionTypes.DELETE_COMMENT_SUCCESS, payload: response.data.data });
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      await dispatch({
        type: postActionTypes.DELETE_COMMENT_FAIL,
        payload: error.response.data.msg,
      });
      if (
        error.response.data.msg === 'jwt expired' ||
        error.response.data.msg === `you're not authorised`
      ) {
        localStorage.removeItem('authToken');
        history.push('/');
      }
    }
  }
};

export const getSinglePost = (postId, history) => {
  return async (dispatch) => {
    if (token) {
      await setToken(token);
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.get(`${baseUrl}/api/route/post/singlePost/${postId}`, config);
      if (response) {
        dispatch({ type: postActionTypes.GET_SINGLE_POST_SUCCESS, payload: response.data.post[0] });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        await dispatch({
          type: postActionTypes.GET_SINGLE_POST_FAIL,
          payload: error.response.data.msg,
        });
        if (
          error.response.data.msg === 'jwt expired' ||
          error.response.data.msg === `you're not authorised`
        ) {
          localStorage.removeItem('authToken');
          history.push('/');
        }
      }
    }
  };
};

//  like & unlike  a post

export const likePost = (postId, socket, history) => {
  return async (dispatch) => {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (token) {
      await setToken(token);
    }
    try {
      const response = await axios.put(`${baseUrl}/api/route/post/likePost/${postId}`, config);
      if (response) {
        dispatch({ type: postActionTypes.LIKE_POST_SUCCESS, payload: response.data.data });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        await dispatch({ type: postActionTypes.LIKE_POST_FAIL, payload: error.response.data.msg });
        cogoToast.info(`${error.response.data.msg}`, { position: 'top-center' });
        if (
          error.response.data.msg === 'jwt expired' ||
          error.response.data.msg === `you're not authorised`
        ) {
          localStorage.removeItem('authToken');
          history.push('/');
        }
      }
    }
  };
};

//  load feed posts

export const retrieveFeedPosts = (history) => async (dispatch) => {
  const token = localStorage.getItem('authToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    await setToken(token);
  }
  try {
    const response = await axios.get(`${baseUrl}api/route/post/retrieveFeedPosts`, config);
    if (response) {
      console.log(response.data);
      dispatch({ type: postActionTypes.GET_FEEDS_SUCCESS, payload: response.data.posts });
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      await dispatch({ type: postActionTypes.GET_FEEDS_FAIL, payload: error.response.data.msg });
      cogoToast.info(`${error.response.data.msg}`, { position: 'top-center' });
      if (
        error.response.data.msg === 'jwt expired' ||
        error.response.data.msg === `you're not authorised`
      ) {
        history.push('/');
        localStorage.removeItem('authToken');
      }
    }
  }
};
