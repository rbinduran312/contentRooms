import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import {
	getCurrentProfile,
	deleteAccount,
	getFriendRequestList,
	acceptFriendRequest,
	rejectFriendRequest,
} from '../../actions/profile';
import { logout } from '../../actions/auth';
import ProfileDrafts from '../drafts/ProfileDrafts';
import FriendRequests from './FriendRequests';
import Spinner from '../layout/Spinner';

const Dashboard = ({
	getCurrentProfile,
	deleteAccount,
	auth: { user },
	profile: { profile, friendRequests, respondRequestLoading },
	logout,
	getFriendRequestList,
	acceptFriendRequest,
	rejectFriendRequest,
}) => {
	useEffect(() => {
		getCurrentProfile();
	}, [getCurrentProfile]);

	useEffect(() => {
		getFriendRequestList();
	}, [getFriendRequestList]);

	const acceptRequest = (userId) => {
		acceptFriendRequest(userId);
	};

	const rejectRequest = (userId) => {
		rejectFriendRequest(userId);
	};

	return (
		<Fragment>
			<h1 className='large text-primary'>Dashboard</h1>
			<p className='lead'>
				<i className='fas fa-user' /> Welcome {user && user.name}
			</p>
			<Fragment>
				<DashboardActions />
				{profile && !respondRequestLoading ? (
					<FriendRequests
						friendRequests={friendRequests}
						acceptFriendRequest={acceptRequest}
						rejectFriendRequest={rejectRequest}
					/>
				) : (
					<Spinner />
				)}
				<div className='my-2'>
					<button className='btn btn-danger' onClick={() => deleteAccount()}>
						<i className='fas fa-user-minus' /> Delete My Account
					</button>
				</div>
				<div>
					<a onClick={logout} href='#!'>
						<i className='fas fa-sign-out-alt' />{' '}
						<span className='hide-sm'>Logout</span>
					</a>
				</div>
				<Link to={`/profile/${user._id}`}>
					<i className='fas fa-user-circle text-primary' /> My Profile
				</Link>

				{user.creator === true && (
					<Link to={'/create'}>
						<i className='fas fa-user-circle text-primary' /> Create
					</Link>
				)}

				{user.creator === true && <ProfileDrafts user={user} />}
			</Fragment>
		</Fragment>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
	getFriendRequestList: PropTypes.func.isRequired,
	friendRequests: PropTypes.func.isRequired,
	acceptFriendRequest: PropTypes.func.isRequired,
	rejectFriendRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile,
});

export default connect(mapStateToProps, {
	getCurrentProfile,
	deleteAccount,
	logout,
	getFriendRequestList,
	acceptFriendRequest,
	rejectFriendRequest,
})(Dashboard);
