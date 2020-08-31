import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const EventAbout = ({
  event: {
    bio,
    name
  }
}) => (
  <div className='profile-about bg-light p-2'>
    {bio && (
      <Fragment>
        <h2 className='text-primary'>{name.trim().split(' ')[0]}s Bio</h2>
        <p>{bio}</p>
        <div className='line' />
      </Fragment>
    )}
  </div>
);

EventAbout.propTypes = {
  event: PropTypes.object.isRequired
};

export default EventAbout;
