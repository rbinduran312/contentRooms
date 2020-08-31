import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import RoomTop from './RoomTop';
import RoomAbout from './RoomAbout';
import { getRoomById } from '../../actions/room';
import RoomPosts from '../posts/RoomPosts';

//import RoomPosts from '../posts/RoomPosts';
//import RoomDrafts from '../drafts/RoomDrafts';


const Room = ({
  getRoomById,
  room: { room, loading },
  auth,
  match
}) => {
  useEffect(() => {
    getRoomById(match.params.id);
  }, [getRoomById, match.params.id]);

  return (
    <Fragment>
      {room === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/rooms' className='btn btn-light'>
            Back To Rooms
          </Link>
          {/* {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === room.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Room
              </Link>
            )} */}
          <div className='profile-grid my-1'>
            <RoomTop room={room} />
            <RoomAbout room={room} />
            {auth.isAuthenticated &&
            auth.loading === false && (
              <RoomPosts match = {match}/>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Room.propTypes = {
  getRoomById: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  room: state.room,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getRoomById }
)(Room);
