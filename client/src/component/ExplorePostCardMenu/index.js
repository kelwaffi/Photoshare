
import React from 'react';
import './style.scss';
import * as Icon from 'react-feather'

import { connect } from 'react-redux';

const ExploreCardMenu = ({ focus, likeFunc, unlikeFunc, userpost, user }) => {

    const isLiked = userpost.likes.some((like) => {
        return like._user == user._id
    })

    return (
        <div className="cardMenu">
            <div className="interactions">

                <Icon.Heart
                    className="icon" onClick={likeFunc} fill={isLiked ? 'tomato' : 'transparent'} />
                {/*   <Icon.ThumbsDown className="icon" onClick={unlikeFunc} /> */}
                <Icon.MessageCircle className="icon" onClick={focus} />
                <Icon.Share className="icon" />
            </div>
            <Icon.Bookmark className="icon" />
        </div>
    )
}

function mapStateToProps({ user }) {
    return {
        user: user.currentUser
    };
}
export default connect(mapStateToProps, null)(ExploreCardMenu);