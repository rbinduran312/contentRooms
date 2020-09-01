import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import {
	getProfileById,
	addAsFriend,
	acceptFriendRequest,
	rejectFriendRequest,
	getCurrentProfile,
	getFriendRequestList,
} from '../../actions/profile';
import ProfilePosts from '../posts/ProfilePosts';
import ProfileDrafts from '../drafts/ProfileDrafts';

const Profile = ({
	getProfileById,
	profile: { profile, loading, friendRequests },
	auth,
	match,
	addAsFriend,
	acceptFriendRequest,
	rejectFriendRequest,
	getCurrentProfile,
	getFriendRequestList,
}) => {
	useEffect(() => {
		getProfileById(match.params.id);
	}, [getProfileById, match.params.id]);

	useEffect(() => {
		getFriendRequestList();
	}, [getFriendRequestList]);

	useEffect(() => {
		getCurrentProfile();
	}, [getCurrentProfile]);

	const addFriend = (e, friendId, friendName) => {
		e.preventDefault();
		addAsFriend(auth.user._id, friendId, friendName);
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
		console.log('status======>', status);
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
			{profile === null || loading || !profile.otherUser ? (
				<Spinner />
			) : (
				<Fragment>
					<Link to='/profiles' className='btn btn-light'>
						Back To Profiles
					</Link>
					{auth.isAuthenticated &&
						auth.loading === false &&
						auth.user._id === profile.otherUser.user._id && (
							<Link to='/edit-profile' className='btn btn-dark'>
								Edit Profile
							</Link>
						)}
					<div className='profile-grid my-1'>
						<ProfileTop
							profile={profile}
							addFriend={addFriend}
							friendStatus={checkFriendStatus(profile.otherUser.user._id)}
							acceptFriendRequest={acceptRequest}
							rejectFriendRequest={rejectRequest}
						/>
						<ProfileAbout profile={profile} />
						{/* {auth.isAuthenticated &&
            auth.loading === false && (
              <ProfilePosts match = {match}/>
            )} */}
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	getFriendRequestList: PropTypes.func.isRequired,
	acceptFriendRequest: PropTypes.func.isRequired,
	rejectFriendRequest: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	addAsFriend: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, {
	getProfileById,
	addAsFriend,
	acceptFriendRequest,
	rejectFriendRequest,
	getCurrentProfile,
	getFriendRequestList,
})(Profile);
