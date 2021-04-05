import React, { useState, useRef } from 'react';
import './style.scss';
import { ReactComponent as CardButton } from '../../../assets/cardButton.svg';
import CardMenu from '../CardMenu';
import CommentList from '../../CommentList';
import Profile from '../../Profile';
import moment from 'moment';
import dayjs from 'dayjs';
import ExploreCardMenu from '../../ExplorePostCardMenu';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { likePost, CommentPost } from '../../../api/posts.api'
import Loader from '../../Loader'
import { v4 as uuidv4 } from 'uuid';
import { useQueryClient, useMutation, useQuery } from 'react-query';


function Card(props) {
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = React.useState(undefined);

  const history = useHistory();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const currentUser = useSelector(({ user }) => user.currentUser)
  const {
    storyBorder,
    feed,
    image,
    comments,
    likedByText,
    likedByNumber,
    accountName,
    avatar,
    hours,
    invalidate
  } = props;

  // query client
  const queryClient = useQueryClient();

  const likeMutation = useMutation(() => likePost(feed._id), {

    onMutate: () => {

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryClient.cancelQueries('fetchfeeds')
      //  snapshot of the previous value 
      const previousFeeds = queryClient.getQueryData('fetchfeeds');

      // optimistically update the isLiked property 

      // return context object of snapshot value 
      return { previousFeeds }

    },

    onSuccess: (data) => {
      console.log(data)
      if (data === "like success") {
        setIsLiked(true)
      }
      if (data === "unlike success") {
        setIsLiked(false)
      }
      // invalidate()
    },

    onError: (err, variable, context) => {
      console.log(err)
      queryClient.setQueryData('fetchfeeds', context.previousFeeds)
    },
    onSettled: () => {
      queryClient.invalidateQueries('fetchfeeds')

    }

  });

  const commentPostMutation = useMutation(() => CommentPost(feed._id, commentText), {

    onSuccess: (data) => {

      queryClient.setQueryData('fetchfeeds', prev => {
        const post = prev.find(d => d._id === feed._id)
        if (post) {
          return prev.map(postItem => postItem._id === feed._id ? { ...postItem, comments: [...postItem.comments, data.newComment] } : postItem)
        }

      })

    },
    onSettled: (data, error, variables) => {
      // invalidate the query 
      queryClient.invalidateQueries('fetchfeeds');
    }

  })
  const likeFunc = async () => {
    try {
      await likeMutation.mutateAsync()
      // setIsLikedButtonClicked(true)
    } catch (error) {
      console.log(error);
    }
  };

  const commentPostFunc = async () => {

    try {
      await commentPostMutation.mutateAsync()

      // setIsLikedButtonClicked(true)
    } catch (error) {
      console.log(error);
    }
  }

  const focus = () => {
    inputRef.current.focus();
  };
  return (
    <div className="card">
      <header>
        <Profile
          iconSize="medium"
          image={avatar}
          authorUsername={feed.author.username}
          username={accountName}
          storyBorder={storyBorder}
        />
        <CardButton className="cardButton" />
      </header>
      <img className="cardImage" src={image} alt="card content" />
      {/*  <CardMenu /> */} <ExploreCardMenu setIsLiked={setIsLiked} isLiked={isLiked} focus={focus} likeFunc={likeFunc} userpost={feed} />
      <div className="likedBy">
        {/*  <Profile iconSize="small" hideAccountName={true} /> */}
        {/*  <span>
                    Liked by <strong>{likedByText}</strong> and{" "}
                    <strong>{likedByNumber} others</strong>
                </span> */}
        {!feed.likes || feed.likes.length < 1 ? (
          <span className="like-title">
            {' '}
            Be the first to <b>like this</b>
          </span>
        ) : (
          <span>{feed.likes.length} Likes</span>
        )}
      </div>
      <div className="comments">
        {comments &&
          comments.map((comment) => {
            return (
              <CommentList
                key={uuidv4()}
                commentId={comment._id}
                commentuser={comment._user}
                commentText={comment.commentText}
                userpost={feed}
                accountName={comment.username}
                comment={comment.commentText}
                commentImage={comment.avatar}
                commentTime={comment.commentDate}
              />
            );
          })}
      </div>
      <div className="timePosted">{moment(feed.date).fromNow()} </div>
      <form onSubmit={(event) => {
        event.preventDefault();
        commentPostFunc()

      }} className="addComment">
        <input
          ref={inputRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          type="text"
          placeholder="Add a comment..."
          className="commentText"
        />
        {commentPostMutation.isLoading && <Loader />}
        <button
          type="submit"
          disabled={commentText ? false : true}
          className="postText-btn"

        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Card;
