import React from 'react';
import './style.scss';
import ProfileIcon from '../ProfileIcon';
import moment from 'moment';
import * as Icon from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';

import { useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { deleteComment } from '../../api/posts.api'
import { ReactComponent as LoaderSvg } from '../../assets/loader.svg';
import Loader from 'react-loader-spinner';
import * as Routes from '../routes'

moment.relativeTimeThreshold('d', 30 * 12);
moment.updateLocale('en', {
  relativeTime: {
    dd: '%dd',
  },
});

const CommentList = ({
  accountName,
  commentuser,
  commentImage,
  commentText,
  commentId,
  commentTime,
  comment,
  userpost,
  feed
}) => {
  const userData = useSelector(({ user }) => user.currentUser);
  const dispatch = useDispatch();


  const {
    history,
    location: { pathname },
  } = useHistory();
  // console.log(pathname)
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(() => deleteComment(userpost._id, commentId), {

    onSuccess: (data) => {

      queryClient.setQueryData('feedsData', prev => ({
        ...prev,
        pages: prev.pages.map(page => ({
          ...page,
          posts: page.posts.map(post => post._id === userpost._id ? {
            ...post,
            comments: post.comments.filter(d => d._id !== commentId)
          } : post)
        }))
      }))

      queryClient.invalidateQueries(['fetchsinglePost', `${userpost._id}`]);
      queryClient.invalidateQueries('fetchfeeds')


    }

  })

  const deleteCommentFunc = async () => {
    await mutateAsync();
  }
  return (
    <React.Fragment>
      <div className="commentContainer">
        {commentImage && (
          <div className="profile-icon">
            {/*   <img
              style={{ cursor: "pointer" }}
              src={commentImage ? commentImage : require('../../assets/default-avatar.png')}
              alt="image"
              aria-label="poster-iamge"
            // onClick={() => history.push(Routes.ProfilePage + `/${accountName}`)}
            /> */}
            <ProfileIcon image={commentImage} authorUsername={accountName} iconSize={"small"} />
          </div>
        )}
        <div className="accountName">{accountName}</div>
        <div className="comment">{commentText}</div>

        {userData && commentuser == userData._id && (
          <span onClick={deleteCommentFunc} className="deletebtn">
            {isLoading ?
              <Loader
                type="Oval"
                color="black"
                height={10}
                width={30}
              />
              :
              <Icon.Trash2 size={13} />}
          </span>
        )}
      </div>

      {/* <h3 className="comment-time"> {moment(commentTime).fromNow(true)}</h3> */}
    </React.Fragment>
  );
};

export default CommentList;
