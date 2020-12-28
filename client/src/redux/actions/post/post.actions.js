import { PostTypes } from '../../actions/post/post.types';
import axios from 'axios'
import setToken from '../../utils';

/**
 * @description getall posts
 */
export const getposts = () => {
    return async (dispatch) => {
        try {

            const res = await axios.get('/api/route/post/allposts');

            dispatch({ type: PostTypes.GET_POSTS, payload: res.data })
        } catch (err) {

            if (err) {
                dispatch({
                    type: PostTypes.POST_ERROR, payload: {
                        msg: err.response.statusText + " - GET_POSTS error - getPosts",
                        status: err.response.status
                    }
                })
            }
        }
    }
};

/**
 * @description Add Post
 */
export const createPost = (formData) => {
    return async (dispatch) => {


        try {
            const { authToken } = localStorage;
            if (authToken) {
                setToken(authToken);
            }
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const res = await axios.post('/api/route/post', config, formData);
            dispatch({ type: PostTypes.ADD_POST, payload: res.data });

        } catch (err) {
            if (err) {
                dispatch({
                    type: PostTypes.POST_ERROR,
                    payload: {
                        msg: err.response.statusText + " - ADD_POST error - addPost",
                        status: err.response.status,
                    },
                });
            }
        }
    }
};

/**
 * @description like a post 
 */

export const addLike = (id) => {
    return async (dispatch) => {
        try {
            const { authToken } = localStorage;
            if (authToken) {
                await setToken(authToken);
            };

            const res = await axios.put(`/api/route/post/like/:${id}`);
            dispatch({
                type: PostTypes.UPDATE_LIKES, payload: {
                    id, likes: res.data
                }
            })
        } catch (err) {
            if (err) {
                dispatch({
                    type: PostTypes.POST_ERROR,
                    payload: {
                        msg:
                            err.response.statusText +
                            " - UPDATE_LIKES error - addLike" +
                            " " +
                            (id && id),
                        status: err.response.status,
                    },
                })
            }
        }
    }
};

/**
 * @description remove like
 */

export const removeLike = (id) => {
    return async (dispatch) => {
        try {
            const { authToken } = localStorage;
            if (authToken) {
                await setToken(authToken);
            };
            const res = axios.put(`/api/route/post/unlike/:${id}`);
            dispatch({
                type: PostTypes.UPDATE_LIKES, payload: {
                    id, likes: res.data
                }
            });
        } catch (err) {
            if (err) {
                dispatch({
                    type: PostTypes.POST_ERROR,
                    payload: {
                        msg: err.response.statusText + " - UPDATE_LIKES error - removeLike",
                        status: err.response.status,
                    },
                });
            }
        }
    }
};

/**
 * @description Add comment
 */

export const addComment = (id, formData) => {
    return async (dispatch) => {
        const { authToken } = localStorage;
        if (authToken) {
            await setToken(authToken);
        };
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const res = await axios.put(`/api/route/post/comment/${id}`, formData, config);
            dispatch({ type: PostTypes.ADD_COMMENT, payload: res.data })

        } catch (err) {
            dispatch({
                type: PostTypes.POST_ERROR,
                payload: {
                    msg: err.response.statusText + " - ADD_COMMENT error - addComment",
                    status: err.response.status,
                },
            });
        }
    }
};

/**
 * @description Remove a comment
 */
export const deleteComment = (postId, commentId) => {
    return async (dispatch) => {
        const { authToken } = localStorage;
        if (authToken) {
            await setToken(authToken);
        };
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const res = await axios.delete(`/api/route/post/comment/${postId}/${commentId}}`, config);
            dispatch({ type: PostTypes.REMOVE_COMMENT, paylad: res.data })
        } catch (err) {

        }
    }
}

/**
 * @description Get User post
 */

export const myPost = () => {
    return async (dispatch) => {

    }
}
