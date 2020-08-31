import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const EventItem = ({
  event: {
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
        <Link to={`/event/${_id}`} className='btn btn-primary'>
          View Event
        </Link>
      </div>
    </div >
  );
};

EventItem.propTypes = {
  event: PropTypes.object.isRequired
};

export default EventItem;
