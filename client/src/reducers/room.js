import {
    GET_ROOM,
    GET_ROOMS,
    ROOM_ERROR,
    UPDATE_ROOM,
    CLEAR_ROOM
  } from '../actions/types';
  
  const initialState = {
    room: null,
    rooms: [],
    loading: true,
    error: {}
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_ROOM:
      case UPDATE_ROOM:
        return {
          ...state,
          room: payload,
          loading: false
        };
      case GET_ROOMS:
        return {
          ...state,
          rooms: payload,
          loading: false
        };
      case ROOM_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
          room: null
        };
      case CLEAR_ROOM:
        return {
          ...state,
          room: null,
        };
      default:
        return state;
    }
  }
  