import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import { getRoomPosts } from '../../actions/post';

const RoomPosts = ({getRoomPosts, match , post: {posts}}) => {
  useEffect(() => {
    getRoomPosts(match.params.id);
    console.log(match.params.id);

  }, [getRoomPosts,match.params.id]);

  return (
    <Fragment>
      <div className='posts'>
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

getRoomPosts.propTypes = {
  getRoomPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getRoomPosts }
)(RoomPosts);
