import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_ROOM,
  GET_ROOMS,
  ROOM_ERROR,
  UPDATE_ROOM,
  CLEAR_ROOM,
} from './types';

// Get all rooms
export const getRooms = () => async dispatch => {
  dispatch({ type: CLEAR_ROOM });

  try {
    const res = await api.get('/rooms');

    dispatch({
      type: GET_ROOMS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get room by ID
export const getRoomById = roomId => async dispatch => {
  try {
    const res = await api.get(`/rooms/${roomId}`);

    dispatch({
      type: GET_ROOM,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};


// // Create or update profile
// export const createProfile = (
//   formData,
//   history,
//   edit = false
// ) => async dispatch => {
//   try {
//     const res = await api.post('/profile', formData);

//     dispatch({
//       type: GET_PROFILE,
//       payload: res.data
//     });

//     dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

//     if (!edit) {
//       history.push('/dashboard');
//     }
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//     }

//     dispatch({
//       type: PROFILE_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

