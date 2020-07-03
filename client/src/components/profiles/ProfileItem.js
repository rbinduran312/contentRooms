import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location
  },
  addFriend,
  isFriend
}) => {
  return (
    <div className='profile bg-light'>
      <img src={avatar} alt='' className='round-img' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
        {!isFriend && <Link to='' className='btn btn-primary' onClick={(e) => addFriend(e, _id, name)}>Add as friend</Link>}
      </div>
    </div >
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
