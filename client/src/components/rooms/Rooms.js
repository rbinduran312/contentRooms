import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import RoomItem from './RoomItem';
import { getRooms} from '../../actions/room';

const Rooms = ({ getRooms, room: { rooms, loading }, user }) => {
  useEffect(() => {
    getRooms();
  }, [getRooms]);


  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
          <Fragment>
            <h1 className='large text-primary'>Rooms</h1>
            <p className='lead'>
              <i className='fab fa-connectdevelop' /> Browse Content Rooms
          </p>
            <div className='profiles'>
              {rooms.length > 0 ? (
                rooms.map(room => (
                  <RoomItem key={room._id} room={room}  />
                ))
              ) : (
                  <h4>No rooms found...</h4>
                )}
            </div>
          </Fragment>
        )}
    </Fragment>
  );
};

Rooms.propTypes = {
  getRooms: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  room: state.room,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { getRooms}
)(Rooms);
