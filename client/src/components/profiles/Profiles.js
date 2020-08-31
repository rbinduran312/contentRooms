import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import {
	getProfiles,
	addAsFriend,
	getFriendRequestList,
	acceptFriendRequest,
	rejectFriendRequest,
	getCurrentProfile,
} from '../../actions/profile';

const Profiles = ({
	getProfiles,
	addAsFriend,
	profile: { profiles, loading, friendRequests, profile },
	user,
	getFriendRequestList,
	acceptFriendRequest,
	rejectFriendRequest,
	getCurrentProfile,
}) => {
	useEffect(() => {
		getProfiles();
	}, [getProfiles]);

	useEffect(() => {
		getFriendRequestList();
	}, [getFriendRequestList]);

	useEffect(() => {
		getCurrentProfile();
	}, [getCurrentProfile]);

	const addFriend = (e, friendId, friendName) => {
		e.preventDefault();
		addAsFriend(user._id, friendId, friendName);
	};

	const checkFriendStatus = (userId) => {
		if (
			profile.user &&
			profile.user.friends &&
			profile.user.friends.length &&
			profile.user.friends.some((id) => id === userId)
		) {
			var status = 'friend';
		} else if (
			profile.user &&
			profile.user.friendRequestSent &&
			profile.user.friendRequestSent.length &&
			profile.user.friendRequestSent.some((id) => id === userId)
		) {
			status = 'requestSent';
		} else if (
			friendRequests &&
			friendRequests.length &&
			friendRequests.some((request) => request._id === userId)
		) {
			status = 'requestReceived';
		} else {
			status = '';
		}

		return status;
	};

	const acceptRequest = (userId, e) => {
		e.preventDefault();
		acceptFriendRequest(userId);
	};

	const rejectRequest = (userId, e) => {
		e.preventDefault();
		rejectFriendRequest(userId);
	};

	return (
		<Fragment>
			{loading || !profile ? (
				<Spinner />
			) : (
				<Fragment>
					<h1 className='large text-primary'>Creators</h1>
					<p className='lead'>
						<i className='fab fa-connectdevelop' /> Browse and connect with
						creators
					</p>
					<div className='profiles'>
						{profiles.length > 0 ? (
							profiles.map((profile) => (
								<ProfileItem
									key={profile._id}
									profile={profile}
									addFriend={addFriend}
									friendStatus={checkFriendStatus(profile.user._id)}
									acceptFriendRequest={acceptRequest}
									rejectFriendRequest={rejectRequest}
								/>
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
	profile: PropTypes.object.isRequired,
	getFriendRequestList: PropTypes.func.isRequired,
	acceptFriendRequest: PropTypes.func.isRequired,
	rejectFriendRequest: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	user: state.auth.user,
});

export default connect(mapStateToProps, {
	getProfiles,
	addAsFriend,
	getFriendRequestList,
	acceptFriendRequest,
	rejectFriendRequest,
	getCurrentProfile,
})(Profiles);
