import React from 'react';
// import axios from 'axios'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './style.scss';
import { getposts } from '../../redux/actions/post/post.actions'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import DisplayPosts from '../DisplayPosts/DisplayPosts';


const Feeds = (props) => {

    return (
        <div className="feedWrapper">

            {props.loading ? (

                <div style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                    <Loader
                        type="TailSpin"
                        color="#00BFFF"
                        height={80}
                        width={80}

                    />

                </div>
            ) :

                <DisplayPosts />}
        </div>


    )

}

const mapDispatchToprops = {
    getposts
};
const mapstateToProps = ({ post, user }) => {
    return {

        loading: post.loading,
        currentUser: user.currentUser
    }
}

export default connect(mapstateToProps, mapDispatchToprops)(withRouter(Feeds));