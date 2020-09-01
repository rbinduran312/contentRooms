import api from '../utils/api';
import { setAlert } from './alert';

import {
	GET_PROFILE,
	GET_PROFILES,
	PROFILE_ERROR,
	UPDATE_PROFILE,
	CLEAR_PROFILE,
	ACCOUNT_DELETED,
	ADD_FRIEND,
	ADD_FRIEND_FAIL,
	ADD_FRIEND_SUCCESS,
	GET_FRIEND_REQUESTS,
	GET_FRIEND_REQUESTS_SUCCESS,
	GET_FRIEND_REQUESTS_FAIL,
	ACCEPT_FRIEND_REQUEST,
	ACCEPT_FRIEND_REQUEST_SUCCESS,
	ACCEPT_FRIEND_REQUEST_FAIL,
	REJECT_FRIEND_REQUEST,
	REJECT_FRIEND_REQUEST_SUCCESS,
	REJECT_FRIEND_REQUEST_FAIL,
	GET_USER_PROFILE,
} from './types';

// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await api.get('/profile/me');

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
	dispatch({ type: CLEAR_PROFILE });

	try {
		const res = await api.get('/profile');

		dispatch({
			type: GET_PROFILES,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
	try {
		const res = await api.get(`/profile/user/${userId}`);

		dispatch({
			type: GET_USER_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Create or update profile
export const createProfile = (formData, history, edit = false) => async (
	dispatch
) => {
	try {
		const res = await api.post('/profile', formData);

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

		if (!edit) {
			history.push('/dashboard');
		}
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
	if (window.confirm('Are you sure? This can NOT be undone!')) {
		try {
			await api.delete('/profile');

			dispatch({ type: CLEAR_PROFILE });
			dispatch({ type: ACCOUNT_DELETED });

			dispatch(setAlert('Your account has been permanently deleted'));
		} catch (err) {
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status },
			});
		}
	}
};

// Add as a Friend
export const addAsFriend = (myId, friendId, friendName) => async (dispatch) => {
	try {
		await api.post('/users/add-friend', { userId: friendId });

		dispatch({ type: ADD_FRIEND_SUCCESS, payload: friendId });
		// dispatch(getProfiles());
	} catch (err) {
		console.log(err);
		dispatch({
			type: ADD_FRIEND_FAIL,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

export const getFriendRequestList = () => async (dispatch) => {
	try {
		dispatch({
			type: GET_FRIEND_REQUESTS,
		});

		const response = await api.get('/users/friend-request-list');

		dispatch({
			type: GET_FRIEND_REQUESTS_SUCCESS,
			payload: response.data.users,
		});
	} catch (err) {
		dispatch({
			type: GET_FRIEND_REQUESTS_FAIL,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

export const acceptFriendRequest = (userId) => async (dispatch) => {
	try {
		dispatch({
			type: ACCEPT_FRIEND_REQUEST,
		});

		await api.post('/users/accept-friend-request', { userId });

		dispatch({
			type: ACCEPT_FRIEND_REQUEST_SUCCESS,
			payload: userId,
		});
		// dispatch(getFriendRequestList());
	} catch (err) {
		dispatch({
			type: ACCEPT_FRIEND_REQUEST_FAIL,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

export const rejectFriendRequest = (userId) => async (dispatch) => {
	console.log('here');
	try {
		dispatch({
			type: REJECT_FRIEND_REQUEST,
		});

		await api.post('/users/reject-friend', { userId });

		dispatch({
			type: REJECT_FRIEND_REQUEST_SUCCESS,
			payload: userId,
		});
		// dispatch(getFriendRequestList());
	} catch (err) {
		dispatch({
			type: REJECT_FRIEND_REQUEST_FAIL,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};
