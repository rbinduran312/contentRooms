import React, { Fragment } from 'react';
import ReactJWPlayer from 'react-jw-player';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const m3u8Config = {
  file: ''
}

const drmConfig = {
  default: false,
  type: 'mpd',
  file: '',
  drm: {
    widevine: {
      url: 'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=BBA049',
    }
  },
  label: 0
}

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date, room },
  showActions,
}) => {
  const type = text.split('.').pop();
  const playlist = [];
  playlist[0] = type === 'm3u8' ? m3u8Config : drmConfig;
  playlist[0].file = text;
  return (
    <div className='bg-white my-1'>
      <div className='video-wrapper'>
        <ReactJWPlayer
          playerId={_id}
          playerScript='https://cdn.jwplayer.com/libraries/EAro1zer.js'
          playlist={playlist}
        />
      </div>
      <div className='post  p-1 my-1'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt='' />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{text}</p>
          <p className='post-date'>
            Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
          </p>

          {showActions && (
            <Fragment>
              <button
                onClick={() => addLike(_id)}
                type='button'
                className='btn btn-light'
              >
                <i className='fas fa-thumbs-up' />{' '}
                <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
              </button>
              <button
                onClick={() => removeLike(_id)}
                type='button'
                className='btn btn-light'
              >
                <i className='fas fa-thumbs-down' />
              </button>
              <Link to={`/posts/${_id}`} className='btn btn-primary'>
                Discussion{' '}
                {comments.length > 0 && (
                  <span className='comment-count'>{comments.length}</span>
                )}
              </Link>
              {!auth.loading && user === auth.user._id && (
                <button
                  onClick={() => deletePost(_id)}
                  type='button'
                  className='btn btn-danger'
                >
                  <i className='fas fa-times' />
                </button>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  )
};



PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addLike, removeLike, deletePost }
)(PostItem);
