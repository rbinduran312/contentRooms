import {
	GET_EVENT,
	GET_EVENTS,
	EVENT_ERROR,
	UPDATE_EVENT,
	CLEAR_EVENT,
	BUY_EVENT,
	GET_VENUE,
	GET_VENUE_SUCCESS,
	GET_VENUE_FAILED,
	POST_PAYMENT,
	POST_PAYMENT_SUCCESS,
	POST_PAYMENT_FAILED,
} from '../actions/types';

const initialState = {
	event: null,
	events: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_EVENT:
		case UPDATE_EVENT:
			return {
				...state,
				event: payload,
				venue: null,
				loading: false,
			};
		case GET_EVENTS:
			return {
				...state,
				events: payload,
				loading: false,
			};
		case EVENT_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
				event: null,
			};
		case CLEAR_EVENT:
			return {
				...state,
				event: null,
			};
		case BUY_EVENT:
			return {
				state,
			};
		case GET_VENUE:
			return {
				...state,
				loading: true,
				venue: null,
				error: null,
			};
		case GET_VENUE_SUCCESS:
			return {
				...state,
				loading: false,
				venue: payload,
				error: null,
			};
		case GET_VENUE_FAILED:
			return {
				...state,
				loading: false,
				venue: null,
				error: payload,
			};
		case POST_PAYMENT:
			return {
				...state,
				loading: true,
			};
		case POST_PAYMENT_SUCCESS:
			return {
				...state,
				loading: false,
				event: { ...state.event, purchased: true },
			};
		case POST_PAYMENT_FAILED:
			return {
				...state,
				loading: true,
			};
		default:
			return state;
	}
}
