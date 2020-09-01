import {
	GET_PROFILE,
	PROFILE_ERROR,
	CLEAR_PROFILE,
	UPDATE_PROFILE,
	GET_PROFILES,
	ADD_FRIEND,
	ADD_FRIEND_SUCCESS,
	ADD_FRIEND_FAIL,
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
} from '../actions/types';

const initialState = {
	profile: null,
	profiles: [],
	friendRequests: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_PROFILE:
		case UPDATE_PROFILE:
			return {
				...state,
				profile: { ...state.profile, ...payload },
				loading: false,
			};
		case GET_PROFILES:
			return {
				...state,
				profiles: payload,
				loading: false,
			};
		case PROFILE_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
				profile: null,
			};
		case CLEAR_PROFILE:
			return {
				...state,
				profile: null,
			};
		case ADD_FRIEND:
			return {
				...state,
				loading: true,
			};
		case ADD_FRIEND_SUCCESS:
			var newProfile = { ...state.profile };
			newProfile.user.friendRequestSent.push(payload);
			return {
				...state,
				profile: newProfile,
				loading: false,
			};
		case ADD_FRIEND_FAIL:
			return {
				...state,
				loading: false,
				error: payload,
			};
		case GET_FRIEND_REQUESTS:
			return {
				...state,
				loading: true,
			};
		case GET_FRIEND_REQUESTS_SUCCESS:
			return {
				...state,
				loading: false,
				friendRequests: payload,
			};
		case GET_FRIEND_REQUESTS_FAIL:
			return {
				...state,
				loading: false,
				error: payload,
			};
		case ACCEPT_FRIEND_REQUEST:
			return {
				...state,
				respondRequestLoading: true,
			};
		case ACCEPT_FRIEND_REQUEST_SUCCESS:
			var newFriendRequests = [...state.friendRequests];
			newFriendRequests.splice(newFriendRequests.indexOf(payload, 1));
			var newProfile = { ...state.profile };
			newProfile.user.friends.push(payload);
			return {
				...state,
				profile: newProfile,
				friendRequests: newFriendRequests,
				respondRequestLoading: false,
			};
		case ACCEPT_FRIEND_REQUEST_FAIL:
			var newFriendRequests = [...state.friendRequests];
			newFriendRequests.splice(newFriendRequests.indexOf(payload, 1));

			return {
				...state,
				friendRequests: newFriendRequests,
				respondRequestLoading: false,
				error: payload,
			};
		case REJECT_FRIEND_REQUEST:
			return {
				...state,
				respondRequestLoading: true,
			};
		case REJECT_FRIEND_REQUEST_SUCCESS:
			var newFriendRequests = [...state.friendRequests];
			newFriendRequests.splice(newFriendRequests.indexOf(payload, 1));

			return {
				...state,
				friendRequests: newFriendRequests,
				respondRequestLoading: false,
			};
		case REJECT_FRIEND_REQUEST_FAIL:
			var newFriendRequests = [...state.friendRequests];
			newFriendRequests.splice(newFriendRequests.indexOf(payload, 1));

			return {
				...state,
				friendRequests: newFriendRequests,
				respondRequestLoading: false,
				error: payload,
			};
		case GET_USER_PROFILE:
			return {
				...state,
				profile: { ...state.profile, otherUser: payload },
				loading: false,
			};

		default:
			return state;
	}
}
