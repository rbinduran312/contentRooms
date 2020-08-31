import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import { getEventPosts } from '../../actions/post';

const EventPosts = ({getEventPosts, match , post: {posts}}) => {
  useEffect(() => {
    getEventPosts(match.params.id);

  }, [getEventPosts,match.params.id]);

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

getEventPosts.propTypes = {
  getEventPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getEventPosts }
)(EventPosts);
