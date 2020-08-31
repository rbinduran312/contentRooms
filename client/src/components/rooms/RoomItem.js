import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const RoomItem = ({
  room: {
    // user: { _id, name, avatar },
    name,
    avatar,
    status,
    location,
    _id
  }
}) => {
  return (
    <div className='profile bg-light'>
      <img src={avatar} alt='' className='round-img' />
      <div>
        <h2>{name}</h2>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/room/${name}`} className='btn btn-primary'>
          View Room
        </Link>
      </div>
    </div >
  );
};

RoomItem.propTypes = {
  room: PropTypes.object.isRequired
};

export default RoomItem;
