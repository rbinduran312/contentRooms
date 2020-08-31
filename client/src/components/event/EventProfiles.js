import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


const EventProfiles = ({
  creator: {name, avatar,user, date}
}) => (
    <div>
        <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt='' />
        </Link>
        <h4>{name}</h4>
    </div>
);

EventProfiles.propTypes = {
  creator: PropTypes.object.isRequired
};

export default EventProfiles;
