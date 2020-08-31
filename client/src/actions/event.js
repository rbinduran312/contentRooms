import api from '../utils/api';
import { setAlert } from './alert';

import {
	GET_EVENT,
	GET_EVENTS,
	EVENT_ERROR,
	UPDATE_EVENT,
	CLEAR_EVENT,
	BUY_EVENT,
	GET_PROFILE,
	PROFILE_ERROR,
	GET_VENUE,
	GET_VENUE_SUCCESS,
	GET_VENUE_FAILED,
	UPDATE_PURCHASE_STATUS,
	POST_PAYMENT,
	POST_PAYMENT_SUCCESS,
	POST_PAYMENT_FAILED,
} from './types';

// Get all events
export const getEvents = () => async (dispatch) => {
	dispatch({ type: CLEAR_EVENT });

	try {
		const res = await api.get('/events');

		dispatch({
			type: GET_EVENTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: EVENT_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Get event by ID
export const getEventById = (eventId) => async (dispatch) => {
	try {
		const res = await api.get(`/events/${eventId}/get`);
		console.log(`getEventById`);
		console.log(res);

		dispatch({
			type: GET_EVENT,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: EVENT_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Get event by ID
export const buyEventById = (eventId) => async (dispatch) => {
	try {
		console.log(`buyEventById`);
		const res = await api.get(`/events/${eventId}/buy`);
		console.log(res.data);
		dispatch({
			type: BUY_EVENT,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: EVENT_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

export const getVenue = (eventId) => async (dispatch) => {
	try {
		dispatch({
			type: GET_VENUE,
		});
		const res = await api.get(`/events/${eventId}/venue`);
		dispatch({
			type: GET_VENUE_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		console.log(err.response);
		dispatch({
			type: GET_VENUE_FAILED,
			payload: { msg: err.response.data.msg, status: err.response.status },
		});
	}
};

export const postPayment = (paymentObj) => async (dispatch) => {
	try {
		dispatch({
			type: POST_PAYMENT,
		});
		const resp = await api.post('payment/method/', paymentObj);
		dispatch({
			type: POST_PAYMENT_SUCCESS,
		});
	} catch (err) {
		dispatch({
			type: POST_PAYMENT_FAILED,
			payload: { msg: err.response.data.msg, status: err.response.status },
		});
	}
};
