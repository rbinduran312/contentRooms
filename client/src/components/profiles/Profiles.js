import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles, addAsFriend } from '../../actions/profile';

const Profiles = ({ getProfiles, addAsFriend, profile: { profiles, loading }, user }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const addFriend = (e, friendId, friendName) => {
    e.preventDefault();
    addAsFriend(user._id, friendId, friendName);
  }

  const checkIfFriend = (friends) => {
    return friends && friends.length && friends.some(id => id === user._id);
  }

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
          <Fragment>
            <h1 className='large text-primary'>Developers</h1>
            <p className='lead'>
              <i className='fab fa-connectdevelop' /> Browse and connect with
            developers
          </p>
            <div className='profiles'>
              {profiles.length > 0 ? (
                profiles.map(profile => (
                  <ProfileItem key={profile._id} profile={profile} addFriend={addFriend} isFriend={checkIfFriend(profile.friends)} />
                ))
              ) : (
                  <h4>No profiles found...</h4>
                )}
            </div>
          </Fragment>
        )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  addAsFriend: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { getProfiles, addAsFriend }
)(Profiles);
