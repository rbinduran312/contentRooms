import api from '../utils/api';
import { setAlert } from './alert';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_PROFILE,
} from './types';
import setAuthToken from './../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
	try {
		const res = await api.get('/auth');

		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});

		// update cognito auth tokens to persist session
		if (res.data.new_tokens) {
			setAuthToken(res.data.new_tokens);
		}
	} catch (err) {
		dispatch({
			type: AUTH_ERROR,
		});
	}
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
	const body = JSON.stringify({ name, email, password });

	try {
		const res = await api.post('/users', body);
		console.log(res)

		if (res.data.code === "redirect") {
			return res.data
		}

		return {code:"err", message:"Unknown"}
		// dispatch({
		// 	type: REGISTER_SUCCESS,
		// 	payload: res.data,
		// });
		// dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			// errors.forEach((error) => dispatch(setAlert(error.msg, 'danger', 10000)));
		}
		dispatch({
			type: REGISTER_FAIL,
		});
		return {code:"err", message:err.response.data.errors}
	}

};

// Login User
export const login = (email, password, google_token) => async (dispatch) => {
	try {
		let res = null
		if (google_token != null) {
			const body = JSON.stringify(google_token.tokenObj)
			res = await api.post('/auth/google_auth', body);
		}
		else {
			const body = JSON.stringify({ email, password });
			res = await api.post('/auth', body);
		}

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});

		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		console.log(errors)
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: LOGIN_FAIL,
		});
	}
};

// CheckLiveUsername / Clear Profile
export const checkLiveUsername = async (name) => {
	try {
		let res = null
		const body = JSON.stringify({ name });
		res = await api.post('/auth/check_name', body);
		return res.data

	} catch (err) {
		const errors = err.response.data.errors;
		console.log(errors)
		if (errors) {
		}
	}
	return {available: false}
};

// Forgot password
export const forgot_password = async (email) => {
	try {
		let res = null
		const body = JSON.stringify(email);
		console.log("Forgot_password - API")
		res = await api.post('/auth/forgot_password', body);
		console.log(res.data)
		return res.data

	} catch (err) {
		console.log(err)
		return {code: "err"}
	}

};

// reset password
export const reset_password = async ({verification_code, email, password1}) => {
	try {
		let res = null
		const body = JSON.stringify({email: email, verify_code: verification_code, password: password1});
		console.log("Reset password - API")
		res = await api.post('/auth/reset_password', body);
		console.log(res.data)
		return res.data
	} catch (err) {
		console.log(err)
		return {code: "err"}
	}
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
	dispatch({ type: CLEAR_PROFILE });
	dispatch({ type: LOGOUT });
};
